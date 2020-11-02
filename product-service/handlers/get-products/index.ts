import { APIGatewayProxyHandler } from 'aws-lambda';
import products from '../../mocks/products';

export const handler: APIGatewayProxyHandler = async () => {
  try {

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };

  }catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error.message),
    };
  }

}
