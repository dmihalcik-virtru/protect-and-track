#!/bin/bash

set -eu

# TEST_MARKER is the test suite that will be selected to run, by default it is regression suite
TEST_MARKER=${TEST_MARKER:-regression}
echo "TEST_ENVIRONMENT_NAME: ${TEST_ENVIRONMENT_NAME}; TEST_MARKER: ${TEST_MARKER}"

docker pull virtru/automated-test:latest

docker run --rm -it $(env | cut -f1 -d= | sed 's/^/-e /') -v "$PWD/e2e:/virtru/e2e" -v "$PWD/e2e/reports:/virtru/reports" -v "$PWD/.buildkite/scripts:/virtru/e2e/scripts"  virtru/automated-test:latest pytest -v -s -n2 e2e -m $TEST_MARKER --use-bp=chrome_store --cucumberjson=reports/cucumber_report.json --cucumber-json-expanded --html=reports/general_report.html --self-contained-html
