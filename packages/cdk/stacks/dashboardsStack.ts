import * as cdk from "aws-cdk-lib"
import {createDashboard} from "../resource/dashboards"

/**
 * EPS AWS Dashboards
 */

export class DashboardsStack extends cdk.Stack {
  public constructor(scope: cdk.App, id: string, props: cdk.StackProps) {
    super(scope, id, props)

    // Create the dashboard and its widgets
    const dashboard = createDashboard(this)

    // Add an output for the dashboard
    new cdk.CfnOutput(this, "DashboardURL", {
      value: dashboard.dashboardArn,
      description: "The ARN of the CloudWatch Dashboard"
    })
  }
}
