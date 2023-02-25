#!/bin/bash

#
# Deploys all your local firebase functions the specified environment (test/staging or production)
#

if [ "$#" -ne 1 ] || [ "$1" != "TEST" ] && [ "$1" != "STG" ] && [ "$1" != "PROD" ]; then
  echo " 🔴 1 parameter required: TEST (or STG) or PROD (environment to deploy to)"
  exit 1
fi

if [ "$1" == "TEST" ] || [ "$1" == "STG" ]; then
    echo "  🟢 Deploying to TEST/STG environment..."
    firebase deploy --only functions --project venato-ae74d
else
    echo "  🟢 Deploying to PROD environment..."
    firebase deploy --only functions --project venato-production-e2ae0
fi
