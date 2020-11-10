import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import products from '../../../mocks/products'
import { handler } from '../index';


describe("Get Products", () => {
  test("should return all products", async () => {
    const event = {};
    const mockResponse = {
      statusCode: 200,
      body: JSON.stringify(products)
    }

    const res = await handler(event as APIGatewayProxyEvent, {} as Context, jest.fn());

    expect(res).toStrictEqual(mockResponse);
  })
})
