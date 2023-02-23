#!/bin/bash

#
# This file deploys the app to GitHub Pages
# Note: You must be on the main branch, have no local changes, then run this (./tools/deploy.sh)
#

# Verify params and state
if [ "$#" -ne 0 ]; then
  echo " 🔴 No parameters required"
  exit 1
fi

if [ "$(git rev-parse --abbrev-ref HEAD)" != "main" ]; then
    echo " 🔴 You must be on the main branch to deploy"
    exit 1
fi

if [ "$(git rev-parse --git-dir)" != '.git' ]; then
    echo " 🔴 You must be in the root directory of the project to deploy"
    exit 1
fi

if [ "$(git status --porcelain | wc -l)" -eq "0" ]; then
  echo "  🟢 Git repo is clean, starting build..."
else
  echo "  🔴 Git repo dirty, commit or stash all local changes before deploying"
  exit 1
fi

# Update firebase config for production, build and deploy
cp tools/prodConfig.ts src/config/firebase.ts &&
npm run build &&
gh-pages -d build &&
git restore src/config/firebase.ts &&

# Automatically regenerate the CNAME file
git checkout gh-pages &&
git pull &&
echo 'venatoapp.ca' > CNAME &&
git add CNAME &&
git commit -m 'Regenerate CNAME file' &&
git push &&
git checkout @{-1}
