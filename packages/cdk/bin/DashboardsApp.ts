import {DashboardsStack} from "../stacks/dashboardsStack"
import {createApp, getConfigFromEnvVar} from "@nhsdigital/eps-cdk-constructs"
import {addCfnGuardMetadata} from "./utils/appUtils"

async function main() {
  const {app, props} = createApp({
    productName: "EPS AWS Dashboards",
    appName: "DashboardsApp",
    repoName: "eps-aws-dashboards",
    driftDetectionGroup: "dashboards"
  })
  const dashboardStackName = getConfigFromEnvVar("dashboardStackName")

  const dashboardsStack = new DashboardsStack(app, "DashboardsStack", {
    ...props,
    stackName: dashboardStackName
  })
  // run a synth to add custom resource lambdas and roles
  app.synth()

  addCfnGuardMetadata(dashboardsStack, "Custom::CrossRegionExportReaderCustomResourceProvider")

  // finally run synth again with force to include the added metadata
  app.synth({
    force: true
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
