import * as cw from "aws-cdk-lib/aws-cloudwatch"
import {Duration, Stack} from "aws-cdk-lib"

const operationDynamoDbMetrics = [
  {metricName: "ReturnedItemCount", operation: "Query"},
  {metricName: "SuccessfulRequestLatency", operation: "Query"},
  {metricName: "TransactWriteItems"},
  {metricName: "ReturnedItemCount", operation: "Scan"},
  {metricName: "SuccessfulRequestLatency", operation: "Scan"}
]

const createDynamoDbOperationMetrics = (
  tableName: string,
  metricConfigs: Array<{metricName: string; operation?: string}>,
  stack: Stack
): Array<cw.IMetric> => {
  return metricConfigs.map(({metricName, operation}) => {
    const dimensions: Record<string, string> = {TableName: tableName}
    if (operation) {
      dimensions["Operation"] = operation
    }
    return new cw.Metric({
      namespace: "AWS/DynamoDB",
      metricName: metricName,
      dimensionsMap: dimensions,
      region: stack.region
    })
  })
}

export const createPsuDynamoDbTableOperationWidget = (
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
    left: createDynamoDbOperationMetrics(tableName, operationDynamoDbMetrics, stack),
    view: cw.GraphWidgetView.TIME_SERIES,
    stacked: false,
    legendPosition: cw.LegendPosition.RIGHT,
    period: Duration.seconds(period),
    statistic: "Average",
    height: height,
    width: width
  })
}
