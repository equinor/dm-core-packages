#! /bin/bash

set -eu

if [ "$1" = 'start' ]; then
  echo "Running in Radix environment: $RADIX_ENVIRONMENT"
  yarn build --mode ${RADIX_ENVIRONMENT:-'local'}
  npm run serve
else
  exec "$@"
fi
