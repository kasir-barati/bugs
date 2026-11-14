#!/bin/sh
# Reproduces the failure with the stable oapi-codegen v2.
go run github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@v2.5.1 -config oapi-codegen.yaml openapi.json
