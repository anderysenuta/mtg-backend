import SNS from 'aws-sdk/clients/sns';
import { SQSHandler } from 'aws-lambda';
import { Client } from 'pg';
import dbOptions from '../../utils/dbOptions';

export const handler: SQSHandler = async (event) => {
  console.log("Catalog Batch process handler invoked");
  const { SNS_ARN } = process.env;
  let client = null;

  try {
    const sns = new SNS();
    client = new Client(dbOptions);
    await client.connect();

    for (const item of event.Records) {
      const { title, description, price } = JSON.parse(item.body);
      const parsedPrice = Number(price);

      if (
        typeof title !== "string" ||
        typeof description !== "string" ||
        typeof parsedPrice !== "number"
      ) {
        throw { statusCode: 400, message: 'Product data is invalid' };
      }

      const query = {
        text: 'INSERT INTO products(title, description, price) VALUES($1, $2, $3) RETURNING id',
        values: [title, description, price]
      };

      await client.query(query);


      sns.publish({
        Subject: `Product ${title} was saved in database`,
        Message: JSON.stringify({ title, description, parsedPrice }),
        TopicArn: SNS_ARN
      }, (err) => {
        if (err) {
          throw err
        }
      })
    }

  }catch (error) {
    console.error(error);
  }finally {
    client.end()
  }
}
