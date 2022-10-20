#!/bin/bash

GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$GIT_BRANCH" == "main" ]
then
    CONFIG_FILE=config/production.tfbackend
else
    CONFIG_FILE=config/dev.tfbackend
fi

echo "Using $CONFIG_FILE"
terraform init -reconfigure -backend-config=$CONFIG_FILE
