import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface OnalMicroservicesProps {
  dataTable: ITable;
  //basketTable: ITable;
  //orderTable: ITable;
}

export class OnalMicroservices extends Construct {
  public readonly organizationMicroservice: NodejsFunction;
  public readonly applicantMicroservice: NodejsFunction;
  public readonly noteMicroservice: NodejsFunction;
  public readonly employmentMicroservice: NodejsFunction;
  public readonly mortgageMicroservice: NodejsFunction;
  public readonly userMicroservice: NodejsFunction;

  constructor(scope: Construct, id: string, props: OnalMicroservicesProps) {
    super(scope, id);

    // organization microservices
    this.organizationMicroservice = this.createOrganizationFunction(
      props.dataTable
    );
    // applicant microservices
    this.applicantMicroservice = this.createApplicantFunction(props.dataTable);
    // note Microservice
    this.noteMicroservice = this.createNoteFunction(props.dataTable);
    // employment Microservice
    this.employmentMicroservice = this.createEmploymentFunction(
      props.dataTable
    );
    // mortgage Microservice
    this.mortgageMicroservice = this.createMortgageFunction(props.dataTable);
    // user Microservice
    this.userMicroservice = this.createUserFunction(props.dataTable);
  }

  private createOrganizationFunction(dataTable: ITable): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      environment: {
        PRIMARY_KEY: "PK",
        SORT_KEY: "SK",
        DYNAMODB_TABLE_NAME: dataTable.tableName,
      },
      runtime: Runtime.NODEJS_18_X,
    };

    const organizationFunction = new NodejsFunction(
      this,
      "organizationLambdaFunction",
      {
        entry: join(__dirname, `/../src/organization/index.js`),
        ...nodeJsFunctionProps,
      }
    );

    dataTable.grantReadWriteData(organizationFunction);
    return organizationFunction;
  }

  private createApplicantFunction(dataTable: ITable): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      environment: {
        PRIMARY_KEY: "PK",
        SORT_KEY: "SK",
        DYNAMODB_TABLE_NAME: dataTable.tableName,
      },
      runtime: Runtime.NODEJS_18_X,
    };

    const applicantFunction = new NodejsFunction(
      this,
      "applicantLambdaFunction",
      {
        entry: join(__dirname, `/../src/applicant/index.js`),
        ...nodeJsFunctionProps,
      }
    );

    dataTable.grantReadWriteData(applicantFunction);
    return applicantFunction;
  }

  private createNoteFunction(dataTable: ITable): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      environment: {
        PRIMARY_KEY: "PK",
        SORT_KEY: "SK",
        DYNAMODB_TABLE_NAME: dataTable.tableName,
      },
      runtime: Runtime.NODEJS_18_X,
    };

    const noteFunction = new NodejsFunction(this, "noteLambdaFunction", {
      entry: join(__dirname, `/../src/note/index.js`),
      ...nodeJsFunctionProps,
    });

    dataTable.grantReadWriteData(noteFunction);
    return noteFunction;
  }

  private createEmploymentFunction(dataTable: ITable): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      environment: {
        PRIMARY_KEY: "PK",
        SORT_KEY: "SK",
        DYNAMODB_TABLE_NAME: dataTable.tableName,
      },
      runtime: Runtime.NODEJS_18_X,
    };

    const employmentFunction = new NodejsFunction(
      this,
      "employmentLambdaFunction",
      {
        entry: join(__dirname, `/../src/employment/index.js`),
        ...nodeJsFunctionProps,
      }
    );

    dataTable.grantReadWriteData(employmentFunction);
    return employmentFunction;
  }

  private createMortgageFunction(dataTable: ITable): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      environment: {
        PRIMARY_KEY: "PK",
        SORT_KEY: "SK",
        DYNAMODB_TABLE_NAME: dataTable.tableName,
      },
      runtime: Runtime.NODEJS_18_X,
    };

    const mortgageFunction = new NodejsFunction(
      this,
      "mortgageLambdaFunction",
      {
        entry: join(__dirname, `/../src/mortgage/index.js`),
        ...nodeJsFunctionProps,
      }
    );

    dataTable.grantReadWriteData(mortgageFunction);
    return mortgageFunction;
  }

  private createUserFunction(dataTable: ITable): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      environment: {
        PRIMARY_KEY: "PK",
        SORT_KEY: "SK",
        DYNAMODB_TABLE_NAME: dataTable.tableName,
      },
      runtime: Runtime.NODEJS_18_X,
    };

    const userFunction = new NodejsFunction(this, "userLambdaFunction", {
      entry: join(__dirname, `/../src/user/index.js`),
      ...nodeJsFunctionProps,
    });

    dataTable.grantReadWriteData(userFunction);
    return userFunction;
  }
}
