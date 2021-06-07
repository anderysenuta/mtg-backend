import { APIGatewayProxyHandler } from 'aws-lambda';
import SQS from 'aws-sdk/clients/sqs';


export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Share Article handler: ', event);
  const sqs = new SQS();
  const { SQS_URL } = process.env;

  try {

    const data = JSON.parse(event.body);


    const arr = [];

    data.forEach(item => {

      item.articles.forEach(article => {
        item.timestamp = +new Date();

        const record = {
          tenant_id: item.tenant_id,
          time: item.time,
          article
        };

        arr.push(
            sqs.sendMessage({
              QueueUrl: SQS_URL,
              MessageBody: JSON.stringify(record),
              MessageGroupId: item.tenant_id,
            }).promise()
        )
      })
    })

    await Promise.all(arr)

    console.log('====FINISHED');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': false
      },
      body: JSON.stringify([])
    };
  }catch (error) {
    console.error('Share Article handler error:', error.message);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify(error.message),
    };
  }
}
