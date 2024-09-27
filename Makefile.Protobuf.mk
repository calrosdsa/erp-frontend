# Path to this plugin
# PROTOC_GEN_TS_PATH=${PWD}/node_modules/.bin/protoc-gen-ts.cmd
PROTOC_GEN_TS_PATH=${PWD}/node_modules/.bin/protoc-gen-ts_proto.cmd


# Directory to write generated code to (.js and .d.ts files)
OUT_DIR=${PWD}/app/gen


.PHONY: proto
proto:
	protoc --plugin=protoc-gen-ts_proto=".\\node_modules\\.bin\\protoc-gen-ts_proto.cmd" --ts_proto_out=${OUT_DIR} ./common.proto