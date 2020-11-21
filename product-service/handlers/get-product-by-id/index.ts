import { APIGatewayProxyHandler } from 'aws-lambda';
import { Client } from 'pg';
import dbOptions from '../../utils/dbOptions';

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  console.log('Get product handler: ', event);
  let client = null;

  try {
    client = new Client(dbOptions);
    await client.connect();

    const { productId } = event.pathParameters;
    if (!productId) {
      throw new Error('Please provide product id!');
    }

    const query = {
      text: 'SELECT * FROM products p LEFT JOIN stocks s on p.id = s.product_id WHERE id = $1',
      values: [productId]
    }

    const { rows } = await client.query(query);
    if (!rows.length) {
      throw { statusCode: 404, message: `Product with id=${productId} not found` };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': false
      },
      body: JSON.stringify(rows[0]),
    };
  }catch (error) {
    console.error('Get product by id error:', error.message);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify(error.message),
    };
  }finally {
    client.end()
  }
}

