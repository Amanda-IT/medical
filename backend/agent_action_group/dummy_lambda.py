import logging
from typing import Dict, Any
from http import HTTPStatus
import json
import boto3
import json
import urllib.parse
import botocore.session
import botocore.awsrequest
import botocore.auth
import requests

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    AWS Lambda handler for processing Bedrock agent requests.

    Args:
        event (Dict[str, Any]): The Lambda event containing action details
        context (Any): The Lambda context object

    Returns:
        Dict[str, Any]: Response containing the action execution results

    Raises:
        KeyError: If required fields are missing from the event
    """
    # try:
    # function = event['function']
    apiPath = event['apiPath']
    httpMethod = event['httpMethod']
    parameters = event.get('parameters', [])
    requestBody = event.get("requestBody", {}).get("content", {}).get("application/json", {}).get("properties", {})

    logger.info('event body: %s', event)

    # Execute your business logic here. For more information,
    # refer to: https://docs.aws.amazon.com/bedrock/latest/userguide/agents-lambda.html

    # Lambda 2 Function URL
    function_url = "https://rruaealyapf6huhzsnxhz4bi5q0azqkq.lambda-url.us-east-1.on.aws"

    param = {}
    for p in parameters or []:
        param[p['name']] = p['value']
    query_string = urllib.parse.urlencode(param)
    function_url = function_url + apiPath + "?" + query_string
    logger.info('function_url: %s', function_url)

    data = parameters
    if httpMethod == "POST":
        data = {}
        for p in requestBody or []:
            data[p['name']] = p['value']

    # 创建 SigV4 签名请求
    session = botocore.session.get_session()
    creds = session.get_credentials().get_frozen_credentials()
    request = botocore.awsrequest.AWSRequest(
        method=httpMethod,
        url=function_url,
        data=json.dumps(data),
        headers={"Content-Type": "application/json"}
    )

    signer = botocore.auth.SigV4Auth(creds, "lambda", "us-east-1")
    signer.add_auth(request)

    logger.info('data: %s', data)

    # 发起请求
    response = requests.request(
        httpMethod,
        function_url,
        headers=dict(request.headers.items()),
        data=json.dumps(data),
        json=data
    )

    response_body = {
        'application/json': {
            'body': response.text
        }
    }

    action_response = {
        'actionGroup': event['actionGroup'],
        'apiPath': event['apiPath'],
        'httpMethod': event['httpMethod'],
        'httpStatusCode': 200,
        'responseBody': response_body
    }

    session_attributes = event['sessionAttributes']
    prompt_session_attributes = event['promptSessionAttributes']

    api_response = {
        'messageVersion': '1.0',
        'response': action_response,
        'sessionAttributes': session_attributes,
        'promptSessionAttributes': prompt_session_attributes
    }

    return api_response

