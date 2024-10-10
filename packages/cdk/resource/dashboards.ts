import * as cw from "aws-cdk-lib/aws-cloudwatch"
import {Duration} from "aws-cdk-lib"
import {Construct} from "constructs"
import {createApiGatewayWidget} from "./apiGatewayMetrics"
import {createLambdaMetricWidget} from "./lambdaMetrics"
import {createStepFunctionWidget} from "./stepFunctionMetrics"

export class Dashboards extends Construct {
  public readonly dashboardArn: string // Expose the dashboard ARN as a public property

  public constructor(scope: Construct, id: string) {
    super(scope, id)

    // Create the dashboard
    const dashboard = new cw.Dashboard(scope, "Dashboards", {
      defaultInterval: Duration.days(7),
      variables: [
        new cw.DashboardVariable({
          id: "region2",
          type: cw.VariableType.PATTERN,
          label: "RegionPattern",
          inputType: cw.VariableInputType.INPUT,
          value: "eu-west-2",
          defaultValue: cw.DefaultValue.value("eu-west-2"),
          visible: true
        })
      ]
    })

    // Adding widgets in a structured way
    dashboard.addWidgets(
      // First Row
      createApiGatewayWidget("4XXError"),
      createApiGatewayWidget("5XXError"),

      // Second Row
      createApiGatewayWidget("Latency"),
      createApiGatewayWidget("IntegrationLatency"),

      // Third Row
      createApiGatewayWidget("Count"),
      createStepFunctionWidget("PfP Step Functions"),

      // Widgets are stacked vertically in a single column
      createLambdaMetricWidget("Errors"),
      createLambdaMetricWidget("Duration"),
      createLambdaMetricWidget("Invocations"),
      createLambdaMetricWidget("PostRuntimeExtensionsDuration"),
      createLambdaMetricWidget("Throttles")
    )

    this.dashboardArn = dashboard.dashboardArn // Store the ARN of the dashboard
  }
}
