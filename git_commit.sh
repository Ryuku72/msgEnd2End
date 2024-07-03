#!/bin/bash

# Check if at least one review title (date) and commit message are provided
if [ -z "$1" ]; then
  echo "Please provide a review title (date)."
  exit 1
fi

if [ -z "$2" ]; then
  echo "Please provide a commit message."
  exit 1
fi

# Extract the review title (date) and commit message
REVIEW_TITLE="$1"
COMMIT_MESSAGE="$2"

# Commit your changes
git add .
git commit -m "$COMMIT_MESSAGE"

# Get the latest short commit hash
LATEST_COMMIT_HASH=$(git rev-parse --short HEAD)
REPO_URL="https://github.com/Ryuku72/MessageNovel" # Replace with your actual repository URL

# Create the changelog entry
CHANGELOG_ENTRY="* $LATEST_COMMIT_HASH $COMMIT_MESSAGE"
REVIEW_ENTRY="- [$LATEST_COMMIT_HASH]($REPO_URL/commit/$LATEST_COMMIT_HASH) $COMMIT_MESSAGE"

# Update CHANGELOG.md
if [ ! -f CHANGELOG.md ]; then
  echo -e "## Changelog\n\n$CHANGELOG_ENTRY" > CHANGELOG.md
else
  sed -i "1i$CHANGELOG_ENTRY\n" CHANGELOG.md
fi

# Update review.md with the provided review title
if [ -z "$REVIEW_TITLE" ]; then
  echo "No review title provided. Skipping review update."
else
  REVIEW_FILE="./app/routes/about.logs/review.md"

  if [ ! -f "$REVIEW_FILE" ]; then
    echo -e "$REVIEW_TITLE\n\n$REVIEW_ENTRY" > "$REVIEW_FILE"
  else
    sed -i "/$REVIEW_TITLE/a\\
$REVIEW_ENTRY\n" "$REVIEW_FILE"
  fi
fi

# Commit the changelog and review update
git add CHANGELOG.md "$REVIEW_FILE"
git commit -m "Update changelog and review with commit $LATEST_COMMIT_HASH"

# Push to origin master
git push origin master
