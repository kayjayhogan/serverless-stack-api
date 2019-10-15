import { success, failure } from './libs/response-lib';
import * as dynamoDbLib from './libs/dynamodb-lib';

export async function main(event, context) {

  const params = {
    TableName: process.env.tableName,
    KeyConditionExpression: "userId = :userId", // defines condition for query
    ExpressionAttributeValues: {
      ":userId": event.requestContext.identity.cognitoIdentityId // defines value in condition
    }
  };

  try {
    const result = await dynamoDbLib.call('query', params);
    if(result.Items) {
      return success(result.Items);
    } else {
      return failure({ status: false, error: "Items not found." });
    }
  } catch(err) {
    console.log('Error getting notes: ', err);
    return failure({ status: false });
  }

}