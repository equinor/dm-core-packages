#! /usr/bin/env bash
# Get the available docker-compose command
docker compose &> /dev/null
if [[ $? == 0 ]]; then
  compose="docker compose"
else
  compose="docker-compose"
fi

set -e

eval $compose run --rm dmss reset-app
eval $compose run --rm job-api dm -u http://dmss:5000 reset ../app
dm reset app
dm import-plugin-blueprints ../node_modules/@development-framework/dm-core-plugins
echo "Creating recipe lookup..."
dm create-lookup example DemoDataSource/recipes