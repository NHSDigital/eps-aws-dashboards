import * as cw from "aws-cdk-lib/aws-cloudwatch"
import {Duration} from "aws-cdk-lib"

type MetricConfig = {
  metricName: string
  dimensions?: Record<string, string>
}

const stepFunctionMetrics: Array<MetricConfig> = [
  {
    metricName: "ConfigurationRecorderInsufficientPermissionsFailure",
    dimensions: {ResourceType: "AWS::StepFunctions::Activity"}
  },
  {
    metricName: "ConfigurationItemsRecorded",
    dimensions: {ResourceType: "AWS::StepFunctions::StateMachine"}
  },
  {
    metricName: "ConfigurationRecorderInsufficientPermissionsFailure",
    dimensions: {}
  }
]

const createMetric = (config: MetricConfig, region: string) => {
  return new cw.Metric({
    namespace: "AWS/Config",
    metricName: config.metricName,
    dimensionsMap: config.dimensions || {},
    region: region
  })
}

export const createStepFunctionWidget = (
  title: string,
  region: string = "eu-west-2",
  period: number = 300,
  height: number = 6,
  width: number = 12
) => {
  return new cw.GraphWidget({
    title: title,
    region: region,
    left: stepFunctionMetrics.map((metricConfig) => createMetric(metricConfig, region)),
    view: cw.GraphWidgetView.TIME_SERIES,
    stacked: false,
    legendPosition: cw.LegendPosition.BOTTOM,
    period: Duration.seconds(period),
    statistic: "Average",
    height: height,
    width: width
  })
}
