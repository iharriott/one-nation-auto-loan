import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { OnalDatabase } from "./database";
import { OnalMicroservices } from "./microservice";
import { OnalApiGateway } from "./apigateway";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class OneNationAutoLoansStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const database = new OnalDatabase(this, "Database");

    const microservices = new OnalMicroservices(this, "Microservices", {
      dataTable: database.allData,
      //basketTable: database.basketTable,
      //orderTable: database.orderTable,
    });
    const apiGateway = new OnalApiGateway(this, "apiGateway", {
      organizationMicroservice: microservices.organizationMicroservice,
      applicantMicroservice: microservices.applicantMicroservice,
      noteMicroservice: microservices.noteMicroservice,
      employmentMicroservice: microservices.employmentMicroservice,
      mortgageMicroservice: microservices.mortgageMicroservice,
      userMicroservice: microservices.userMicroservice,
    });

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'OneNationAutoLoansQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
