import * as cw from "aws-cdk-lib/aws-cloudwatch"
import {Duration, Stack} from "aws-cdk-lib"

const dynamoDbMetrics = [
  "ConsumedWriteCapacityUnits",
  "ConsumedReadCapacityUnits",
  "ConditionalCheckFailedRequests",
  "TimeToLiveDeletedItemCount"
]

const createDynamoDbMetrics = (
  tableName: string,
  metricNames: Array<string>,
  stack: Stack
): Array<cw.Metric> => {
  return metricNames.map((metricName) => {
    return new cw.Metric({
      namespace: "AWS/DynamoDB",
      metricName: metricName,
      dimensionsMap: {
        TableName: tableName
      },
      region: stack.region
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
    region: stack.region,
    left: createDynamoDbMetrics(tableName, dynamoDbMetrics, stack),
    view: cw.GraphWidgetView.TIME_SERIES,
    stacked: false,
    legendPosition: cw.LegendPosition.RIGHT,
    period: Duration.seconds(period),
    statistic: "Average",
    height: height,
    width: width
  })
}
