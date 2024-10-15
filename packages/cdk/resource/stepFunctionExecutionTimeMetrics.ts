import * as cw from "aws-cdk-lib/aws-cloudwatch"
import {Duration, Stack} from "aws-cdk-lib"

type MetricConfig = {
  stateMachineName: string
  label: string
}

const executionTimeMetrics: Array<MetricConfig> = [
  {
    stateMachineName: "pfp-GetMyPrescriptions",
    label: "PfP ExecutionTime"
  },
  {
    stateMachineName: "psu-UpdatePrescriptionStatus",
    label: "PSU ExecutionTime"
  },
  {
    stateMachineName: "psu-Format1UpdatePrescriptionsStatus",
    label: "CPSU ExecutionTime"
  }
]

const createStepFunctionMetrics = (
  metricName: string,
  metricsConfig: Array<MetricConfig>,
  stack: Stack
): Array<cw.Metric> => {
  return metricsConfig.map(({stateMachineName, label}) => {
    const stateMachineArn = `arn:aws:states:${stack.region}:${stack.account}:stateMachine:${stateMachineName}`
    return new cw.Metric({
      namespace: "AWS/States",
      metricName: metricName,
      dimensionsMap: {
        StateMachineArn: stateMachineArn
      },
      region: stack.region,
      label: label
    })
  })
}

export const createStepFunctionExecutionTimeWidget = (
  widgetName: string,
  stack: Stack,
  metricName: string,
  period: number = 300,
  height: number = 6,
  width: number = 12
) => {
  return new cw.GraphWidget({
    title: widgetName,
    region: stack.region,
    left: createStepFunctionMetrics(metricName, executionTimeMetrics, stack),
    view: cw.GraphWidgetView.TIME_SERIES,
    stacked: false,
    legendPosition: cw.LegendPosition.RIGHT,
    period: Duration.seconds(period),
    statistic: "Sum",
    height: height,
    width: width
  })
}
