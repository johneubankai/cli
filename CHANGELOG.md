# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-06-23

### Changed
- **BREAKING**: Renamed binary from `cli` to `jx`
- **BREAKING**: Renamed package to `@johneubankai/jx-cli`
- Restructured commands to support nested sub-commands
- Updated all documentation to reflect new command structure

### Added
- Supabase Edge Functions integration
- `jx check functions` command to list deployed Edge Functions
- Support for Supabase PAT and project reference via environment variables or flags
- Comprehensive error handling for missing credentials
- Example environment file (`.env.example`)
- Better package metadata for npm publishing

### Technical
- Integrated `execa` v5.1.1 for subprocess management
- Updated test suite to cover new functionality
- Added type safety for all command options

## [1.0.0] - 2025-06-23

### Initial Release
- Basic hello world Commander.js CLI
- TypeScript support with strict configuration
- ESLint and Jest integration
- Simple `hello` and `goodbye` commands
