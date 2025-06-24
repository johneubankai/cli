#!/bin/bash

# Example usage of the Slack CLI commands in jx

echo "=== Slack CLI Command Examples ==="
echo ""

echo "1. Login to Slack workspace:"
echo "   jx slack login --workspace my-company"
echo ""

echo "2. Create a new Slack app:"
echo "   jx slack create my-bot-app --typescript --bolt"
echo ""

echo "3. Run the app locally:"
echo "   jx slack run --port 3000 --debug"
echo ""

echo "4. Check environment variables:"
echo "   jx slack env list"
echo ""

echo "5. Add a new environment variable:"
echo "   jx slack env add SLACK_BOT_TOKEN xoxb-your-token --secret"
echo ""

echo "6. Deploy to production:"
echo "   jx slack deploy --prod --workspace my-company"
echo ""

echo "7. Run diagnostics:"
echo "   jx slack doctor --verbose"
echo ""

echo "Note: Make sure Slack CLI is installed before running these commands."
echo "Install from: https://api.slack.com/automation/cli/install"
