#!/bin/sh
# Reproduces the failure with the stable oapi-codegen v2.
go run github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@v2.8.2 -config oapi-codegen.yaml openapi.json
