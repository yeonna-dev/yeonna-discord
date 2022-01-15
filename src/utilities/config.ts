import jsonfile from 'jsonfile';

type ConfigType = {
  prefix?: string;
  enabledCommands?: string[] | 'all';
  guilds: {
    [key: string]: GuildConfigType;
  };
};

type GuildConfigType = {
  pointsName?: string;
  collectiblesName?: string;
  mostCollectiblesReward?:
  {
    channel: string;
    prizes: number[];
  };
  roleRequestsApprovalChannel?: string;
  enabledCommands?: string[];
  reactRepost?: {
    count?: number;
    channel?: string;
    color?: string;
  };
};

export class Config
{
  private static configFile = 'config.json';
  static config: ConfigType = { guilds: {} };

  private static async read()
  {
    Config.config = await jsonfile.readFile(Config.configFile);
  }

  static async write(newConfig?: ConfigType)
  {
    await jsonfile.writeFile(Config.configFile, newConfig || Config.config, { spaces: 2 });
    Config.config = newConfig || Config.config;
  }

  /* Create the initial config data */
  static async init()
  {
    await Config.read();

    if(!Config.config.guilds)
      await Config.write({ guilds: {} });
    else
      await Config.write(Config.config);
  }

  static async get(): Promise<ConfigType>
  {
    await Config.read();
    return Config.config;
  }

  static ofGuild(guildId: string)
  {
    const guildsConfig = Config.config.guilds[guildId] || {};
    return guildsConfig as GuildConfigType;
  }

  static async updateGuildConfig(guildId: string, newGuildConfig: GuildConfigType)
  {
    Config.config.guilds[guildId] = newGuildConfig;
    await Config.write();
  }

  static async setRoleRequestsApprovalChannel(guildId: string, channelId: string)
  {
    const guildConfig = Config.ofGuild(guildId);
    guildConfig.roleRequestsApprovalChannel = channelId;
    await Config.updateGuildConfig(guildId, guildConfig);
  }

  static async setReactRepostChannel(guildId: string, channelId: string)
  {
    const guildConfig = Config.ofGuild(guildId);
    if(!guildConfig.reactRepost)
      return;

    guildConfig.reactRepost.channel = channelId;
    await Config.updateGuildConfig(guildId, guildConfig);
  }
};
