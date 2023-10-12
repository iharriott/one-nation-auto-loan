import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "./ddbClient";
import { DeleteItemCommand, GetItemCommand, PutItemCommand, QueryCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import {v4 as uuidv4} from 'uuid';
import { removeSpaceToUpper } from "../util/utility";
import { nanoid } from 'nanoid';
//import * as bcrypt from 'bcrypt';
import * as bcrypt from 'bcryptjs';


exports.handler = async function(event) {
    console.log("request:", JSON.stringify(event, undefined, 2));
    let body ={};
  
    try {
        
        switch (event.httpMethod) {
            case "GET":
               if (event.pathParameters != null ) {
                   body = await getUserById(event);  // GET /user/{id}
               } else {
                   body = await getUserByOrganization(event); // GET /user?orgId
               }
               break;
               case "POST":
                 if (event.queryStringParameters.mode =='register'){
                    body = await registerUser(event);  // POST /user?mode
                 } else {
                  body = await loginUser(event);  // POST /user?mode
                 }
                  
                   break;
               case "DELETE":
                   body = await deleteUser(event); // DELETE /user/{id}?orgId
                   break; 
               case "PUT":
                if (event.queryStringParameters.mode == 'user') {
                  body = await updateUser(event);  // PUT /user/{id}?orgId
                } else {
                  body = await updatePassword(event);
                }
                   
                   break;    
               default:
                   throw new Error(`Unsupported route: "${event.httpMethod}"`);        
           }
           console.log(body);
           return {
             statusCode: 200,
             body: JSON.stringify({
               message: `Successfully finished operation: "${event.httpMethod}"`,
               body: body
             })
           };
        
    } catch (e) {
        console.error(e);
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: "Failed to perform operation.",
            errorMsg: e.message,
            errorStack: e.stack,
          })
        };
    }
  };

  const getUserByOrganization = async (event) => {
    console.log(`getUserByOrganization function. event: "${JSON.stringify(event)}"`);

     try {

        const orgId = event.queryStringParameters.orgId;
        
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            KeyConditionExpression: 'PK = :pk and begins_with(SK, :documentType)' ,
            ExpressionAttributeValues: {
               ":pk": { S: orgId },
                ":documentType": { S: "USER" }               
           }
        }

        const {Items } = await ddbClient.send(new QueryCommand(params));
        console.log(`Data from query ${JSON.stringify(Items)}`);
        const result = (Items) ? Items.map((item) => unmarshall(item)) : {};

        const response = {
          statusCode: 200,
          headers: {
              "Access-Control-Allow-Headers" : "Content-Type",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
          },
          body: result
      };
  
      return response;
     } catch (error) {
        console.log(error);
        throw error;
     }
  }

  const getUserById = async (event) => {

    console.log(`getUserById function. event: "${JSON.stringify(event)}"`);
    try {
       const orgId = event.queryStringParameters.orgId;
       const userId = event.pathParameters.id;
       const params = {
           TableName: process.env.DYNAMODB_TABLE_NAME,
           Key: marshall({ PK: orgId, SK: userId })
       }

       const {Item } = await ddbClient.send(new GetItemCommand(params));
       console.log(Item);
       const result = (Item) ? unmarshall(Item) : {};

       const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: result
    };

    return response;
    } catch (error) {
       console.log(error);
       throw error;
    }
  }

  const getUserByEmail = async (orgId, email) => {
 
    console.log(`getUserByEmail orgId: ${orgId} email: ${email}`);

     try {

        const params = {
            KeyConditionExpression: "PK = :orgId",
            FilterExpression: "contains (email, :email)",
            ExpressionAttributeValues: {
              ":orgId": { S: orgId },
              ":email": { S: email }
            },      
            TableName: process.env.DYNAMODB_TABLE_NAME
          };
      
          const { Items } = await ddbClient.send(new QueryCommand(params));
      
          console.log(Items);
          const result = Items.map((item) => unmarshall(item));
          const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: result
        };

        return response;
        
     } catch (error) {
        console.log(error);
        throw error;  
     }
}


  const registerUser = async (event) => {
    console.log(`createUser function. event: ${JSON.stringify(event)}`);

    try {

        let applicantRequest = JSON.parse(event.body);
        console.log(`application request: ${JSON.stringify(applicantRequest)}`);
        const {passwordConfirm, ...data} = applicantRequest;

        if (data.password !== passwordConfirm) {
          throw new Error(`Password Mismatch - password: ${data.password}  password Confirm: ${passwordConfirm}`);
        }

        const salt = await bcrypt.genSalt(10);
        const {password} = data;
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log(`hashed: ${hashedPassword}`);
        data.password = hashedPassword;
        let orgId = event.queryStringParameters.orgId;

        const partitionKey = orgId; 
        const sortKey =  `USER:${nanoid(10).toString()}`;
        const gsi1PK = `${orgId}:${sortKey}`;
       
        applicantRequest = {... data};
        applicantRequest.PK = removeSpaceToUpper(partitionKey);
        applicantRequest.SK = removeSpaceToUpper(sortKey); 
        applicantRequest.GSI1PK = removeSpaceToUpper(gsi1PK);
        applicantRequest.GSI1SK = removeSpaceToUpper(sortKey);
       

        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: marshall(applicantRequest || {})
        }
        
        const createResult = await ddbClient.send(new PutItemCommand(params));
        console.log(createResult);
        const response = {  
          statusCode: 200,
          headers: {
              "Content-Type": "application/text",
              "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "*"
          },
          body: createResult,   
      };
      return response;
        //return createResult;
        
    } catch (error) {
        console.log(error);
        throw error; 
    }
  }

  const loginUser = async (event) => {
    console.log(`createUser function. event: ${JSON.stringify(event)}`);

    try {
        const applicantRequest = JSON.parse(event?.body);
        const orgId = event.queryStringParameters?.orgId;
        const {password, email} = applicantRequest;
        console.log(`email: ${email} password: ${password}`);
        const user = await getUserByEmail(orgId, email);
        console.log(`login user: ${JSON.stringify(user)}`);

        if(!user){
          throw new Error(`User Not Found `);
        }

        console.log(`user password ${user[0]?.password}`);

        if (!await bcrypt.compare(password, user[0]?.password)) {
          throw new Error(`Username or Pasword is incorrect`);
          }
      
          const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: user
        };
    
        return response;
    } catch (error) {
      console.log(error);
        throw error; 
    }
  }

  const deleteUser = async (event) => {
    console.log(`deleteUser function. event: "${JSON.stringify(event)}"`);

    try {

        const orgId = event.queryStringParameters.orgId;
        const userId = event.pathParameters.id;
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ PK: orgId, SK: userId })
        };

        const deleteResult = await ddbClient.send(new DeleteItemCommand(params));
        console.log(deleteResult);
          
        const response = {
          statusCode: 200,
          headers: {
              "Access-Control-Allow-Headers" : "Content-Type",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
          },
          body: deleteResult
      };
  
      return response;
    } catch (error) {
        console.log(error);
        throw error;      
    }
  }

  const updateUser = async (event) => {
    console.log(`updateUser function. event: "${JSON.stringify(event)}"`);
   
    try {

        const requestBody = JSON.parse(event.body);
        const orgId = event.queryStringParameters.orgId;
        const userId = event.pathParameters.id;
        const objKeys = Object.keys(requestBody);
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ PK: orgId, SK: userId }),
            UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
            ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`#key${index}`]: key,
            }), {}),
            ExpressionAttributeValues: marshall(objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`:value${index}`]: requestBody[key],
            }), {})),
          };
      
          const updateResult = await ddbClient.send(new UpdateItemCommand(params));
      
          console.log(updateResult);

          const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: updateResult
        };
    
        return response;
    } catch (error) {
        console.log(error);
        throw error;      
    }
  }

  const updatePassword = async (event) => {
    console.log(`updatePassword function. event: "${JSON.stringify(event)}"`);
   
    try {

        let requestBody = JSON.parse(event.body);
        const { passwordConfirm, ...data} = requestBody;
        const orgId = event.queryStringParameters.orgId;
        const userId = event.pathParameters.id;

        if (data.password !== passwordConfirm) {
          throw new Error(`Password Mismatch - password: ${data.password}  password Confirm: ${password_confirm}`);
        }

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(data.password, salt);
        console.log(`hashed: ${hashedPassword}`);
        data.password = hashedPassword;
        requestBody = {...data};

        const objKeys = Object.keys(requestBody);
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ PK: orgId, SK: userId }),
            UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
            ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`#key${index}`]: key,
            }), {}),
            ExpressionAttributeValues: marshall(objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`:value${index}`]: requestBody[key],
            }), {})),
          };
      
          const updateResult = await ddbClient.send(new UpdateItemCommand(params));
      
          console.log(updateResult);
         
          const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: updateResult
        };
    
        return response;
    } catch (error) {
        console.log(error);
        throw error;      
    }
  }

  const apiGatewayHttpApiV2ProxyResponse = (body) =>  {
     new APIGatewayHttpApiV2ProxyResponse()
    {
        StatusCode = 200,
        Body = Serialize(body),
        Headers =
        {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"    
        }
    };
  }
          

//   const getProductsByCategory = async (event) => {
//     console.log(`getProductsByCategory function. event: "${event}"`);

//      try {

//         const productId = event.pathParameters.id;
//         const category = event.queryStringParameters.category;

//         const params = {
//             KeyConditionExpression: "id = :productId",
//             FilterExpression: "contains (category, :category)",
//             ExpressionAttributeValues: {
//               ":productId": { S: productId },
//               ":category": { S: category }
//             },      
//             TableName: process.env.DYNAMODB_TABLE_NAME
//           };
      
//           const { Items } = await ddbClient.send(new QueryCommand(params));
      
//           console.log(Items);
//           return Items.map((item) => unmarshall(item));
        
//      } catch (error) {
//         console.log(error);
//         throw error;  
//      }
// }