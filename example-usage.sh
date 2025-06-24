#!/bin/bash

# Example usage of init-cli-project.sh
# This shows how to set the required environment variables and run the script

# Set environment variables
export GITHUB_TOKEN="your-github-token-here"
export GITHUB_ORGANIZATION="your-github-username"
export GITHUB_REPO_NAME="my-new-cli"
export LOCAL_PATH="/path/to/your/new/cli/project"

# Run the initialization script
./init-cli-project.sh

# Alternative: Run with variables inline
# GITHUB_TOKEN="your-token" GITHUB_ORGANIZATION="username" GITHUB_REPO_NAME="repo" LOCAL_PATH="/path" ./init-cli-project.sh
