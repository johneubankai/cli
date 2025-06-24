import { SubCommand } from '../subcommand';

export abstract class SupabaseCommand extends SubCommand {
  parentCommand = 'sb';
  
  protected getSupabaseProjectPath(): string {
    return '/Users/john2/johneubankai/supabase';
  }
}
