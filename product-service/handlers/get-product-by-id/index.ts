import { APIGatewayProxyHandler } from 'aws-lambda';
import products from '../../mocks/products';

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const { productId } = event.pathParameters;
    if (!productId) {
      throw new Error('Please provide product id!');
    }

    const product = products.find(item => item.id === productId);
    if (!product) {
      throw new Error(`Product with id='${productId}' not found!`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };

  }catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify(error.message),
    }
  }
}

