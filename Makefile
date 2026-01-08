guard-%:
	@ if [ "${${*}}" = "" ]; then \
		echo "Environment variable $* not set"; \
		exit 1; \
	fi

.PHONY: install build test publish release clean

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

sbom:
	mkdir -p ~/git_actions
	git -C ~/git_actions/eps-actions-sbom/ pull || git clone https://github.com/NHSDigital/eps-action-sbom.git ~/git_actions/eps-actions-sbom/
	docker build -t eps-sbom -f ~/git_actions/eps-actions-sbom/Dockerfile ~/git_actions/eps-actions-sbom/
	docker run -it --rm -v $${LOCAL_WORKSPACE_FOLDER:-.}:/github/workspace eps-sbom

lint-node: compile-node
	npm run lint --workspace packages/cdk

lint-githubactions:
	actionlint

lint-githubaction-scripts:
	shellcheck .github/scripts/*.sh

lint: lint-node lint-githubactions lint-githubaction-scripts

test: compile
	# npm run test --workspace packages/cdk

clean:
	rm -rf cdk.out
	rm -rf cfn_guard_output
	rm -rf packages/cdk/coverage
	rm -rf packages/cdk/lib

deep-clean: clean
	rm -rf .venv
	find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +

check-licenses: check-licenses-node check-licenses-python

check-licenses-node:
	echo "not implemented from console"
	exit 1

check-licenses-python:
	scripts/check_python_licenses.sh

aws-configure:
	aws configure sso --region eu-west-2

aws-login:
	aws sso login --sso-session sso-session

cfn-guard:
	./scripts/run_cfn_guard.sh

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

build-deployment-container-image:
	rm -rf .asdf
	cp -r $$HOME/.asdf .
	docker build -t "eps-aws-dashboards" -f docker/Dockerfile .
