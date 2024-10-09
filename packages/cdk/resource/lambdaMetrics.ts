import * as cw from "aws-cdk-lib/aws-cloudwatch"
import {Duration} from "aws-cdk-lib"

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

const createLambdaMetric = (metricName: string, functionName: string, region: string) => {
  return new cw.Metric({
    namespace: "AWS/Lambda",
    metricName: metricName,
    dimensionsMap: {
      FunctionName: functionName
    },
    region: region
  })
}

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
    left: functionNames.map((functionName) => createLambdaMetric(metricName, functionName, region)),
    view: cw.GraphWidgetView.TIME_SERIES,
    stacked: false,
    legendPosition: cw.LegendPosition.RIGHT,
    period: Duration.minutes(period),
    statistic: "Average"
  })
}
