#!/usr/bin/env bash
set -e
docker-compose run --rm dmss reset-app
docker-compose run --rm job-api dm -u http://dmss:5000 reset ../app
dm reset app
dm import-plugin-blueprints node_modules/@development-framework/dm-core-plugins
echo "Creating recipe lookup..."
dm create-lookup example DemoDataSource/instances/recipe_links