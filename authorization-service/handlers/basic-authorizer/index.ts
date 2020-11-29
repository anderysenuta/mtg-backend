import { S3Handler } from 'aws-lambda';

export const handler: S3Handler = (event, _context) => {
  console.log('Basic authorizer parser: ', event);
  try {
    console.log('init');
  }catch (error) {
    console.error('Basic authorizer parser error:', error.message);
  }
}

