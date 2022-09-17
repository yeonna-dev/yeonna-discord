import { Command } from 'comtroller';
import { Discord } from 'src/libs/discord';
import { ConfigType } from 'yeonna-config';

export type CommandParameters = {
  discord: Discord;
  params: string;
  config: ConfigType;
};

