#!/bin/bash

# Example: Using JX CLI to check Supabase Edge Functions
# This script demonstrates various ways to use the jx check functions command

echo "🚀 JX CLI - Supabase Edge Functions Examples"
echo "============================================"

# Example 1: Using environment variables
echo -e "\n1️⃣ Using environment variables:"
echo "   export SUPABASE_PAT='your-token'"
echo "   export SUPABASE_PROJECT_REF='your-project-ref'"
echo "   jx check functions"

# Example 2: Using command line flags
echo -e "\n2️⃣ Using command line flags:"
echo "   jx check functions --pat 'your-token' --project-ref 'your-project-ref'"

# Example 3: Using a .env file with dotenv
echo -e "\n3️⃣ Using a .env file (requires dotenv-cli):"
echo "   npm install -g dotenv-cli"
echo "   dotenv -- jx check functions"

# Example 4: Using with 1Password CLI
echo -e "\n4️⃣ Using with 1Password CLI:"
echo '   jx check functions \'
echo '     --pat $(op read "op://Personal/Supabase PAT/token") \'
echo '     --project-ref $(op read "op://Personal/Supabase/project-ref")'

# Example 5: In a CI/CD pipeline
echo -e "\n5️⃣ In GitHub Actions:"echo "   - name: Check Supabase Functions"
echo "     env:"
echo "       SUPABASE_PAT: \${{ secrets.SUPABASE_PAT }}"
echo "       SUPABASE_PROJECT_REF: \${{ secrets.SUPABASE_PROJECT_REF }}"
echo "     run: npx @johneubankai/jx-cli check functions"

echo -e "\n📝 Note: The Supabase CLI must be installed for this to work:"
echo "   npm install -g supabase"
