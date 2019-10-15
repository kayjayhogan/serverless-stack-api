import { success, failure } from './libs/response-lib';
import * as dynamoDbLib from './libs/dynamodb-lib';

export async function main(event, context) {

  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.tableName,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    },
    UpdateExpression: 'SET content = :content, attachment = :attachment', // defines attributes to be updated
    ExpressionAttributeValues: { // defines value in update expression
      ':attachment': data.attachment || null,
      ':content': data.content || null
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    await dynamoDbLib.call('update', params);
    return success({ status: true });
  } catch(err) {
    console.log('Error updating: ', err);
    return failure({ status: false });
  }

};