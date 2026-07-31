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

# Replace any $ENV_VAR in file. Write to tmp before moving back
substitute_env_in_file() {
  TEMPFILE=$(mktemp)
  envsubst < $1 > $TEMPFILE
  mv $TEMPFILE $1
}

service_is_ready

mkdir -p app/data_sources
cp -r app/data_source_templates/* app/data_sources/

for ds_file in ./app/data_sources/*; do
  substitute_env_in_file $ds_file
done

# Retry wrapper for flaky DMSS operations
retry() {
  local max_attempts=3
  local attempt=1
  local delay=5
  while [ $attempt -le $max_attempts ]; do
    if "$@"; then
      return 0
    fi
    echo "Attempt $attempt/$max_attempts failed. Retrying in ${delay}s..."
    sleep $delay
    attempt=$((attempt + 1))
  done
  echo "ERROR: Command failed after $max_attempts attempts: $*"
  return 1
}

main () {
  for ds_file in ./app/data_sources/*; do
    dm --url "$VITE_DMSS_URL" --token "$TOKEN" --force ds import $ds_file
  done

  echo "Upload DMSS core blueprints to DMSS"
  retry dm --token "$TOKEN" --url  "$VITE_DMSS_URL" --force entities import --no-validate app/data/system/SIMOS system/
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

  # Seed a couple of ready-made websites into the "Sites" data source so the
  # website directory isn't empty on first visit. These are stored via the
  # raw add endpoint (like the builder's own "New site" action) because their
  # inline widget configs are free-form objects the static importer rejects.
  if [ -d app/demo_sites ]; then
    echo "Seeding demo websites into 'Sites'"
    AUTH_HEADER=()
    if [ -n "$TOKEN" ]; then
      AUTH_HEADER=(-H "Authorization: Bearer $TOKEN")
    fi
    for site_file in app/demo_sites/*.json; do
      [ -e "$site_file" ] || continue
      curl --silent --show-error --fail \
        -X POST "$VITE_DMSS_URL/api/documents-add-raw/Sites" \
        -H "Content-Type: application/json" \
        ${AUTH_HEADER[@]+"${AUTH_HEADER[@]}"} \
        --data-binary @"$site_file" > /dev/null &&
        echo "        Seeded $(basename "$site_file") ✓" ||
        echo "        WARNING: failed to seed $(basename "$site_file")"
    done
  fi
}

time main "$@"