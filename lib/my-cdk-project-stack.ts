import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class MyCdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // Create S3 bucket
    const mybucket = new s3.Bucket(this, 'ps-8946518-bucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,  // Only for dev/test environments
    });

    // Create a Lambda Function
    const myLambda = new lambda.Function(this, 'ps-8946518-lambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async function(event) {
          console.log('Lambda invoked!');
          return { statusCode: 200, body: 'Hello, World!' };
        }
      `),
      environment: {
        BUCKET_NAME: mybucket.bucketName,
      },
    });
    
    // Create a DynamoDB Table
    const myTable = new dynamodb.Table(this, 'ps-8946518-table', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'ps-8946518-table',
      removalPolicy: cdk.RemovalPolicy.DESTROY,  // Only for dev/test environments
    });
    
    // Grant Lambda permissions to access the S3 bucket
    mybucket.grantReadWrite(myLambda);
    
    // Grant Lambda permissions to access DynamoDB
    myTable.grantReadWriteData(myLambda);
  }
}
