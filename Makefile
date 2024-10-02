include Makefile.Protobuf.mk


generate-sdk:
	npx openapi-typescript http://localhost:9090/openapi.yaml -o ./app/sdk/index.d.ts
	npx openapi-typescript http://localhost:9091/openapi.yaml -o ./app/sdk/index2.d.ts



tag=latest
docker:
	docker build -t jmiranda0521/erp-frontend:$(tag) .
	docker push jmiranda0521/erp-frontend:$(tag)	


