#!/bin/bash

# Check if a commit message is provided
if [ -z "$1" ]; then
  echo "Please provide a commit message."
  exit 1
fi

# Commit your changes
git add .
git commit -m "$1"

# Get the latest commit hash
LATEST_COMMIT_HASH=$(git rev-parse HEAD)

# Update the changelog
echo "Commit $LATEST_COMMIT_HASH: $1" >> CHANGELOG.md

# Commit the changelog update
git add CHANGELOG.md
git commit -m "Update changelog with commit $LATEST_COMMIT_HASH"

# Push to origin master
git push origin master