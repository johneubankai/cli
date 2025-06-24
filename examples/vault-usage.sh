#!/bin/bash

# Example: Using JX CLI Vault Commands
# This script demonstrates how to use the jx vault commands with your Supabase Vault

echo "🔐 JX CLI - Supabase Vault Examples"
echo "===================================="

# Example 1: List all vault keys
echo -e "\n1️⃣ List all available vault keys:"
echo "   jx vault list"
echo ""
echo "   Output:"
echo "   Available vault keys:"
echo "   -------------------"
echo "   • API_KEY"
echo "   • DATABASE_PASSWORD"
echo "   • VAULT_TEST_SECRET"
echo "   • ..."

# Example 2: Get a secret (masked by default)
echo -e "\n2️⃣ Get a secret value (masked for security):"
echo "   jx vault get API_KEY"
echo ""
echo "   Output:"
echo "   Key: API_KEY"
echo "   Value (masked): ex********************le"
echo "   ✅ Value copied to clipboard!"

# Example 3: Show full value (use with caution!)
echo -e "\n3️⃣ Display full secret value:"
echo "   jx vault get API_KEY --show"
echo ""
echo "   Output:"
echo "   Key: API_KEY"
echo "   Value: example_api_key_value"

# Example 4: Using with environment variables
echo -e "\n4️⃣ Using environment variables:"
echo "   export SUPABASE_PROJECT_REF='your-project-ref'"
echo "   export SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiI...'"
echo "   jx vault list"

# Example 5: Using with command flags
echo -e "\n5️⃣ Using command line flags:"
echo "   jx vault get DATABASE_PASSWORD \\"
echo "     --project-ref 'your-project-ref' \\"
echo "     --anon-key 'eyJhbGciOiJIUzI1NiI...'"

# Security Best Practices
echo -e "\n🔒 Security Best Practices:"
echo "   • Secrets are masked by default to prevent accidental exposure"
echo "   • Values are automatically copied to clipboard when available"
echo "   • Use --show flag only when absolutely necessary"
echo "   • Never commit .env files with real credentials"
echo "   • Use secure secret managers in production"

# Requirements
echo -e "\n📋 Requirements:"
echo "   • Supabase project with vault-secrets-reader Edge Function deployed"
echo "   • Project reference (from your Supabase dashboard)"
echo "   • Anon key (get with: supabase projects api-keys --project-ref YOUR_REF)"
