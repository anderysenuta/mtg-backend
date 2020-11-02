import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import products from '../../../mocks/products'
import { handler } from '../index';


describe("Get Product By Id", () => {
  test("should return products by id", async () => {
    const event = {
      pathParameters: { productId: '1669af17-d287-5094-b005-4b143441442f' }
    };
    const mockResponse = {
      statusCode: 200,
      body: JSON.stringify(products[0])
    }

    const res = await handler((event as unknown) as APIGatewayProxyEvent, {} as Context, jest.fn());

    expect(res).toStrictEqual(mockResponse);
  })

  test("should return error if product not found", async () => {
    const productId = 'xxxx';
    const event = { pathParameters: { productId } };
    const mockResponse = {
      statusCode: 400,
      body: JSON.stringify(`Product with id='${productId}' not found!`)
    }

    const res = await handler((event as unknown) as APIGatewayProxyEvent, {} as Context, jest.fn());

    expect(res).toStrictEqual(mockResponse);
  })
})