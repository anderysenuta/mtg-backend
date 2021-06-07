import {SQSHandler} from 'aws-lambda';

export const handler: SQSHandler = async (event) => {
  console.log("Article Batch process handler invoked", event);

  try {
    const arr = [];

    for (const item of event.Records) {
      const { tenant_id, article, time } = JSON.parse(item.body);
      arr.push(fakeRequest(tenant_id, article, time))
    }

    await Promise.all(arr);


  }catch (error) {
    console.error(error);
  }
}


const fakeRequest = (tenant_id, article, time) => {
  return new Promise((resolve => {
    console.log(`${tenant_id} Start processing  ${article}`);

    setTimeout(() => {
      console.log(`${tenant_id} Finish processing  ${article}`);
      resolve()
    }, time);

  }))
}
