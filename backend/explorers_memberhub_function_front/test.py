from example.explorers_memberhub_function_front.lambda_function import lambda_handler


def main():

    event = {
    "version": "2.0",
    "routeKey": "$default",
    "rawPath": "/api/chat",
    "rawQueryString": "",
    "headers": {
        "x-amzn-tls-cipher-suite": "TLS_AES_128_GCM_SHA256",
        "content-length": "387",
        "x-amzn-tls-version": "TLSv1.3",
        "x-amzn-trace-id": "Root=1-689af2ca-4ec1a6190eadcb002b745a51",
        "x-forwarded-proto": "https",
        "host": "42afxcdgh6x25byknycrtbqiwe0nxjzf.lambda-url.us-east-1.on.aws",
        "x-forwarded-port": "443",
        "content-type": "application/json",
        "x-forwarded-for": "2603:c024:c008:a100:9a93:92b1:949a:890",
        "Authorization": "Bearer eyJhbGciOiAibm9uZSIsICJ0eXAiOiAiSldUIn0.eyJ1c2VySWQiOiAiYTc1NzIyMjkiLCAidXNlck5hbWUiOiAibmFtZTEifQ.",
        "user-agent": "curl/8.7.1"
    },
    "requestContext": {
        "accountId": "anonymous",
        "apiId": "42afxcdgh6x25byknycrtbqiwe0nxjzf",
        "domainName": "42afxcdgh6x25byknycrtbqiwe0nxjzf.lambda-url.us-east-1.on.aws",
        "domainPrefix": "42afxcdgh6x25byknycrtbqiwe0nxjzf",
        "http": {
            "method": "POST",
            "path": "/api/chat",
            "protocol": "HTTP/1.1",
            "sourceIp": "2603:c024:c008:a100:9a93:92b1:949a:890",
            "userAgent": "curl/8.7.1"
        },
        "requestId": "4e6c72ad-0640-414b-b72d-30ad77167e7b",
        "routeKey": "$default",
        "stage": "$default",
        "time": "12/Aug/2025:07:52:42 +0000",
        "timeEpoch": 1754985162888
    },
    "body": """{
    \"contents\": [
        {
            \"parts\": [
                {
                    \"text\": \"Please input your symptoms.\"
                }
            ],
            \"role\": \"assistant\"
        },
        {
            \"parts\": [
                {
                    \"text\": \"Please analyze my symptoms: 65岁,女性, 有高血压历史, 最近3天出现胸闷, 气短症状. 请推荐几位上海专家医生.\"
                }
            ],
            \"role\": \"user\"
        }
    ]
}""",
    "isBase64Encoded": 0
}

    result=lambda_handler(event, None)
    print(result)

def login_test():

    event = {
    "version": "2.0",
    "routeKey": "$default",
    "rawPath": "/api/login",
    "rawQueryString": "",
    "headers": {
    },
    "requestContext": {
        "accountId": "anonymous",
        "apiId": "42afxcdgh6x25byknycrtbqiwe0nxjzf",
        "domainName": "42afxcdgh6x25byknycrtbqiwe0nxjzf.lambda-url.us-east-1.on.aws",
        "domainPrefix": "42afxcdgh6x25byknycrtbqiwe0nxjzf",
        "http": {
            "method": "POST",
            "path": "/api/login",
            "protocol": "HTTP/1.1",
            "sourceIp": "2603:c024:c008:a100:9a93:92b1:949a:890",
            "userAgent": "curl/8.7.1"
        },
        "requestId": "4e6c72ad-0640-414b-b72d-30ad77167e7b",
        "routeKey": "$default",
        "stage": "$default",
        "time": "12/Aug/2025:07:52:42 +0000",
        "timeEpoch": 1754985162888
    },
    "body": """{
    "userName": "name2",
    "password": "test"
}""",
    "isBase64Encoded": 0
}

    result=lambda_handler(event, None)
    print(result)


if __name__ == "__main__":
    login_test()
