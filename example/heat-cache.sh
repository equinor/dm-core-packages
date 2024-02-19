#! /usr/bin/env bash

set -euo pipefail

pip install pip --quiet --upgrade
pip install dm-cli --quiet --upgrade

MODE=${1:-local}
# Load environment (mode) specific environment values
source .env.$MODE
# Load token (not needed locally)
TOKEN=${2:-""}

# This should make sure all the workers(4) have loaded every blueprint in the system.

dm --token "$TOKEN" --url $VITE_DMSS_URL entities validate DemoDataSource/plugins & \
dm --token "$TOKEN" --url $VITE_DMSS_URL entities validate DemoDataSource/plugins & \
dm --token "$TOKEN" --url $VITE_DMSS_URL entities validate DemoDataSource/plugins & \
dm --token "$TOKEN" --url $VITE_DMSS_URL entities validate DemoDataSource/plugins

dm --token "$TOKEN" --url $VITE_DMSS_URL entities validate DemoDataSource/apps & \
dm --token "$TOKEN" --url $VITE_DMSS_URL entities validate DemoDataSource/apps & \
dm --token "$TOKEN" --url $VITE_DMSS_URL entities validate DemoDataSource/apps & \
dm --token "$TOKEN" --url $VITE_DMSS_URL entities validate DemoDataSource/apps

dm --token "$TOKEN" --url $VITE_DMSS_URL entities validate DemoDataSource/recipes & \
dm --token "$TOKEN" --url $VITE_DMSS_URL entities validate DemoDataSource/recipes & \
dm --token "$TOKEN" --url $VITE_DMSS_URL entities validate DemoDataSource/recipes & \
dm --token "$TOKEN" --url $VITE_DMSS_URL entities validate DemoDataSource/recipes

