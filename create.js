import uuid from 'uuid';
import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export function main(event, context, callback) {
  // request body is passed in as JSON encoded string in event.body
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId, // user identities federated through Cognito Identity Pool, use identity id as user id of authenticated user
      noteId: uuid.v1(),
      content: data.content, // parsed from req body
      attachment: data.attachment, // parsed from req body
      createdAt: Date.now()
    }
  };

  dynamoDB.put(params, (err, data) => {
    // enable CORS
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    };

    if(err) {
      let response = {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({
          status: false
        })
      };
      callback(null, response);
      return;
    }
    let response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(params.Item)
    };
    callback(null, response);
  });
};