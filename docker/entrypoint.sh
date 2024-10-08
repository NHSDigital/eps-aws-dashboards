#!/usr/bin/env bash

# Enable command tracing for debugging
set -x

# Source the ASDF environment for node
source /home/cdkuser/.asdf/asdf.sh

# Debugging output for environment variables
echo "SHOW_DIFF: ${SHOW_DIFF}"
echo "DEPLOY_CODE: ${DEPLOY_CODE}"

# Fetch and export the EPS Zone ID and domain from AWS CloudFormation exports
echo "Fetching epsZoneId and epsDomain from AWS CloudFormation..."
epsZoneId=$(aws cloudformation list-exports --output json | jq -r '.Exports[] | select(.Name == "eps-route53-resources:EPS-ZoneID") | .Value' | grep -o '[^:]*$')
epsDomain=$(aws cloudformation list-exports --output json | jq -r '.Exports[] | select(.Name == "eps-route53-resources:EPS-domain") | .Value' | grep -o '[^:]*$')
echo "epsZoneId: ${epsZoneId}"
echo "epsDomain: ${epsDomain}"

# Export variables for further use in the make commands
export epsZoneId
export epsDomain
export REQUIRE_APPROVAL=never

# Conditional logic to show diff or deploy
if [ "${SHOW_DIFF}" = "true" ]; then
    echo "Running CDK Diff..."
    make cdk-diff
else
    echo "Skipping CDK Diff."
fi

if [ "${DEPLOY_CODE}" = "true" ]; then
    echo "Running CDK Deploy..."
    make cdk-deploy
else
    echo "Skipping CDK Deploy."
fi
