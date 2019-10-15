import uuid from 'uuid';
import { success, failure } from './libs/response-lib';
import * as dynamoDbLib from './libs/dynamodb-lib';

export async function main(event, context) {

  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call('put', params);
    return success(params.Item);
  } catch(err) {
    console.log('Error creating: ', err);
    return failure({ status: false });
  }

};