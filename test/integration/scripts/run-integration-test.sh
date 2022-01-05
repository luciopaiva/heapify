#!/usr/bin/env sh
set -e

TEST=$1
echo "Running test ${TEST}"
cd "${TEST}"
npm i --silent
npm test --silent
