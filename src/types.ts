import { Command } from 'comtroller';
import { Discord } from 'src/libs/discord';
import { ConfigType } from 'yeonna-config';

export interface GuildConfig extends ConfigType
{
  pointsName: string;
  collectiblesName: string;
}

export type CommandParameters = {
  discord: Discord;
  params: string;
  config: GuildConfig;
};

export interface YeonnaCommand extends Command
{
  run(parameters: CommandParameters): void;
}
