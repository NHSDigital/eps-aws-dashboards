import * as cw from "aws-cdk-lib/aws-cloudwatch"
import {Duration} from "aws-cdk-lib"

const apiGatewayNames = [
  "pfp-apigw",
  "psu-apigw"
]

const createApiGatewayMetric = (metricName: string, apiName: string, region: string) => {
  return new cw.Metric({
    namespace: "AWS/ApiGateway",
    metricName: metricName,
    dimensionsMap: {
      ApiName: apiName
    },
    region: region
  })
}

export const createApiGatewayWidget = (
  metricName: string,
  region: string = "eu-west-2",
  period: number = 300,
  height: number = 6,
  width: number = 12
) => {
  return new cw.GraphWidget({
    title: `API Gateway ${metricName}`,
    region: region,
    left: apiGatewayNames.map((apiName) => createApiGatewayMetric(metricName, apiName, region)),
    view: cw.GraphWidgetView.TIME_SERIES,
    stacked: false,
    legendPosition: cw.LegendPosition.RIGHT,
    period: Duration.minutes(period),
    statistic: "Average",
    height: height,
    width: width
  })
}
