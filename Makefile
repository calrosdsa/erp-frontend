generate-sdk:
	npx openapi-typescript http://localhost:9090/openapi.yaml -o ./app/sdk/index.d.ts