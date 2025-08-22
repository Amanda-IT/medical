import json
from datetime import datetime
import boto3
import os
import uuid

# DynamoDB table name from environment variable
TABLE_NAME = os.environ.get("APPOINTMENTS_TABLE", "explorers-memberhub-appointment")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)


def lambda_handler(event, context):
    method = event.get("httpMethod", event.get('requestContext', {}).get('http', {}).get('method'))
    path = event.get("rawPath", event.get('requestContext', {}).get('http', {}).get('path'))

    if path == "/book" and method == "POST":
        return book_appointment(event)
    elif path == "/appointments" and method == "GET":
        return list_appointments(event)
    else:
        return {
            "statusCode": 404,
            "body": json.dumps({"error": "Not Found"})
        }


def book_appointment(event):
    try:
        body = json.loads(event.get("body") or "{}")
        user_id = body.get("user_id")
        patient_name = body.get("patient_name")
        doctor_name = body.get("doctor_name")
        appointment_time = body.get("appointment_time")

        if not user_id or not patient_name or not doctor_name or not appointment_time:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing required fields"})
            }

        appointment_id = str(uuid.uuid4())

        table.put_item(
            Item={
                "user_id": user_id,  # Partition key
                "appointment_id": appointment_id,  # Sort key
                "patient_name": patient_name,
                "doctor_name": doctor_name,
                "appointment_time": appointment_time,
                "created_at": datetime.utcnow().isoformat()
            }
        )

        return {
            "statusCode": 201,
            "body": json.dumps({"message": "Appointment booked", "appointment_id": appointment_id})
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }


def list_appointments(event):
    try:
        params = event.get("queryStringParameters") or {}
        user_id = params.get("user_id")

        if not user_id:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing user_id query parameter"})
            }

        response = table.query(
            KeyConditionExpression=boto3.dynamodb.conditions.Key("user_id").eq(user_id)
        )

        return {
            "statusCode": 200,
            "body": json.dumps(response.get("Items", []))
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
