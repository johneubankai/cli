#!/bin/bash

# Install JX CLI dependencies
cd /tmp/jx-cli
npm install

# Install Playwright latest
npm install -D playwright@latest

# Build the project
npm run build

echo "JX CLI setup complete!"
echo "You can now run commands like:"
echo "  npm link  # To install globally"
echo "  jx --help # To see available commands"
