import { join } from "path";
import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import {
  HttpApi,
  CorsHttpMethod,
  HttpMethod,
} from "@aws-cdk/aws-apigatewayv2-alpha";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class MyCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create a Lambda function
    const myLambda = new NodejsFunction(this, "MyLambda", {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      functionName: "test-function",
      entry: join(__dirname, "..", "lambda", "index.ts"), // Assuming your Lambda code is in a 'lambda' directory
    });

    // Create an API Gateway
    const httpApi = new HttpApi(this, "MyApi", {
      apiName: "My API",
      corsPreflight: {
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.DELETE,
          CorsHttpMethod.PUT,
          CorsHttpMethod.POST,
        ],
        allowOrigins: ["*"],
      },
    });

    const templateLambdaIntegration = new HttpLambdaIntegration('TemplateIntegration',myLambda);

    // Create a resource and method for the API
    httpApi.addRoutes({
        path: '/invoke',
        methods: [ HttpMethod.GET],
        integration: templateLambdaIntegration,

    })

    // Output the API endpoint URL
    new CfnOutput(this, "ApiEndpoint", {
      value: httpApi.apiEndpoint,
    });
  }
}
