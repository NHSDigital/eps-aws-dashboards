// packages/cdk/stacks/dashboardsStack.ts
import * as cdk from "aws-cdk-lib"
import {Dashboards} from "../resource/dashboards"

/**
 * EPS AWS Dashboards
 */

export class DashboardsStack extends cdk.Stack {
  public readonly dashboardArn: string // Expose the ARN as a public property

  public constructor(scope: cdk.App, id: string, props: cdk.StackProps) {
    super(scope, id, props)

    // Create the dashboards construct with a unique ID
    const dashboards = new Dashboards(this, "EpsAwsDashboards")

    // Outputs
    this.dashboardArn = dashboards.dashboardArn // Store the dashboard ARN
    new cdk.CfnOutput(this, "DashboardURL", {
      value: this.dashboardArn,
      description: "The ARN of the CloudWatch Dashboard"
    })
  }
}
