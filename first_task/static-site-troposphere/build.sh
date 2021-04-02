#!/bin/bash -e

STACK_NAME="${STACK_NAME:-staticSiteTroposphere}"

# Verify AWS access
aws iam get-user &> /dev/null || \
  echo "Cannot access AWS."

# Go to root of this repo
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "${DIR}"

if [[ ! -d .venv/ ]]; then
  python3 -m venv .venv
  . .venv/bin/activate
fi

python3 main.py \
  > output.json

aws cloudformation deploy \
  --no-fail-on-empty-changeset \
  --template-file output.json \
  --stack-name "${STACK_NAME}"

IP="$(aws cloudformation describe-stacks \
  --stack-name "${STACK_NAME}" | \
  echo .Stacks[0].Outputs[2].OutputValue)"

echo $(aws cloudformation describe-stacks \
  --stack-name ${STACK_NAME})
echo "Your instance can be accessed at http://${IP}"