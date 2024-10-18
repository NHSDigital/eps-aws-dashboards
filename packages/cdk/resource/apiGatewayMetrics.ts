import * as cw from "aws-cdk-lib/aws-cloudwatch"
import {Duration, Stack} from "aws-cdk-lib"

const apiGatewayNames = [
  "pfp-apigw",
  "psu-apigw"
]

const createApiGatewayMetric = (metricName: string, apiName: string, stack: Stack) => {
  return new cw.Metric({
    namespace: "AWS/ApiGateway",
    metricName: metricName,
    dimensionsMap: {
      ApiName: apiName
    },
    region: stack.region
  })
}

export const createApiGatewayWidget = (
  metricName: string,
  stack: Stack,
  period: number = 300,
  height: number = 6,
  width: number = 12
) => {
  return new cw.GraphWidget({
    title: `API Gateway ${metricName}`,
    region: stack.region,
    left: apiGatewayNames.map((apiName) => createApiGatewayMetric(metricName, apiName, stack)),
    view: cw.GraphWidgetView.TIME_SERIES,
    stacked: false,
    legendPosition: cw.LegendPosition.RIGHT,
    period: Duration.minutes(period),
    statistic: "Average",
    height: height,
    width: width
  })
}
