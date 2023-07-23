#!/bin/bash

#
# Deploys all your local firebase functions the specified environment
# STG: when running locally, PROD: on the deployed site
#

if [ "$#" -ne 1 ]; then
  echo " 🔴 1 parameter required: STG or PROD (environment to deploy to)"
  exit 1
fi

if [ "$1" == "STG" ]; then
    echo "  🟢 Deploying to STG environment..."
    firebase deploy --only functions --project venato-ae74d
elif [ "$1" == "PROD" ]; then
    if [ "$(git rev-parse --abbrev-ref HEAD)" != "main" ]; then
        echo " 🔴 You must be on the main branch to deploy to PROD"
        exit 1
    fi
    echo "  🟢 Deploying to PROD environment..."
    firebase deploy --only functions --project venato-production-e2ae0
else
    echo " 🔴 Invalid environment, must be STG or PROD"
    exit 1
fi
