from example.appointment_lambdaservice.lambda_function import lambda_handler


def main():


    event = {
  "version": "2.0",
  "routeKey": "$default",
  "rawPath": "/appointments",
  "rawQueryString": "user_id=2",
  "headers": {
    "content-length": "53",
    "x-amzn-tls-version": "TLSv1.3",
    "x-amz-date": "20250810T141629Z",
    "x-forwarded-proto": "https",
    "x-forwarded-port": "443",
    "x-forwarded-for": "35.169.124.182",
    "x-amz-security-token": "BquHYMqBClb+UbYwqwOiFV",
    "accept": "*/*",
    "x-amzn-tls-cipher-suite": "TLS_AES_128_GCM_SHA256",
    "x-amzn-trace-id": "Root=1-6898a9bd-7a3f52ef6cacd3d3157f2ef5",
    "host": "rruaealyapf6huhzsnxhz4bi5q0azqkq.lambda-url.us-east-1.on.aws",
    "content-type": "application/json",
    "accept-encoding": "gzip, deflate",
    "user-agent": "python-requests/2.32.4"
  },
  "queryStringParameters": {
    "user_id": "2"
  },
  "requestContext": {
    "accountId": "133286763062",
    "apiId": "rruaealyapf6huhzsnxhz4bi5q0azqkq",
    "authorizer": {
      "iam": {
        "accessKey": "ASIAR6CECTI3LMHYCMZZ",
        "accountId": "133286763062",
        "callerId": "AROAR6CECTI3GQPXYPEK2:explorers-memberhub-agent-action_group-547xo",
        "cognitoIdentity": 0,
        "principalOrgId": "o-5s4y9wbq4q",
        "userArn": "arn:aws:sts::133286763062:assumed-role/explorers-memberhub-agent-action_group-547xo-role-TOOELSR5YP/explorers-memberhub-agent-action_group-547xo",
        "userId": "AROAR6CECTI3GQPXYPEK2:explorers-memberhub-agent-action_group-547xo"
      }
    },
    "domainName": "rruaealyapf6huhzsnxhz4bi5q0azqkq.lambda-url.us-east-1.on.aws",
    "domainPrefix": "rruaealyapf6huhzsnxhz4bi5q0azqkq",
    "http": {
      "method": "GET",
      "path": "/appointments",
      "protocol": "HTTP/1.1",
      "sourceIp": "35.169.124.182",
      "userAgent": "python-requests/2.32.4"
    },
    "requestId": "8a1222f7-5f60-4058-8bb5-e0d7b69878c4",
    "routeKey": "$default",
    "stage": "$default",
    "time": "10/Aug/2025:14:16:29 +0000",
    "timeEpoch": 1754835389839
  },
  "body": "[]",
  "isBase64Encoded": 0
}


    result=lambda_handler(event, None)
    print(result)


if __name__ == "__main__":
    main()
