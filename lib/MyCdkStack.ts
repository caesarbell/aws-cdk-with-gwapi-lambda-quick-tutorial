import { join } from 'path';
import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';


export class MyCdkStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // Create a Lambda function
        const myLambda = new NodejsFunction(this, 'MyLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            functionName: 'test-function',
            entry: (join(__dirname, '..', 'lambda', 'index.ts')) // Assuming your Lambda code is in a 'lambda' directory
        });

        // Create an API Gateway
        const api = new RestApi(this, 'MyApi', {
            restApiName: 'My API',
        });

        // Create a resource and method for the API
        const resource = api.root.addResource('invoke');
        resource.addMethod('GET', new LambdaIntegration(myLambda));

        // Output the API endpoint URL
        new CfnOutput(this, 'ApiEndpoint', {
            value: api.url,
        });
    }
}

