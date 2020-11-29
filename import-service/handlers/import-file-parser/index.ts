import S3 from 'aws-sdk/clients/s3';
import SQS from 'aws-sdk/clients/sqs';
import { S3Handler } from 'aws-lambda';
import csv from 'csv-parser';

const BUCKET_NAME = 'mtg-application-import-bucket';

export const handler: S3Handler = (event, _context) => {
  console.log('Import product parser: ', event);
  try {
    const s3 = new S3();
    const sqs = new SQS();
    const { SQS_URL } = process.env;

    event.Records.forEach((record) => {
      const s3Stream = s3.getObject({
        Bucket: BUCKET_NAME,
        Key: record.s3.object.key
      }).createReadStream();

      s3Stream.pipe(csv(['title', 'description', 'price']))
        .on('data', (data) => {
          sqs.sendMessage({
            QueueUrl: SQS_URL,
            MessageBody: JSON.stringify(data)
          }, (err)=> {
          if (err) throw err;
          })
        })
        .on('end', async () => {
          console.log('Copy from ' + BUCKET_NAME + '/' + record.s3.object.key);

          const fileName = record.s3.object.key.replace('uploaded', 'parsed');
          await s3.copyObject({
            Bucket: BUCKET_NAME,
            CopySource: BUCKET_NAME + '/' + record.s3.object.key,
            Key: fileName
          }).promise();
          await s3.deleteObject({
            Bucket: BUCKET_NAME,
            Key: record.s3.object.key
          }).promise();

          console.log('Copied to ' + BUCKET_NAME + '/' + fileName);
        })
    })
  }catch (error) {
    console.error('Import product parser error:', error.message);
  }
}

