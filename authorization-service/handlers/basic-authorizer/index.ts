import { APIGatewayTokenAuthorizerHandler, APIGatewayAuthorizerResult } from 'aws-lambda';

const UNAUTHORIZED = 'Unauthorized';

export const handler: APIGatewayTokenAuthorizerHandler = (event, _context, callback) => {
  console.log('Basic authorizer parser: ', event);
  try {

    if (event.type !== 'TOKEN') {
      callback(UNAUTHORIZED);
    }

    const token = event.authorizationToken.split(' ')[1];
    const buff = Buffer.from(token, 'base64');
    const [ username, password ] = buff.toString('utf-8').split(':');
    const storedPassword = process.env[username];

    const effect = !storedPassword || storedPassword !== password ? 'Deny' : 'Allow';
    const policy = generatePolicy(token, event.methodArn, effect);

    callback(null, policy);


  }catch (error) {
    console.error('Basic authorizer parser error:', error.message);
    callback(`${UNAUTHORIZED} ${error.message}`);
  }
}

const generatePolicy = (principalId: string, resource: string, effect = 'Allow') : APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  }
}