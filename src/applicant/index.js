import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "./ddbClient";
import { DeleteItemCommand, GetItemCommand, PutItemCommand, QueryCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import {v4 as uuidv4} from 'uuid';
import { removeSpaceToUpper, responseApi } from "../util/utility";
import { nanoid } from 'nanoid';

exports.handler = async function(event) {
    console.log("request:", JSON.stringify(event, undefined, 2));
    let body ={};
  
    try {
        
        switch (event.httpMethod) {
            case "GET":
               if (event.pathParameters != null) {
                   body = await getApplicantById(event);  // GET /applicant/{id}
               } else if (event.queryStringParameters !== null  ) {
                //   if (event.queryStringParameters.level == 'all'){
                     body = await getFullApplicantData(event);
                  //} //else{
                    //body = await getAllApplicantByOrganization(event); // GET /applicant
                 // }
                    
               }
               break;
               case "POST":
                   body = await createApplicant(event);  // POST /applicant
                   break;
               case "DELETE":
                   body = await deleteApplicant(event); // DELETE /applicant/{id}
                   break; 
               case "PUT":
                   body = await updateApplicant(event);  // PUT /applicant/{id}
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

  const getApplicantById = async (event) => {
    console.log(`createApplicant function. event: "${JSON.stringify(event)}"`);

     try {

        const id = event.pathParameters.id;
        const sortKey = event.queryStringParameters.appId;
        
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ PK: id, SK: sortKey })
        }

        const {Item } = await ddbClient.send(new GetItemCommand(params));
        console.log(Item);
        const result = (Item) ? unmarshall(Item) : {};
        return await responseApi(result);
     } catch (error) {
        console.log(error);
        throw error;
     }
  }

  const getAllApplicantByOrganization = async (event) => {
    console.log("getAllApplicant");

    try {
        const partitionKey = event.queryStringParameters.orgId;
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            KeyConditionExpression: "PK = :pk and begins_with(SK, :documentType)",
            //KeyConditionExpression: "documentType = :documentType",
            //FilterExpression: "contains (documentType, :documentType)",
            //FilterExpression: "PK = :pk and begins_with (SK, :documentType)",
            ExpressionAttributeValues: {
               ":documentType": { S: "APP" },
               ":pk": { S: partitionKey }
           }
        }
        
        //const {Items } = await ddbClient.send(new ScanCommand(params));
        const { Items } = await ddbClient.send(new QueryCommand(params));
        console.log(Items);
        const result = (Items) ? Items.map ((item) => unmarshall(item)) : {};
        return await responseApi(result);
    } catch (error) {
        console.log(error);
        throw error; 
    }
  }

  const getFullApplicantData = async (event) => {
    console.log(`getFullApplicantData function. event: "${JSON.stringify(event)}"`);

     try {
        const applicantId = event.queryStringParameters.appId;
        console.log(`queried applicant Id ${applicantId}`);
        
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            IndexName: "gsi1-index",
            KeyConditionExpression: "GSI1PK = :pk" ,
            ExpressionAttributeValues: {
               ":pk": { S: applicantId },
            //    ":documentType": { S: "APP" }               
           }
        }

        const {Items } = await ddbClient.send(new QueryCommand(params));
        console.log(`Data from query ${JSON.stringify(Items)}`);
        const result = (Items) ? Items.map((item) => unmarshall(item)) : {};
        return await responseApi(result);
     } catch (error) {
        console.log(error);
        throw error;
     }
  }

  const createApplicant = async (event) => {
    console.log(`createApplicant function. event: "${JSON.stringify(event)}"`);

    try {

        const applicantRequest = JSON.parse(event.body);
        const {firstName, lastName} = applicantRequest;
        const partitionKey = event.queryStringParameters.orgId;
        let name = `${firstName} ${lastName}`;
        // let name = event.queryStringParameters.appName;
        //name = removeSpaceToUpper(name);
        

        // set organizationid
        //const sortKey =`APP:${name}:${uuidv4()}`;
        const sortKey =`APPL:${name}:${nanoid(4).toString()}`;
        const gsi1PK = `${partitionKey}:${sortKey}`;
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
       // return createResult;
        return await responseApi(createResult);
        
    } catch (error) {
        console.log(error);
        throw error; 
    }
  }

  const deleteApplicant = async (event) => {
    console.log(`deleteApplicant function. event: "${JSON.stringify(event)}"`);

    try {

        const partitionKey = event.pathParameters.id;
        const sortKey = event.queryStringParameters.appId;
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ PK: partitionKey, SK: sortKey })
        };

        const deleteResult = await ddbClient.send(new DeleteItemCommand(params));
        console.log(deleteResult);
        //return deleteResult;
        return await responseApi(deleteResult);
        
    } catch (error) {
        console.log(error);
        throw error;      
    }
  }

  const updateApplicant = async (event) => {
    console.log(`updateApplicant function. event: "${JSON.stringify(event)}"`);

    try {

        const requestBody = JSON.parse(event.body);
        const objKeys = Object.keys(requestBody);
        const partitionKey = event.pathParameters.id;
        const sortKey = event.queryStringParameters.appId;

        console.log(`updateApplicant function. requestBody: "${requestBody}", objkeys: "${objKeys}"`);

        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ PK: partitionKey, SK: sortKey }),
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
          //return updateResult;
          return await responseApi(updateResult);
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