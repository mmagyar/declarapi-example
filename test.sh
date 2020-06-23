#!/bin/bash
set -eEuo pipefail

# build server
npm run build

# start server
PORT=9876 node ./dist/index.js &
PID=$!

# stop server at end or interrupt
function stop_server {
  kill $PID
}
trap stop_server EXIT

# run tests
npm run test
