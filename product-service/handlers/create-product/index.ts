import { APIGatewayProxyHandler } from 'aws-lambda';
import { Client } from 'pg';
import dbOptions from '../../utils/dbOptions';

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Create product handler: ', event);
  let client = null;

  try {
    const { title, description, price, count } = JSON.parse(event.body);
    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof price !== "number" ||
      typeof count !== "number"
    ) {
      throw { status: 400, message: 'Product data is invalid' };
    }

    client = new Client(dbOptions);
    await client.connect();

    await client.query('BEGIN');
    const query = {
      text: 'INSERT INTO products(title, description, price) VALUES($1, $2, $3) RETURNING id',
      values: [title, description, price]
    };
    const { rows } = await client.query(query)
    const insertPhotoText = 'INSERT INTO stocks(product_id, count) VALUES ($1, $2)'
    const insertPhotoValues = [rows[0].id, count]
    await client.query(insertPhotoText, insertPhotoValues)
    await client.query('COMMIT')

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': false
      },
      body: JSON.stringify(rows[0])
    };
  }catch (error) {
    console.error('Create product error:', error.message);
    if (client) {
      await client.query('ROLLBACK')
    }
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify(error.message),
    };
  }finally {
    if (client) {
      client.end()
    }
  }
}
