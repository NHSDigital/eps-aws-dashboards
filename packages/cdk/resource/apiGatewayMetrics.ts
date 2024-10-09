import * as cw from "aws-cdk-lib/aws-cloudwatch"
import {Duration} from "aws-cdk-lib"

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
    left: [
      new cw.Metric({
        namespace: "AWS/ApiGateway",
        metricName: metricName,
        dimensionsMap: {
          ApiName: "pfp-apigw"
        },
        region: region
      }),
      new cw.Metric({
        namespace: "AWS/ApiGateway",
        metricName: metricName,
        dimensionsMap: {
          ApiName: "psu-apigw"
        },
        region: region
      }),
      new cw.Metric({
        namespace: "AWS/ApiGateway",
        metricName: metricName,
        dimensionsMap: {
          ApiName: "tracker-auth-apigw-cognito"
        },
        region: region
      })
    ],
    view: cw.GraphWidgetView.TIME_SERIES,
    stacked: false,
    legendPosition: cw.LegendPosition.RIGHT,
    period: Duration.minutes(period),
    statistic: "Average",
    height: height,
    width: width
  })
}
