# Supabase Vault Functions

This directory contains Supabase Edge Functions for the vault commands in the JX CLI.

## Setup

1. First, make sure you have the Supabase CLI installed:
```bash
brew install supabase/tap/supabase
```

2. Link your project:
```bash
supabase link --project-ref ghsaconkpqvfickyklay
```

3. Run the migration to create the vault_secrets table:
```bash
supabase db push
```

4. Deploy the edge functions:
```bash
supabase functions deploy vault-list
supabase functions deploy vault-get
supabase functions deploy vault-set
supabase functions deploy vault-remove
```

## Functions

- `vault-list` - Lists all secrets in the vault
- `vault-get` - Gets a specific secret (with optional reveal)
- `vault-set` - Sets or updates a secret
- `vault-remove` - Removes a secret

## Usage

The JX CLI will automatically use these functions when you run vault commands:

```bash
# List all secrets
jx vault list

# Get a secret (hidden by default)
jx vault get MY_SECRET

# Get a secret and reveal its value
jx vault get MY_SECRET --reveal

# Set a secret
jx vault set MY_SECRET my-value

# Remove a secret
jx vault rm MY_SECRET
```

## Security

- All functions require authentication via the Supabase anon key
- The actual secret values are stored encrypted in the database
- Only the service role can access the vault_secrets table
