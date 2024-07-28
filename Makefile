generate-openapi-sdk:
	make generate-account-sdk

generate-account-sdk:
	npx openapi-typescript http://localhost:9090/static/docs/account/api.yaml -o ./app/sdk/account.d.ts