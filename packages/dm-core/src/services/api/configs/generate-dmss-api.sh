#! /usr/bin/env bash
# Must be run from "packages/dm-core/src/services/api/configs"
# This requires the DMSS API to be running on localhost port 5000
docker run --ulimit nofile=122880:122880 --rm --network="host" -v ${PWD}:/local openapitools/openapi-generator-cli:v6.2.1 generate \
    -i http://127.0.0.1:5000/openapi.json \
    -g typescript-axios \
    --additional-properties=useSingleRequestParameter=true,withSeparateModelsAndApi=true,apiPackage=api,modelPackage=models \
    -o /local/gen