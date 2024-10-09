import * as cw from "aws-cdk-lib/aws-cloudwatch"
import {Duration} from "aws-cdk-lib"

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
    left: [
      new cw.Metric({
        namespace: "AWS/Config",
        metricName: "ConfigurationRecorderInsufficientPermissionsFailure",
        dimensionsMap: {
          ResourceType: "AWS::StepFunctions::Activity"
        },
        region: region
      }),
      new cw.Metric({
        namespace: "AWS/Config",
        metricName: "ConfigurationItemsRecorded",
        dimensionsMap: {
          ResourceType: "AWS::StepFunctions::StateMachine"
        },
        region: region
      }),
      new cw.Metric({
        namespace: "AWS/Config",
        metricName: "ConfigurationRecorderInsufficientPermissionsFailure"
      })
    ],
    view: cw.GraphWidgetView.TIME_SERIES,
    stacked: false,
    legendPosition: cw.LegendPosition.BOTTOM,
    period: Duration.seconds(period),
    statistic: "Average",
    height: height,
    width: width
  })
}
