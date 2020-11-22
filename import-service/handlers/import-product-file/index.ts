import S3 from 'aws-sdk/clients/s3';
import { APIGatewayProxyHandler } from 'aws-lambda';

export const BUCKET_NAME = 'mtg-application-import-bucket';

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  console.log('Import product handler: ', event);
  try {
    const s3 = new S3();
    const { name } = event.queryStringParameters;

    const params = {
      Bucket: BUCKET_NAME,
      Key: `uploaded/${name}`,
      Expires: 60,
      ContentType: 'text/csv'
    }

    const url = await s3.getSignedUrlPromise('putObject', params);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': false
      },
      body: url,
    };
  }catch (error) {
    console.error('Import product handler error:', error.message);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify(error.message),
    };
  }
}

