#!/bin/bash

# Check if at least one commit message is provided
if [ -z "$1" ]; then
  echo "Please provide a commit message."
  exit 1
fi

# Extract the commit message and review title
COMMIT_MESSAGE="$1"
REVIEW_TITLE="$2"

# Default title if not provided
if [ -z "$REVIEW_TITLE" ]; then
  REVIEW_TITLE="### Released"
fi

# Commit your changes
git add .
git commit -m "$COMMIT_MESSAGE"

# Get the latest short commit hash
LATEST_COMMIT_HASH=$(git rev-parse --short HEAD)
REPO_URL="https://github.com/Ryuku72/MessageNovel" # Replace with your actual repository URL

# Create the changelog entry
CHANGELOG_ENTRY="* $LATEST_COMMIT_HASH $COMMIT_MESSAGE"

# Update CHANGELOG.md
if [ ! -f CHANGELOG.md ]; then
  echo -e "## Changelog\n\n$CHANGELOG_ENTRY" > CHANGELOG.md
else
  echo -e "$CHANGELOG_ENTRY\n$(cat CHANGELOG.md)" > CHANGELOG.md
fi

# Update review.md with the commit message under REVIEW_TITLE
REVIEW_FILE="./app/routes/about.logs/review.md"

if [ ! -f "$REVIEW_FILE" ]; then
  echo -e "$REVIEW_TITLE\n\n- [$LATEST_COMMIT_HASH]($REPO_URL/commit/$LATEST_COMMIT_HASH) $COMMIT_MESSAGE" > "$REVIEW_FILE"
else
  if grep -q "$REVIEW_TITLE" "$REVIEW_FILE"; then
    awk -v text="- [$LATEST_COMMIT_HASH]($REPO_URL/commit/$LATEST_COMMIT_HASH) $COMMIT_MESSAGE" "/^$REVIEW_TITLE$/ {print; print text; next} 1" "$REVIEW_FILE" > temp && mv temp "$REVIEW_FILE"
  else
    echo -e "\n$REVIEW_TITLE\n\n- [$LATEST_COMMIT_HASH]($REPO_URL/commit/$LATEST_COMMIT_HASH) $COMMIT_MESSAGE\n$(cat "$REVIEW_FILE")" > "$REVIEW_FILE"
  fi
fi

# Commit the changelog and review update
git add CHANGELOG.md "$REVIEW_FILE"
git commit -m "Update changelog and review with commit $LATEST_COMMIT_HASH"

# Push to origin master
git push origin master

echo "Script execution complete."
