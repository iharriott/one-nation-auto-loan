import { Duration } from "aws-cdk-lib";
import {
  Cors,
  LambdaIntegration,
  LambdaRestApi,
} from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface onalApiGatewayProps {
  organizationMicroservice: IFunction;
  applicantMicroservice: IFunction;
  noteMicroservice: IFunction;
  employmentMicroservice: IFunction;
  mortgageMicroservice: IFunction;
  userMicroservice: IFunction;
}

export class OnalApiGateway extends Construct {
  constructor(scope: Construct, id: string, props: onalApiGatewayProps) {
    super(scope, id);

    // Product api gateway
    this.createOrganizationApi(props.organizationMicroservice);
    // Applicant api gateway
    this.createApplicantApi(props.applicantMicroservice);
    // Note api gateway
    this.createNoteApi(props.noteMicroservice);
    // employment api gateway
    this.createEmploymentApi(props.employmentMicroservice);
    // mortgage api gateway
    this.createMortgageApi(props.mortgageMicroservice);
    // user api gateway
    this.createUserApi(props.userMicroservice);
  }

  private createOrganizationApi(organizationMicroservice: IFunction) {
    // Organization microservices api gateway
    // root name = Organization

    // GET /Organization
    // POST /Organization

    // Single Organization with id parameter
    // GET /Organization/{id}
    // PUT /Organization/{id}
    // DELETE /Organization/{id}

    const apigw = new LambdaRestApi(this, "organizationApi", {
      restApiName: "Organization Service",
      handler: organizationMicroservice,
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowHeaders: Cors.DEFAULT_HEADERS,
      },
      proxy: false,
    });

    const organization = apigw.root.addResource("organization");
    organization.addMethod("GET"); // GET /product
    organization.addMethod("POST"); // POST /product

    const singleOrganization = organization.addResource("{id}"); // product/{id}
    singleOrganization.addMethod("GET"); // GET /product/{id}
    singleOrganization.addMethod("PUT"); // PUT /product/{id}
    singleOrganization.addMethod("DELETE"); // DELETE /product/{id}
  }

  private createApplicantApi(applicantMicroservice: IFunction) {
    // Applicant microservices api gateway
    // root name = applicant

    // GET /applicant
    // POST /applicant

    // Single applicant with id parameter
    // GET /applicant/{id}
    // PUT /applicant/{id}
    // DELETE /applicant/{id}

    const apigw = new LambdaRestApi(this, "applicantApi", {
      restApiName: "Applicant Service",
      handler: applicantMicroservice,
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowHeaders: Cors.DEFAULT_HEADERS,
      },
      proxy: false,
    });

    const organization = apigw.root.addResource("applicant");
    organization.addMethod("GET"); // GET /applicant
    organization.addMethod("POST"); // POST /applicant

    const singleOrganization = organization.addResource("{id}"); // applicant/{id}
    singleOrganization.addMethod("GET"); // GET /applicant/{id}
    singleOrganization.addMethod("PUT"); // PUT /applicant/{id}
    singleOrganization.addMethod("DELETE"); // DELETE /applicant/{id}
  }

  private createNoteApi(noteMicroservice: IFunction) {
    // Note microservices api gateway
    // root name = note

    // GET /note
    // POST /note

    // Single Note with id parameter
    // GET /note/{id}
    // PUT /note/{id}
    // DELETE /note/{id}

    const apigw = new LambdaRestApi(this, "noteApi", {
      restApiName: "Note Service",
      handler: noteMicroservice,
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowHeaders: Cors.DEFAULT_HEADERS,
      },
      proxy: false,
    });

    const note = apigw.root.addResource("note");
    note.addMethod("GET"); // GET /note
    note.addMethod("POST"); // POST /note

    const singleNote = note.addResource("{id}"); // note/{id}
    singleNote.addMethod("GET"); // GET /note/{id}
    singleNote.addMethod("PUT"); // PUT /note/{id}
    singleNote.addMethod("DELETE"); // DELETE /note/{id}
  }

  private createEmploymentApi(employmentMicroservice: IFunction) {
    // Note microservices api gateway
    // root name = employment

    // GET /employment
    // POST /employment

    // Single Note with id parameter
    // GET /employment/{id}
    // PUT /employment/{id}
    // DELETE /employment/{id}

    const apigw = new LambdaRestApi(this, "employmentApi", {
      restApiName: "Employment Service",
      handler: employmentMicroservice,
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowHeaders: Cors.DEFAULT_HEADERS,
      },
      proxy: false,
    });

    const employment = apigw.root.addResource("employment");
    employment.addMethod("GET"); // GET /employment
    employment.addMethod("POST"); // POST /employment

    const singleEmployment = employment.addResource("{id}"); // employment/{id}
    singleEmployment.addMethod("GET"); // GET /employment/{id}
    singleEmployment.addMethod("PUT"); // PUT /employment/{id}
    singleEmployment.addMethod("DELETE"); // DELETE /employment/{id}
  }

  private createMortgageApi(mortgageMicroservice: IFunction) {
    // Note microservices api gateway
    // root name = mortgage

    // GET /mortgage
    // POST /mortgage

    // Single Note with id parameter
    // GET /mortgage/{id}
    // PUT /mortgage/{id}
    // DELETE /mortgage/{id}

    const apigw = new LambdaRestApi(this, "mortgageApi", {
      restApiName: "Mortgage Service",
      handler: mortgageMicroservice,
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowHeaders: Cors.DEFAULT_HEADERS,
      },
      proxy: false,
    });

    const mortgage = apigw.root.addResource("mortgage");
    mortgage.addMethod("GET"); // GET /mortgage
    mortgage.addMethod("POST"); // POST /mortgage

    const singleMortgage = mortgage.addResource("{id}"); // mortgage/{id}
    singleMortgage.addMethod("GET"); // GET /mortgage/{id}
    singleMortgage.addMethod("PUT"); // PUT /mortgage/{id}
    singleMortgage.addMethod("DELETE"); // DELETE /mortgage/{id}
  }

  private createUserApi(userMicroservice: IFunction) {
    // Note microservices api gateway
    // root name = user

    // GET /user
    // POST /user

    // Single Note with id parameter
    // GET /user/{id}
    // PUT /user/{id}
    // DELETE /user/{id}

    const apigw = new LambdaRestApi(this, "userApi", {
      restApiName: "User Service",
      handler: userMicroservice,
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowHeaders: Cors.DEFAULT_HEADERS,
      },
      proxy: false,
    });

    const user = apigw.root.addResource("user");
    user.addMethod("GET"); // GET /user
    user.addMethod("POST"); // POST /user

    const singleUser = user.addResource("{id}"); // user/{id}
    singleUser.addMethod("GET"); // GET /user/{id}
    singleUser.addMethod("PUT"); // PUT /user/{id}
    singleUser.addMethod("DELETE"); // DELETE /user/{id}
  }
}
