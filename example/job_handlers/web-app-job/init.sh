#! /bin/bash
set -eu


echo "########### VERSION ##########"
if [[ -e "/code/src/version.txt" ]]; then
  cat "/code/src/version.txt"
else
  echo "No version.txt file"
fi
echo -e "########### VERSION ##########\n"


if [ "$1" = 'run' ]; then
    python3 /code/src/calculate_signal.py
else
  exec "$@"
fi
