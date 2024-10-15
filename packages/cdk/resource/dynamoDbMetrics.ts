import * as cw from "aws-cdk-lib/aws-cloudwatch"
import {Duration, Stack} from "aws-cdk-lib"

const dynamoDbMetrics = [
  "ConsumedWriteCapacityUnits",
  "ConsumedReadCapacityUnits",
  "ConditionalCheckFailedRequests",
  "TimeToLiveDeletedItemCount"
]

const createDynamoDbMetrics = (
  stack: Stack,
  tableName: string,
  metricNames: Array<string>
): Array<cw.Metric> => {
  return metricNames.map((metricName) => {
    return new cw.Metric({
      namespace: "AWS/DynamoDB",
      metricName: metricName,
      dimensionsMap: {
        TableName: tableName
      },
      region: "eu-west-2"
    })
  })
}

export const createPsuDynamoDbTableWidget = (
  widgetName: string,
  stack: Stack,
  tableName: string,
  period: number = 300,
  height: number = 6,
  width: number = 12
) => {
  return new cw.GraphWidget({
    title: widgetName,
    region: "eu-west-2",
    left: createDynamoDbMetrics(stack, tableName, dynamoDbMetrics),
    view: cw.GraphWidgetView.TIME_SERIES,
    stacked: false,
    legendPosition: cw.LegendPosition.RIGHT,
    period: Duration.seconds(period),
    statistic: "Average",
    height: height,
    width: width
  })
}
