.PHONY: install build test publish release clean lint install-node compile

install: install-node install-python install-hooks

install-python:
	poetry install

install-node:
	npm ci --ignore-scripts

install-hooks: install-python
	poetry run pre-commit install --install-hooks --overwrite

compile-node:
	npx tsc --build tsconfig.build.json

compile: compile-node

lint-node: compile-node
	npm run lint --workspace packages/cdk

lint: lint-node

test: compile
	echo "No tests defined yet"

clean:
	rm -rf cdk.out
	rm -rf cfn_guard_output
	rm -rf packages/cdk/coverage
	rm -rf packages/cdk/lib

deep-clean: clean
	rm -rf .venv
	find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +

cdk-synth:
	CDK_APP_NAME=DashboardsApp \
	CDK_CONFIG_versionNumber=undefined \
	CDK_CONFIG_commitId=undefined \
	CDK_CONFIG_isPullRequest=false \
	CDK_CONFIG_environment=dev \
	CDK_CONFIG_dashboardStackName=dashboards \
	npm run cdk-synth --workspace packages/cdk/

%:
	@$(MAKE) -f /usr/local/share/eps/Mk/common.mk $@
