import * as cw from "aws-cdk-lib/aws-cloudwatch"
import {Duration, Stack} from "aws-cdk-lib"

type MetricConfig = {
  metricName: string
  dimensions?: Record<string, string>
}

const generateStepFunctionMetrics = (
  stack: Stack,
  stateMachineName: string
): Array<MetricConfig> => {
  const metricNames = [
    "ExecutionsStarted",
    "ExecutionsSucceeded",
    "ExecutionsFailed",
    "ExecutionsTimedOut",
    "ExecutionsAborted",
    "ExecutionTime",
    "ExpressExecutionMemory",
    "ExpressExecutionBilledDuration",
    "ExpressExecutionBilledMemory"
  ]

  return metricNames.map((metricName) => ({
    metricName,
    dimensions: {
      StateMachineArn: `arn:aws:states:${stack.region}:${stack.account}:stateMachine:${stateMachineName}`
    }
  }))
}

const createStepFunctionMetric = (config: MetricConfig, region: string) => {
  return new cw.Metric({
    namespace: "AWS/States",
    metricName: config.metricName,
    dimensionsMap: config.dimensions,
    region: region
  })
}

export const createStepFunctionWidget = (
  title: string,
  stack: Stack,
  stateMachineName: string,
  region: string = "eu-west-2",
  period: number = 300,
  height: number = 6,
  width: number = 12
) => {
  return new cw.GraphWidget({
    title: title,
    region: region,
    left: generateStepFunctionMetrics(stack, stateMachineName).map((metricConfig) =>
      createStepFunctionMetric(metricConfig, region)
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
