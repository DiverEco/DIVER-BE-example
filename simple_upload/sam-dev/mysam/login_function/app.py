import json
import jwt

# Secret key for JWT
SECRET_KEY = 'XXXXXXXXXXXXXXXXXXXXXXXX'

def lambda_handler(event, context):
    try:
        # Parse the incoming POST request
        body = json.loads(event['body'])

        if 'username' not in body or 'password' not in body:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Missing username or password'}),
            }

        # Your authentication logic
        username = body['username']
        password = body['password']

        # Replace with your own authentication logic
        # For example, you can check credentials against a database
        # For this example, we'll use a simple password check using bcrypt
        
        # XXXXXXX sha256
        hashed_password = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'  # Replace with the hashed password from your database
        if password == hashed_password and username == 'diver':
            # Generate a JWT token
            jwt_token = jwt.encode({'username': username}, SECRET_KEY, algorithm='HS256')
            
            return {
                'statusCode': 200,
                'body': json.dumps({'jwt_token': jwt_token}),
                'headers': {
                    'Access-Control-Allow-Credentials': True,
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET',
                    'Content-Type': 'application/json',
                } ,
            }
        else:
            return {
                'statusCode': 401,
                'body': json.dumps({'message': 'Authentication failed'}),
            }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
