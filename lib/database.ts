import { RemovalPolicy } from "aws-cdk-lib";
import {
  AttributeType,
  BillingMode,
  ITable,
  Table,
} from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class OnalDatabase extends Construct {
  public readonly allData: ITable;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    //alldata table
    this.allData = this.createAllDataTable();
  }

  private createAllDataTable(): ITable {
    const dataTable = new Table(this, "onalDatabase", {
      partitionKey: {
        name: "PK",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "SK",
        type: AttributeType.STRING,
      },
      tableName: "allData",
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
    dataTable.addGlobalSecondaryIndex({
      partitionKey: {
        name: "GSI1PK",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "GSI1SK",
        type: AttributeType.STRING,
      },
      indexName: "gsi1-index",
    });

    return dataTable;
  }
}
