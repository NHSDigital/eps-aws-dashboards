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

  // Create a widget for API Gateway 4XX Errors
  const apiGatewayErrorsWidget = new cw.GraphWidget({
    height: 5,
    width: 8,
    title: "API Gateway 4XXError",
    region: "eu-west-2",
    left: [
      new cw.Metric({
        namespace: "AWS/ApiGateway",
        metricName: "4XXError",
        dimensionsMap: {
          ApiName: "pfp-apigw"
        },
        region: "eu-west-2"
      }),
      new cw.Metric({
        namespace: "AWS/ApiGateway",
        metricName: "4XXError",
        dimensionsMap: {
          ApiName: "psu-apigw"
        },
        region: "eu-west-2"
      }),
      new cw.Metric({
        namespace: "AWS/ApiGateway",
        metricName: "4XXError",
        dimensionsMap: {
          ApiName: "tracker-auth-apigw-cognito"
        },
        region: "eu-west-2"
      })
    ],
    view: cw.GraphWidgetView.TIME_SERIES,
    stacked: false,
    legendPosition: cw.LegendPosition.RIGHT,
    period: Duration.minutes(5),
    statistic: "Average"
  })

  // Create a widget for API Gateway 5XX Errors
  const apiGateway5XXErrorsWidget = new cw.GraphWidget({
    height: 5,
    width: 8,
    title: "API Gateway 5XXError",
    region: "eu-west-2",
    left: [
      new cw.Metric({
        namespace: "AWS/ApiGateway",
        metricName: "5XXError",
        dimensionsMap: {
          ApiName: "pfp-apigw"
        },
        region: "eu-west-2"
      }),
      new cw.Metric({
        namespace: "AWS/ApiGateway",
        metricName: "5XXError",
        dimensionsMap: {
          ApiName: "psu-apigw"
        },
        region: "eu-west-2"
      }),
      new cw.Metric({
        namespace: "AWS/ApiGateway",
        metricName: "5XXError",
        dimensionsMap: {
          ApiName: "tracker-auth-apigw-cognito"
        },
        region: "eu-west-2"
      })
    ],
    view: cw.GraphWidgetView.TIME_SERIES,
    stacked: false,
    legendPosition: cw.LegendPosition.RIGHT,
    period: Duration.minutes(5),
    statistic: "Average"
  })

  // Add both widgets to the dashboard
  dashboard.addWidgets(apiGatewayErrorsWidget, apiGateway5XXErrorsWidget)

  return dashboard
}
