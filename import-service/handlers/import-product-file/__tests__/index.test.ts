import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import AWSMock  from 'aws-sdk-mock';
import { handler, BUCKET_NAME } from '../index';

const MOCK_URL = 'https://' + BUCKET_NAME + '.s3.amazonaws.com/uploaded'

describe("Import Products File", () => {
  test("should return signed url", async () => {
    const event = {
      queryStringParameters: {
        name: 'test-file-name'
      }
    };

    AWSMock.mock('S3', 'getSignedUrl', (_, _params, callback) => {
      callback(null, MOCK_URL)
    })

    const res = await handler((event as unknown) as APIGatewayProxyEvent, {} as Context, jest.fn());

    // @ts-ignore
    const equal = res.body.includes(MOCK_URL);
    expect(equal).toBe(true);
  })
})
