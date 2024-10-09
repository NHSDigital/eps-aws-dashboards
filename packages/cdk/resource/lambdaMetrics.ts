import * as cw from "aws-cdk-lib/aws-cloudwatch"
import {Duration} from "aws-cdk-lib"

export const createLambdaMetricWidget = (
  metricName: string,
  region: string = "eu-west-2",
  period: number = 300,
  height: number = 9,
  width: number = 24
) => {
  return new cw.GraphWidget({
    height: height,
    width: width,
    title: `Lambda ${metricName}`,
    region: region,
    left: [
      new cw.Metric({
        namespace: "AWS/Lambda",
        metricName: metricName,
        dimensionsMap: {
          FunctionName: "pfp-GetMyPrescriptions"
        },
        region: region
      }),
      new cw.Metric({
        namespace: "AWS/Lambda",
        metricName: metricName,
        dimensionsMap: {
          FunctionName: "pfp-EnrichPrescriptions"
        },
        region: region
      }),
      new cw.Metric({
        namespace: "AWS/Lambda",
        metricName: metricName,
        dimensionsMap: {
          FunctionName: "pfp-CapabilityStatement"
        },
        region: region
      }),
      new cw.Metric({
        namespace: "AWS/Lambda",
        metricName: metricName,
        dimensionsMap: {
          FunctionName: "pfp-status"
        },
        region: region
      }),
      new cw.Metric({
        namespace: "AWS/Lambda",
        metricName: metricName,
        dimensionsMap: {
          FunctionName: "pfp-sandbox-Sandbox"
        },
        region: region
      }),
      new cw.Metric({
        namespace: "AWS/Lambda",
        metricName: metricName,
        dimensionsMap: {
          FunctionName: "pfp-sandbox-CapabilityStatement"
        },
        region: region
      }),
      new cw.Metric({
        namespace: "AWS/Lambda",
        metricName: metricName,
        dimensionsMap: {
          FunctionName: "pfp-sandbox-status"
        },
        region: region
      }),
      new cw.Metric({
        namespace: "AWS/Lambda",
        metricName: metricName,
        dimensionsMap: {
          FunctionName: "psu-GetStatusUpdates"
        },
        region: region
      }),
      new cw.Metric({
        namespace: "AWS/Lambda",
        metricName: metricName,
        dimensionsMap: {
          FunctionName: "psu-UpdatePrescriptionStatus"
        },
        region: region
      }),
      new cw.Metric({
        namespace: "AWS/Lambda",
        metricName: metricName,
        dimensionsMap: {
          FunctionName: "psu-CheckPrescriptionStatusUpdates"
        },
        region: region
      }),
      new cw.Metric({
        namespace: "AWS/Lambda",
        metricName: metricName,
        dimensionsMap: {
          FunctionName: "psu-ConvertRequestToFhirFormat"
        },
        region: region
      }),
      new cw.Metric({
        namespace: "AWS/Lambda",
        metricName: metricName,
        dimensionsMap: {
          FunctionName: "psu-CapabilityStatement"
        },
        region: region
      }),
      new cw.Metric({
        namespace: "AWS/Lambda",
        metricName: metricName,
        dimensionsMap: {
          FunctionName: "psu-status"
        },
        region: region
      }),
      new cw.Metric({
        namespace: "AWS/Lambda",
        metricName: metricName,
        dimensionsMap: {
          FunctionName: "psu-sandbox-UpdatePrescriptionStatusSandbox"
        },
        region: region
      }),
      new cw.Metric({
        namespace: "AWS/Lambda",
        metricName: metricName,
        dimensionsMap: {
          FunctionName: "fhir-validator-FHIRValidatorUKCore"
        },
        region: region
      })
    ],
    view: cw.GraphWidgetView.TIME_SERIES,
    stacked: false,
    legendPosition: cw.LegendPosition.RIGHT,
    period: Duration.minutes(period),
    statistic: "Average"
  })
}
