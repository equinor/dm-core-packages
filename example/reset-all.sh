#!/usr/bin/env bash
docker-compose run --rm dmss reset-app
dm reset app
dm import-plugin-blueprints node_modules/@development-framework/dm-core-plugins
dm create-lookup example DemoDataSource/DemoPackage/recipe_links