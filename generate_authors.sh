#!/bin/bash
# generate_authors.sh
# This script generates an AUTHORS file from the git commit history.

echo "Generating AUTHORS file..."

# Check if the current directory is a Git repository.
if [ ! -d .git ]; then
  echo "Error: This directory is not a Git repository."
  exit 1
fi

# Extract unique author names from commit history and sort them.
git log --format='%aN <%aE>' | sort -u > AUTHORS

echo "AUTHORS file generated successfully."
