#! /usr/bin/env bash
# Get the available docker-compose command
docker compose &> /dev/null
if [[ $? == 0 ]]; then
  compose="docker compose"
else
  compose="docker-compose"
fi

set -e

# $1 is the first argument to the shell script. Valid options are 'no-validate-entities' and 'validate-entities'.
# If argument is empty, default value will be no-validate-entities.
if [ -z "$1" ]
  then
    VALIDATION_FLAG="validate-entities"
  else
    if [ $1 != "no-validate-entities" ] && [ $1 != "validate-entities" ]
      then
        echo "validation flag is invalid. valid values are 'no-validate-entities' and 'validate-entities'"
        exit 1
    fi
    VALIDATION_FLAG=$1
fi




eval $compose run --rm dmss reset-app
eval $compose run --rm job-api dm -u http://dmss:5000 reset ../app
dm import-plugin-blueprints ../node_modules/@development-framework/dm-core-plugins
dm reset app --$VALIDATION_FLAG
echo "Creating recipe lookup..."
dm create-lookup example DemoDataSource/recipes