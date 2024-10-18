import * as cw from "aws-cdk-lib/aws-cloudwatch"
import {Duration, Stack} from "aws-cdk-lib"
import {Construct} from "constructs"
import {createApiGatewayWidget} from "./apiGatewayMetrics"
import {createLambdaWidget} from "./lambdaMetrics"
import {createStepFunctionWidget} from "./stepFunctionMetrics"
import {createStepFunctionExecutionTimeWidget} from "./stepFunctionExecutionTimeMetrics"
import {createPsuDynamoDbTableWidget} from "./dynamoDbMetrics"
import {createPsuDynamoDbTableOperationWidget} from "./dynamoDbOperationMetrics"

export class Dashboards extends Construct {
  public readonly dashboardArn: string // Expose the dashboard ARN as a public property

  public constructor(scope: Construct, id: string) {
    super(scope, id)

    // Get the current stack
    const stack = Stack.of(this)

    // Create the dashboard
    const dashboard = new cw.Dashboard(scope, "Dashboards", {
      defaultInterval: Duration.days(7),
      variables: [
        new cw.DashboardVariable({
          id: "region2",
          type: cw.VariableType.PATTERN,
          label: "RegionPattern",
          inputType: cw.VariableInputType.INPUT,
          value: stack.region,
          defaultValue: cw.DefaultValue.value(stack.region),
          visible: true
        })
      ]
    })

    // Adding widgets in a structured way
    dashboard.addWidgets(
      // First Row
      createApiGatewayWidget("4XXError", stack),
      createApiGatewayWidget("5XXError", stack),

      // Second Row
      createApiGatewayWidget("Latency", stack),
      createApiGatewayWidget("IntegrationLatency", stack),

      // Third Row
      createApiGatewayWidget("Count", stack),
      createStepFunctionExecutionTimeWidget("Step Function Execution Time", stack, "ExecutionTime"),

      // Fourth Row
      createStepFunctionWidget("PfP Step Function", stack, "pfp-GetMyPrescriptions"),
      createStepFunctionWidget("PSU Step Function", stack, "psu-UpdatePrescriptionStatus"),
      createStepFunctionWidget("CPSU Step Function", stack, "psu-Format1UpdatePrescriptionsStatus"),

      // Fifth Row
      createPsuDynamoDbTableWidget("PSU Dynamo DB Table", stack, "psu-PrescriptionStatusUpdates"),
      createPsuDynamoDbTableOperationWidget("PSU Dynamo DB Table Operation", stack, "psu-PrescriptionStatusUpdates"),

      // Widgets are stacked vertically in a single column
      createLambdaWidget("Errors", stack),
      createLambdaWidget("Duration", stack),
      createLambdaWidget("Invocations", stack),
      createLambdaWidget("PostRuntimeExtensionsDuration", stack),
      createLambdaWidget("Throttles", stack)
    )

    this.dashboardArn = dashboard.dashboardArn // Store the ARN of the dashboard
  }
}
