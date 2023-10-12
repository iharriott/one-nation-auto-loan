import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "./ddbClient";
import { DeleteItemCommand, GetItemCommand, PutItemCommand, QueryCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import {v4 as uuidv4} from 'uuid';
import { removeSpaceToUpper } from "../util/utility";
import { nanoid } from 'nanoid';

exports.handler = async function(event) {
    console.log("request:", JSON.stringify(event, undefined, 2));
    let body ={};
  
    try {

        switch (event.httpMethod) {
            case "GET":
               if (event.pathParameters != null) {
                   body = await getOrganization(event.pathParameters.id);  // GET /organization/{id}
               } else if (event.queryStringParameters != null ) {
                body = await getAllOrganizationData(event.queryStringParameters.orgId);  // GET /organization/{id}
               }
               else if (event.pathParameters == null && event.queryStringParameters == null) {
                   body = await getAllOrganization(); // GET /organization
               }
               break;
               case "POST":
                   body = await createOrganization(event);  // POST /organization
                   break;
               case "DELETE":
                   body = await deleteOrganization(event.pathParameters.id); // DELETE /organization/{id}
                   break; 
               case "PUT":
                   body = await updateOrganization(event);  // PUT /organization/{id}
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

  const getOrganization = async (orgId) => {
     console.log(`getOrganization ${orgId}`);

     try {
        
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ PK: orgId, SK: orgId })
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

  const getAllOrganization = async () => {
    console.log("getAllOrganization");

    try {

        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            ExpressionAttributeValues: {
                ":pk": { S: "ORG" },
                ":sk": { S: "ORG" }
            },
            //KeyConditionExpression: "PK = :pk and begins_with (SK, :sk)",
            //FilterExpression: "contains (documentType, :documentType)",
            FilterExpression: "begins_with (PK, :pk) and begins_with (SK, :sk)",
            
        }
    
        const {Items } = await ddbClient.send(new ScanCommand(params));
        //const { Items } = await ddbClient.send(new QueryCommand(params));
        console.log(Items);
        const result = (Items) ? Items.map ((item) => unmarshall(item)) : {};

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

  const getAllOrganizationData = async (orgId) => {
    console.log("getAllOrganization");

    try {
        const partitionKey = orgId;
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            KeyConditionExpression: 'PK =:pk',
            //FilterExpression: "contains (documentType, :documentType)",
            //FilterExpression: "PK =:pk",
            ExpressionAttributeValues: {
               ":pk": { S: partitionKey }            
           }
        }
    
        //const {Items } = await ddbClient.send(new ScanCommand(params));
        const { Items } = await ddbClient.send(new QueryCommand(params));
        console.log(Items);
        const result = (Items) ? Items.map ((item) => unmarshall(item)) : {};

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

  const createOrganization = async (event) => {
    console.log(`createOrganization function. event: "${JSON.stringify(event)}"`);

    try {

        const organizationRequest = JSON.parse(event.body);
        const {name } = organizationRequest;
        //let name = event.queryStringParameters.orgName;
       // name = removeSpaceToUpper(name);
        // set organizationid
        let organizationId =`ORGN:${name}:${nanoid(7).toString()}`;
        organizationId = removeSpaceToUpper(organizationId);
        organizationRequest.PK = organizationId;
        organizationRequest.SK = organizationId;

        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: marshall(organizationRequest || {})
        }
        
        const createResult = await ddbClient.send(new PutItemCommand(params));
        console.log(createResult);
       
        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: createResult
        };

        return response;
        
    } catch (error) {
        console.log(error);
        throw error; 
    }
  }

  const deleteOrganization = async (organizationId) => {
    console.log(`deleteOrganization function. organizationId "${organizationId}"`);

    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ PK: organizationId, SK: organizationId })
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

  const updateOrganization = async (event) => {
    console.log(`updateOrganization function. event: "${JSON.stringify(event)}"`);

    try {

        const requestBody = JSON.parse(event.body);
        const objKeys = Object.keys(requestBody);

        console.log(`updateOrganization function. requestBody: "${requestBody}", objkeys: "${objKeys}"`);

        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ PK: event.pathParameters.id, SK: event.pathParameters.id }),
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