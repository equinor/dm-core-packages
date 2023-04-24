#!/usr/bin/env bash
set -e 
docker-compose run --rm dmss reset-app
dm reset app
dm import-plugin-blueprints node_modules/@development-framework/dm-core-plugins
dm create-lookup example DemoDataSource/instances/recipe_links
#dm create-lookup signalapp SignalApp/DemoPackage/recipe_links