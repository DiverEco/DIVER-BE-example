import json
import uuid
import boto3
import jwt
import urllib.parse
from mimetypes import guess_type

# Secret key for JWT validation (must match the key used for token generation)
SECRET_KEY = 'XXXXXXXXXXXXXXXXXXXX'

s3_client = boto3.client('s3')

def lambda_handler(event, context):

    token = event['headers']['Authorization']

    if not token:
        return {
            'statusCode': 401,
            'body': json.dumps({'message': 'Missing JWT token'}),
        }

    try:
        # Validate the JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        
        # return {
        #     'statusCode': 200,
        #     'body': json.dumps({'message': 'Token is valid', 'username': payload['username']}),
        # }
    except jwt.ExpiredSignatureError:
        return {
            'statusCode': 401,
            'body': json.dumps({'message': 'Token has expired'}),
        }
    except jwt.InvalidTokenError:
        return {
            'statusCode': 401,
            'body': json.dumps({'message': 'Invalid token'}),
        }

    bucket_name = 'diver-gift-blob'
    
    filename_raw = None
    if event['queryStringParameters'] is not None:
        filename_raw = event['queryStringParameters'].get('filename',None)
        

    result = dict()
    if filename_raw is None:
        result['msg'] = "Wrong parm"
        return {
        	'statusCode': 400,
        	'body': json.dumps(result)
        }
    
    mime = guess_type(filename_raw, strict=False)[0]
    if mime is None:
        return {
            'statusCode': 401,
            'body': json.dumps({'message': 'unknow file type'}),
        }
    random_file_name = str(uuid.uuid4())+ '.' + filename_raw.split('.')[-1]
    presigned_url = s3_client.generate_presigned_url(
        'put_object',
        Params={
            'Bucket': bucket_name,
            'Key': random_file_name,
            "ContentType": mime
        },
        ExpiresIn=3600  # URL expiration time in seconds
    )

    response = {
        'presignedUrl': presigned_url,
        'accessUrl': "https://resource.web3-zexagift.com/"+random_file_name
    }

    return {
        'statusCode': 200,
        'body': json.dumps(response),
        'headers': {
            'Access-Control-Allow-Credentials': True,
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Content-Type': 'application/json',
        }
    }
