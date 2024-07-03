#!/bin/bash

# Check if a commit message is provided
if [ -z "$1" ]; then
  echo "Please provide a commit message."
  exit 1
fi

# Commit your changes
git add .
git commit -m "$1"

# Get the latest short commit hash
LATEST_COMMIT_HASH=$(git rev-parse --short HEAD)

# Create the changelog entry
CHANGELOG_ENTRY="* $LATEST_COMMIT_HASH $1"

# Check if the changelog file exists and if it contains the title
if [ ! -f CHANGELOG.md ]; then
  # Create the changelog file with the title and the new entry
  echo -e "## Changelog\n\n$CHANGELOG_ENTRY" > CHANGELOG.md
else
  # Check if the title is already present
  if grep -q "## Changelog" CHANGELOG.md; then
    # Title exists, prepend the new entry below the title
    sed -i "1a\\
\\
$CHANGELOG_ENTRY" CHANGELOG.md
  else
    # Title does not exist, add the title and the new entry
    echo -e "## Changelog\n\n$CHANGELOG_ENTRY\n$(cat CHANGELOG.md)" > CHANGELOG.md
  fi
fi

# Commit the changelog update
git add CHANGELOG.md
git commit -m "Update changelog with commit $LATEST_COMMIT_HASH"

# Push to origin master
git push origin master