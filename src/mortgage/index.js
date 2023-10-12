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
                   body = await getMortgageById(event);  // GET /mortgage/{id}
               } else {
                   body = await getMortgageByApplicant(event); // GET /mortgage?appId
               }
               break;
               case "POST":
                   body = await createMortgage(event);  // POST /mortgage
                   break;
               case "DELETE":
                   body = await deleteMortgage(event); // DELETE /mortgage/{id}
                   break; 
               case "PUT":
                   body = await updateMortgage(event);  // PUT /mortgage/{id}
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

  const getMortgageByApplicant = async (event) => {
    console.log(`getMortgageByApplicant function. event: "${JSON.stringify(event)}"`);

     try {
        const applicantId = event.queryStringParameters.appId;
        console.log(`queried applicant Id ${applicantId}`);
        
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            IndexName: "gsi1-index",
            KeyConditionExpression: 'GSI1PK = :pk and begins_with(GSI1SK, :documentType)' ,
            ExpressionAttributeValues: {
               ":pk": { S: applicantId },
                ":documentType": { S: "MORG" }               
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

  const getMortgageById = async (event) => {
    console.log(`getMortgageById function. event: "${JSON.stringify(event)}"`);

    try {
       const applicantId = event.queryStringParameters.appId;
       const mortgageId = event.pathParameters.id;
       const params = {
           TableName: process.env.DYNAMODB_TABLE_NAME,
           Key: marshall({ PK: applicantId, SK: mortgageId })
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

  /*
  const getAllNote = async (event) => {
    console.log("getAllApplicant");

    try {
        const partitionKey = event.queryStringParameters.orgId;
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            //KeyConditionExpression: "PK = :pk and begins_with(SK, :documentType)",
            //KeyConditionExpression: "documentType = :documentType",
            //FilterExpression: "contains (documentType, :documentType)",
            FilterExpression: "PK = :pk and begins_with (SK, :documentType)",
            ExpressionAttributeValues: {
               ":documentType": { S: "APP" },
               ":pk": { S: partitionKey }
           }
        }
        
        const {Items } = await ddbClient.send(new ScanCommand(params));
        //const { Items } = await ddbClient.send(new QueryCommand(params));
        console.log(Items);
        return (Items) ? Items.map ((item) => unmarshall(item)) : {};
    } catch (error) {
        console.log(error);
        throw error; 
    }
  }
*/

  const createMortgage = async (event) => {
    console.log(`createMortgage function. event: "${JSON.stringify(event)}"`);

    try {

        const applicantRequest = JSON.parse(event.body);
        let orgId = event.queryStringParameters.orgId;
        let applicantId = event.queryStringParameters.appId;
        //applicantId = removeSpaceToUpper(applicantId);
        //orgId = removeSpaceToUpper(orgId);
        

        // set organizationid
        //const sortKey =`APP:${name}:${uuidv4()}`;
        const partitionKey = applicantId;  
        const sortKey =  `MORG:${nanoid(7).toString()}`;
        const gsi1PK = `${orgId}:${applicantId}`;
        //const gsi1SK = sortKey;
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

  const deleteMortgage = async (event) => {
    console.log(`deleteMortgage function. event: "${JSON.stringify(event)}"`);

    try {

        const applicantId = event.queryStringParameters.appId;
        const mortgageId = event.pathParameters.id;
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ PK: applicantId, SK: mortgageId })
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

  const updateMortgage = async (event) => {
    console.log(`updateMortgage function. event: "${JSON.stringify(event)}"`);

    try {

        const requestBody = JSON.parse(event.body);
        const objKeys = Object.keys(requestBody);
        const applicantId = event.queryStringParameters.appId;
        const mortgageId = event.pathParameters.id;

        console.log(`updateEmployment function. requestBody: "${requestBody}", objkeys: "${objKeys}"`);

        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ PK: applicantId, SK: mortgageId }),
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
          // return updateResult;

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