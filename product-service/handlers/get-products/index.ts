import { APIGatewayProxyHandler } from 'aws-lambda';
import { Client } from 'pg';
import dbOptions from '../../utils/dbOptions';

export const handler: APIGatewayProxyHandler = async () => {
  console.log("Get products handler invoked");
  let client = null;

  try {
    client = new Client(dbOptions);
    await client.connect();

    const query = {
      text: 'SELECT * FROM products p LEFT JOIN stocks s on p.id = s.product_id',
    }
    const res = await client.query(query)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': false
      },
      body: JSON.stringify(res.rows),
    };
  }catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }finally {
    client.end()
  }
}
