#!/bin/bash

# Check if at least one commit message is provided
if [ -z "$1" ]; then
  echo "Please provide a commit message."
  exit 1
fi

# Extract the commit message and review title
COMMIT_MESSAGE="$1"
REVIEW_TITLE="$2"

echo "Commit message: $COMMIT_MESSAGE"
echo "Review title: $REVIEW_TITLE"

# Commit your changes
echo "Adding and committing changes..."
git add .
git commit -m "$COMMIT_MESSAGE"

# Get the latest short commit hash
LATEST_COMMIT_HASH=$(git rev-parse --short HEAD)
REPO_URL="https://github.com/Ryuku72/MessageNovel" # Replace with your actual repository URL

echo "Latest commit hash: $LATEST_COMMIT_HASH"

# Create the changelog entry
CHANGELOG_ENTRY="* $LATEST_COMMIT_HASH $COMMIT_MESSAGE"

# Update CHANGELOG.md
echo "Updating CHANGELOG.md..."
if [ ! -f CHANGELOG.md ]; then
  echo -e "## Changelog\n\n$CHANGELOG_ENTRY" > CHANGELOG.md
else
  echo -e "$CHANGELOG_ENTRY\n$(cat CHANGELOG.md)" > CHANGELOG.md
fi

echo "Updated CHANGELOG.md: "
cat CHANGELOG.md

# Update review.md with the provided review title
if [ -z "$REVIEW_TITLE" ]; then
  echo "No review title provided. Skipping review update."
else
  REVIEW_FILE="./app/routes/about.logs/review.md"

  echo "Review file path: $REVIEW_FILE"

  # Check if REVIEW_FILE exists
  if [ ! -f "$REVIEW_FILE" ]; then
    echo -e "$REVIEW_TITLE\n\n- [$LATEST_COMMIT_HASH]($REPO_URL/commit/$LATEST_COMMIT_HASH) $COMMIT_MESSAGE" > "$REVIEW_FILE"
  else
    # Check if REVIEW_TITLE exists in REVIEW_FILE
    if grep -q "$REVIEW_TITLE" "$REVIEW_FILE"; then
      # Append CHANGELOG_ENTRY under REVIEW_TITLE
      echo "Appending to existing review title..."
      sed -i "/^$REVIEW_TITLE$/a - [$LATEST_COMMIT_HASH]($REPO_URL/commit/$LATEST_COMMIT_HASH) $COMMIT_MESSAGE" "$REVIEW_FILE"
    else
      # Add new section with REVIEW_TITLE followed by CHANGELOG_ENTRY
      echo "Creating new review title section..."
      echo -e "\n$REVIEW_TITLE\n\n- [$LATEST_COMMIT_HASH]($REPO_URL/commit/$LATEST_COMMIT_HASH) $COMMIT_MESSAGE\n$(cat "$REVIEW_FILE")" > "$REVIEW_FILE"
    fi
  fi

  echo "Updated $REVIEW_FILE: "
  cat "$REVIEW_FILE"
fi

# Commit the changelog and review update
echo "Committing changelog and review update..."
git add CHANGELOG.md "$REVIEW_FILE"
git commit -m "Update changelog and review with commit $LATEST_COMMIT_HASH"

# Push to origin master
echo "Pushing changes to origin master..."
git push origin master

echo "Script execution complete."
