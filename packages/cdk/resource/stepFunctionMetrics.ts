import * as cw from "aws-cdk-lib/aws-cloudwatch"
import {Duration, Stack} from "aws-cdk-lib"

type MetricConfig = {
  metricName: string
  dimensions?: Record<string, string>
}

const generateStepFunctionMetrics = (
  stateMachineName: string,
  stack: Stack
): Array<MetricConfig> => {
  const metricNames = [
    "ExecutionsStarted",
    "ExecutionsSucceeded",
    "ExecutionsFailed",
    "ExecutionsTimedOut",
    "ExecutionsAborted"
  ]

  return metricNames.map((metricName) => ({
    metricName,
    dimensions: {
      StateMachineArn: `arn:aws:states:${stack.region}:${stack.account}:stateMachine:${stateMachineName}`
    }
  }))
}

const createStepFunctionMetric = (config: MetricConfig, stack: Stack) => {
  return new cw.Metric({
    namespace: "AWS/States",
    metricName: config.metricName,
    dimensionsMap: config.dimensions,
    region: stack.region
  })
}

export const createStepFunctionWidget = (
  title: string,
  stack: Stack,
  stateMachineName: string,
  period: number = 300,
  height: number = 6,
  width: number = 8
) => {
  return new cw.GraphWidget({
    title: title,
    region: stack.region,
    left: generateStepFunctionMetrics(stateMachineName, stack).map((metricConfig) =>
      createStepFunctionMetric(metricConfig, stack)
    ),
    view: cw.GraphWidgetView.TIME_SERIES,
    stacked: false,
    legendPosition: cw.LegendPosition.RIGHT,
    period: Duration.seconds(period),
    statistic: "Average",
    height: height,
    width: width
  })
}
