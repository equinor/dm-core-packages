#! /usr/bin/env bash

set -euo pipefail

pip install pip --quiet --upgrade
pip install dm-cli --quiet --upgrade

# Get the available docker-compose command
docker compose &> /dev/null
if [[ $? == 0 ]]; then
  compose="docker compose"
else
  compose="docker-compose"
fi

MODE=${1:-local}
# Load environment (mode) specific environment values
source .env.$MODE
# Load token (not needed locally)
TOKEN=${2:-""}

echo "RESET ENVIRONMENT: $MODE"
echo "DMSS URL: $VITE_DMSS_URL"

# Wait until the storage services is ready before continuing.
# This is to ensure that the services is initialized before the API tries to connect.
service_is_ready() {
  ATTEMPT_COUNTER=1
  MAX_ATTEMPTS=100
  echo "Testing availability of DMSS: $VITE_DMSS_URL"
  until $(curl --silent --output /dev/null --fail "$VITE_DMSS_URL/api/healthcheck"); do
    if [ ${ATTEMPT_COUNTER} -eq ${MAX_ATTEMPTS} ];then
      echo "ERROR: Max attempts reached. Data Modelling Storage API($VITE_DMSS_URL) did not respond. Exiting..."
      exit 1
    fi
    echo "Waiting for $VITE_DMSS_URL... (${ATTEMPT_COUNTER})"
    ATTEMPT_COUNTER=$((ATTEMPT_COUNTER+1))
    sleep 5
  done
  echo "DMSS is ready!"
}
service_is_ready

main () {
  for ds_file in ./app/data_sources/*; do
    dm --url "$VITE_DMSS_URL" --token "$TOKEN" --force ds import $ds_file
  done

  echo "Upload DMSS core blueprints to DMSS"
  dm --token "$TOKEN" --url  "$VITE_DMSS_URL" --force entities import --no-validate app/data/system/SIMOS system/
  echo "Creating DMSS lookup"
  dm --token "$TOKEN" --url $VITE_DMSS_URL create-lookup DMSS "system/SIMOS/recipe_links"

  echo "Uploading application data"
  for DS_NAME in ./app/data/*; do
    if [ "$(basename $DS_NAME)"  == "system" ]; then
      echo "Skipping re-uploading CORE SIMOS package"
      continue
    fi
    for ROOT_PACKAGE in $DS_NAME/*; do
      dm --token "$TOKEN" --force --url $VITE_DMSS_URL entities import --no-validate "$ROOT_PACKAGE" "$(basename $DS_NAME)"
    done
  done
  echo "Upload plugins blueprints to DMSS"
  dm --token "$TOKEN" --url $VITE_DMSS_URL import-plugin-blueprints ../node_modules/@development-framework/dm-core-plugins

  # The entities contain cross DS references, and most therefore be validated after all entities in all DSs has been uploaded
  for DS_NAME in ./app/data/*; do
    for ROOT_PACKAGE in $DS_NAME/*; do
      dm --token "$TOKEN" --url $VITE_DMSS_URL entities validate "$(basename $DS_NAME)/$(basename $ROOT_PACKAGE)"
    done
  done

  echo "Creating lookup table"
  dm --token "$TOKEN" --url $VITE_DMSS_URL create-lookup exampleApplication DemoDataSource/recipes
}

time main "$@"