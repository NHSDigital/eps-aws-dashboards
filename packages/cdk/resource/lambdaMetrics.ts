import * as cw from "aws-cdk-lib/aws-cloudwatch"
import {Duration, Stack} from "aws-cdk-lib"

const functionNames = [
  "pfp-GetMyPrescriptions",
  "pfp-EnrichPrescriptions",
  "pfp-CapabilityStatement",
  "pfp-status",
  "pfp-sandbox-Sandbox",
  "pfp-sandbox-CapabilityStatement",
  "pfp-sandbox-status",
  "psu-GetStatusUpdates",
  "psu-UpdatePrescriptionStatus",
  "psu-CheckPrescriptionStatusUpdates",
  "psu-ConvertRequestToFhirFormat",
  "psu-CapabilityStatement",
  "psu-status",
  "psu-sandbox-UpdatePrescriptionStatusSandbox",
  "fhir-validator-FHIRValidatorUKCore"
]

const createLambdaMetrics = (metricName: string, functionName: string, stack: Stack) => {
  return new cw.Metric({
    namespace: "AWS/Lambda",
    metricName: metricName,
    dimensionsMap: {
      FunctionName: functionName
    },
    region: stack.region
  })
}

export const createLambdaWidget = (
  metricName: string,
  stack: Stack,
  period: number = 300,
  height: number = 9,
  width: number = 24
) => {
  return new cw.GraphWidget({
    title: `Lambda ${metricName}`,
    region: stack.region,
    left: functionNames.map((functionName) => createLambdaMetrics(metricName, functionName, stack)),
    view: cw.GraphWidgetView.TIME_SERIES,
    stacked: false,
    legendPosition: cw.LegendPosition.RIGHT,
    period: Duration.minutes(period),
    statistic: "Average",
    height: height,
    width: width
  })
}
