#!/bin/bash
set -eEuo pipefail

# start server
# PORT=9876 npm run start &
PORT=9876 node ./dist/index.js &
PID=$!

# stop server at end or interrupt
function stop_server {
  kill $PID
}
trap stop_server EXIT

# run tests
npm run test
