#!/bin/bash

# Check if at least one commit message is provided
if [ -z "$1" ]; then
  echo "Please provide a commit message."
  exit 1
fi

# Extract the commit message and review title
COMMIT_MESSAGE="$1"
REVIEW_TITLE="$2"

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

# Update review.md with the provided review title
if [ -z "$REVIEW_TITLE" ]; then
  echo "No review title provided. Skipping review update."
else
  REVIEW_FILE="./app/routes/about.logs/review.md"

  # Ensure REVIEW_TITLE has the correct format for comparison
  REVIEW_TITLE_FORMATTED=$(echo "$REVIEW_TITLE" | sed 's/\//\\\//g')

  # Check if REVIEW_FILE exists
  if [ ! -f "$REVIEW_FILE" ]; then
    echo -e "$REVIEW_TITLE\n\n$CHANGELOG_ENTRY" > "$REVIEW_FILE"
  else
    # Check if REVIEW_TITLE exists in REVIEW_FILE
    if grep -q "$REVIEW_TITLE_FORMATTED" "$REVIEW_FILE"; then
      # Append CHANGELOG_ENTRY under REVIEW_TITLE
      echo -e "\n$CHANGELOG_ENTRY" >> "$REVIEW_FILE"
    else
      # Add new section with REVIEW_TITLE followed by CHANGELOG_ENTRY
      echo -e "\n$REVIEW_TITLE\n\n$CHANGELOG_ENTRY\n$(cat "$REVIEW_FILE")" > "$REVIEW_FILE"
    fi
  fi
fi

# Commit the changelog and review update
git add CHANGELOG.md "$REVIEW_FILE"
git commit -m "Update changelog and review with commit $LATEST_COMMIT_HASH"

# Push to origin master
git push origin master
