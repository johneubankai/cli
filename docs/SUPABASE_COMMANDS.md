# Supabase CLI Commands

The following Supabase commands have been implemented in the JX CLI tool:

## Prerequisites

1. **Supabase Access Token**: Set `SUPABASE_PAT` or `SUPABASE_ACCESS_TOKEN` in your `.env` file
   - Get your token from: https://app.supabase.com/account/tokens

2. **Link Project**: Before using any commands, link your project:
   ```bash
   jx sb link <project-ref>
   ```

## Available Commands

### 1. Link to a Supabase Project
```bash
jx sb link <project-ref>
```
Links your local environment to a Supabase project.

### 2. Push Database Migrations
```bash
jx sb db push
```
Pushes all migrations from `/Users/john2/johneubankai/supabase/migrations` to your linked Supabase project.

Options:
- `--project-ref <ref>` - Override the linked project reference
### 3. Deploy Edge Functions
```bash
# Deploy a single function
jx sb functions deploy <function-name>

# Deploy all functions
jx sb functions deploy --all
```
Deploys edge functions from `/Users/john2/johneubankai/supabase/functions` to your linked Supabase project.

Options:
- `--project-ref <ref>` - Override the linked project reference
- `--all` - Deploy all functions in the functions directory

### 4. List Edge Functions
```bash
jx sb functions list
```
Lists all edge functions deployed to your linked Supabase project.

## Directory Structure

All Supabase configuration is stored in:
```
/Users/john2/johneubankai/supabase/
├── config.toml          # Supabase configuration
├── functions/           # Edge functions
│   └── function-name/
│       └── index.ts
└── migrations/          # Database migrations    └── *.sql
```

## Implementation Details

- Commands are implemented in `/Users/john2/johneubankai/cli/src/commands/sb/`
- The `SupabaseManagementService` handles API calls to Supabase
- All commands respect the configured project path: `/Users/john2/johneubankai/supabase`
