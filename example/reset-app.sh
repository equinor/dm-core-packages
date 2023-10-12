#! /usr/bin/env bash
# Get the available docker-compose command
docker compose &> /dev/null
if [[ $? == 0 ]]; then
  compose="docker compose"
else
  compose="docker-compose"
fi

set -e

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

if [ "$MODE" == "local" ]; then
  echo "Upload Job API blueprints to DMSS"
  eval $compose run --rm job-api dm --url http://dmss:5000 reset ../app
else
  eval $compose run --rm job-api dm --token "$TOKEN" --url $VITE_DMSS_URL reset ../app
fi
echo "Upload plugins blueprints to DMSS"
dm --token "$TOKEN" --url $VITE_DMSS_URL import-plugin-blueprints ../node_modules/@development-framework/dm-core-plugins
echo "Upload app/ to DMSS"
dm --force --token "$TOKEN" --url $VITE_DMSS_URL reset app
echo "Creating lookup table"
dm --token "$TOKEN" --url $VITE_DMSS_URL create-lookup example DemoDataSource/recipes