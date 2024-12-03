include Makefile.Protobuf.mk


generate-sdk:
	npx openapi-typescript http://localhost:9090/openapi.yaml -o ./app/sdk/index.d.ts



tag=latest
docker:
	docker build -t jmiranda21/erp-front:$(tag) .
	docker push jmiranda21/erp-front:$(tag)	


