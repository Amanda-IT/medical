from example.agent_action_group_lambda.dummy_lambda import lambda_handler


def main():

    event = {
    "messageVersion": "1.0",
    "agent": {
        "name": "string",
        "id": "string",
        "alias": "string",
        "version": "string"
    },
    "inputText": "string",
    "sessionId": "string",
    "actionGroup": "string",
    "apiPath": "/appointment",
    "httpMethod": "GET",
    "parameters": [
        {
            "name": "string",
            "type": "string",
            "value": "string"
        }
    ],
    "requestBody": {
        "content": {
            "<content_type>": {
                "properties": [
                   {
                       "name": "string",
                       "type": "string",
                       "value": "string"
                    } 
                ]
            }
        }
    },
    "sessionAttributes": {
        "string": "string"
    },
    "promptSessionAttributes": {
        "string": "string"
    }
}

    event2 ={
  "messageVersion": "1.0",
  "parameters": [],
  "sessionId": "af7e1c6c-d5ba-4b67-a1e1-d1ce8b173d4b",
  "agent": {
    "name": "explorers-memberhub-agent",
    "version": "DRAFT",
    "id": "JD5TAKGZOI",
    "alias": "TSTALIASID"
  },
  "actionGroup": "explorers-memberhub-action_group",
  "httpMethod": "POST",
  "apiPath": "/book",
  "requestBody": {
    "content": {
      "application/json": {
        "properties": [
          {
            "name": "user_id",
            "type": "string",
            "value": "1"
          },
          {
            "name": "patient_name",
            "type": "string",
            "value": "老王"
          },
          {
            "name": "appointment_time",
            "type": "string",
            "value": "2023-05-11 13:00:00"
          },
          {
            "name": "doctor_name",
            "type": "string",
            "value": "张医生"
          }
        ]
      }
    }
  },
  "sessionAttributes": {},
  "promptSessionAttributes": {},
  "inputText": "帮user_id 老王 1 预约 张医生, 明天下午1点."
}

    result=lambda_handler(event2, None)
    print(result)


if __name__ == "__main__":
    main()
