import base64
import json
import logging
import mimetypes
import os
import time

import boto3

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = boto3.client("bedrock-agent-runtime", region_name="us-east-1")
FLOW_ID = 'FKV9QAM4KL'
FLOW_ALIAS_ID = 'UWI93S3IQM'


def lambda_handler(event, context):
    print(event)
    method = event.get("httpMethod", event.get('requestContext', {}).get('http', {}).get('method'))
    path = event.get("rawPath", event.get('requestContext', {}).get('http', {}).get('path', ''))

    if path == "/api/chat" and method == 'POST':
        return handle_chat(event)
    if path == "/api/login" and method == 'POST':
        return handle_login(event)

    return handle_static_file(path)


def handle_chat(event):
    headers = event.get("headers", {})
    auth_header = headers.get("Authorization", headers.get("x-authorization", headers.get("authorization", "")))
    token = auth_header.replace("Bearer ", "").strip()
    jwt = parse_jwt(token)
    print(jwt)
    if not jwt.get("userId"):
        return {
            "statusCode": 401,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": "please add Authorization Header"
        }
    body_data = json.loads(event["body"])
    # response = invoke_flow("我头疼恶心想吐, 是怎么啦",None)
    new_input = body_data["contents"][-1]["parts"][0]["text"]
    history = body_data["contents"][:-1]
    user_input = new_input
    if history:
        user_input = f"""CHAT HISTORY:{history} \nNEW INPUT: {new_input}"""
    user_input = f"""CONTEXT: \nCURRENT USER: {jwt}  \n{user_input}"""
    if len(user_input) > 10000:
        return {
            "statusCode": 400,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": "user input too large"
        }
    print(user_input)
    response = invoke_flow(user_input, None)
    print(response)
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",  # 允许本地前端
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
        "body": json.dumps(response)
    }


def invoke_flow(user_input, execution_id):
    response = None
    request_params = None

    flow_input_data = {
        "content": {
            "document": user_input
        },
        "nodeName": "FlowInputNode",
        "nodeOutputName": "document"
    }

    if execution_id is None:
        # Don't pass execution ID for first run.
        request_params = {
            "flowIdentifier": FLOW_ID,
            "flowAliasIdentifier": FLOW_ALIAS_ID,
            "inputs": [flow_input_data],
            "enableTrace": True
        }
    else:
        request_params = {
            "flowIdentifier": FLOW_ID,
            "flowAliasIdentifier": FLOW_ALIAS_ID,
            "executionId": execution_id,
            "inputs": [flow_input_data],
            "enableTrace": True
        }

    response = client.invoke_flow(**request_params)
    if "executionId" not in request_params:
        execution_id = response['executionId']

    result = extract_data_from_response_stream(response.get("responseStream", []))

    return {
        "contents": result,
        "executionId": execution_id
    }


def extract_data_from_response_stream(events):
    outputs = []
    for event in events:
        print(event)
        if 'flowOutputEvent' in event:
            text = event['flowOutputEvent']['content']['document']
            print(text)
            outputs.append(text)
        # elif 'flowCompletionEvent' in event:
        #     outputs.append({
        #         'type': 'completion',
        #         'reason': event['flowCompletionEvent']['completionReason']
        #     })

    text = "".join(outputs)
    parts = [{
        'text': text
    }]
    if "[{" in text[:5]:
        parts = json.loads(text)
    return [{
        'role': 'assistant',
        "parts": parts
    }]

def b64url_encode(b: bytes) -> str:
    # Base64URL（去掉=）
    return base64.urlsafe_b64encode(b).rstrip(b'=').decode('ascii')

def parse_jwt(token):
    if not token:
        return {}
    try:
        parts = token.split('.')
        if len(parts) < 2:
            raise ValueError("JWT 格式错误")

        payload_b64 = parts[1] + '=' * (-len(parts[1]) % 4)  # 补齐 Base64
        payload_json = base64.urlsafe_b64decode(payload_b64.encode()).decode('utf-8')
        return json.loads(payload_json)
    except Exception as e:
        raise ValueError(f"JWT 解析失败: {e}")

def gen_jwt(payload):
    now = int(time.time())
    payload["iat"] = now,  # 签发时间
    payload["exp"] = now + 3600  # 过期时间（1小时）

    header = json.dumps({"alg": "none", "typ": "JWT"}).encode('utf-8')
    token = f"{b64url_encode(header)}.{b64url_encode(json.dumps(payload).encode('utf-8'))}."
    return token

def handle_static_file(path):
    safe_path = path.lstrip("/")
    if safe_path == '':
        safe_path = "index.html"
    file_path = os.path.join("static", safe_path)

    if not os.path.isfile(file_path):
        return {
            "statusCode": 404,
            "body": "File not found",
            "headers": {"Content-Type": "text/plain"}
        }

    # Guess content type
    content_type, _ = mimetypes.guess_type(file_path)
    content_type = content_type or "application/octet-stream"

    with open(file_path, "rb") as f:
        content = f.read()

    # Return base64 encoded for binary-safe response
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": content_type
        },
        "body": base64.b64encode(content).decode("utf-8"),
        "isBase64Encoded": True
    }


def handle_login(event):
    body_data = json.loads(event["body"])
    user_name = body_data.get("userName")
    import uuid

    short_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, user_name))[:8]

    info = {
        "userId": short_id,
        "userName": user_name
        }
    print(info)
    response = {
        "access_token": gen_jwt(info),
        "token_type": "Bearer"
    }
    print(response)

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(response)
    }