.PHONY: install build test publish release clean lint install-node compile

install: install-node install-python install-hooks

install-python:
	poetry install

install-node:
	npm ci

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


cdk-deploy: guard-stack_name
	REQUIRE_APPROVAL="$${REQUIRE_APPROVAL:-any-change}" && \
	VERSION_NUMBER="$${VERSION_NUMBER:-undefined}" && \
	COMMIT_ID="$${COMMIT_ID:-undefined}" && \
		npx cdk deploy \
		--app "npx ts-node --prefer-ts-exts packages/cdk/bin/DashboardsApp.ts" \
		--all \
		--ci true \
		--require-approval $${REQUIRE_APPROVAL} \
		--context stackName=$$stack_name \
		--context VERSION_NUMBER=$$VERSION_NUMBER \
		--context COMMIT_ID=$$COMMIT_ID

cdk-synth:
	npx cdk synth \
		--app "npx ts-node --prefer-ts-exts packages/cdk/bin/DashboardsApp.ts" \
		--context accountId=undefined \
		--context stackName=dashboards \
		--context versionNumber=undefined \
		--context commitId=undefined

cdk-diff:
	npx cdk diff \
		--app "npx ts-node --prefer-ts-exts packages/cdk/bin/DashboardsApp.ts" \
		--context accountId=$$ACCOUNT_ID \
		--context stackName=$$stack_name \
		--context versionNumber=$$VERSION_NUMBER \
		--context commitId=$$COMMIT_ID

cdk-watch: guard-stack_name
	REQUIRE_APPROVAL="$${REQUIRE_APPROVAL:-any-change}" && \
	VERSION_NUMBER="$${VERSION_NUMBER:-undefined}" && \
	COMMIT_ID="$${COMMIT_ID:-undefined}" && \
		npx cdk deploy \
		--app "npx ts-node --prefer-ts-exts packages/cdk/bin/DashboardsApp.ts" \
		--watch \
		--all \
		--ci true \
		--require-approval $${REQUIRE_APPROVAL} \
		--context accountId=$$ACCOUNT_ID \
		--context stackName=$$stack_name \
		--context versionNumber=$$VERSION_NUMBER \
		--context commitId=$$COMMIT_ID

%:
	@$(MAKE) -f /usr/local/share/eps/Mk/common.mk $@
