import * as cw from "aws-cdk-lib/aws-cloudwatch"
import {Duration} from "aws-cdk-lib"
import {Construct} from "constructs"

/**
 * Function to create the dashboard and its widgets
 */

export const createDashboard = (scope: Construct) => {
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

  dashboard.addWidgets()

  return dashboard
}
