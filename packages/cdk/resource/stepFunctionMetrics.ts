import * as cw from "aws-cdk-lib/aws-cloudwatch"
import {Duration} from "aws-cdk-lib"

type MetricConfig = {
  metricName: string
  dimensions?: Record<string, string>
}

const stepFunctionMetrics: Array<MetricConfig> = [
  {
    metricName: "ExecutionsStarted",
    dimensions: {
      StateMachineArn: "arn:aws:states:eu-west-2:591291862413:stateMachine:pfp-GetMyPrescriptions"
    }
  },
  {
    metricName: "ExecutionsSucceeded",
    dimensions: {
      StateMachineArn: "arn:aws:states:eu-west-2:591291862413:stateMachine:pfp-GetMyPrescriptions"
    }
  },
  {
    metricName: "ExecutionsFailed",
    dimensions: {
      StateMachineArn: "arn:aws:states:eu-west-2:591291862413:stateMachine:pfp-GetMyPrescriptions"
    }
  },
  {
    metricName: "ExecutionsTimedOut",
    dimensions: {
      StateMachineArn: "arn:aws:states:eu-west-2:591291862413:stateMachine:pfp-GetMyPrescriptions"
    }
  },
  {
    metricName: "ExecutionsAborted",
    dimensions: {
      StateMachineArn: "arn:aws:states:eu-west-2:591291862413:stateMachine:pfp-GetMyPrescriptions"
    }
  },
  {
    metricName: "ExecutionTime",
    dimensions: {
      StateMachineArn: "arn:aws:states:eu-west-2:591291862413:stateMachine:pfp-GetMyPrescriptions"
    }
  },
  {
    metricName: "ExpressExecutionMemory",
    dimensions: {
      StateMachineArn: "arn:aws:states:eu-west-2:591291862413:stateMachine:pfp-GetMyPrescriptions"
    }
  },
  {
    metricName: "ExpressExecutionBilledDuration",
    dimensions: {
      StateMachineArn: "arn:aws:states:eu-west-2:591291862413:stateMachine:pfp-GetMyPrescriptions"
    }
  },
  {
    metricName: "ExpressExecutionBilledMemory",
    dimensions: {
      StateMachineArn: "arn:aws:states:eu-west-2:591291862413:stateMachine:pfp-GetMyPrescriptions"
    }
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
    legendPosition: cw.LegendPosition.RIGHT,
    period: Duration.seconds(period),
    statistic: "Average",
    height: height,
    width: width
  })
}
