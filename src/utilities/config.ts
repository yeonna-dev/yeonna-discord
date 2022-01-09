import jsonfile from 'jsonfile';

type ConfigType = {
  prefix?: string;
  enabledCommands?: string[];
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
};

export class Config
{
  private static config: ConfigType = { guilds: {} };
  private static configFile = 'config.json';

  private static async read()
  {
    Config.config = await jsonfile.readFile(Config.configFile);
  }

  private static async write(newConfig?: ConfigType)
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

  static async ofGuild(guildId: string)
  {
    const config = await Config.get();
    const guildsConfig = config.guilds;
    return guildsConfig ? (guildsConfig[guildId] || {}) : ({} as GuildConfigType);
  }

  static async setRoleRequestsApprovalChannel(guildId: string, channelId: string)
  {
    const guildConfig = await Config.ofGuild(guildId);
    guildConfig.roleRequestsApprovalChannel = channelId;
    await Config.updateGuildConfig(guildId, guildConfig);
  }

  static async updateGuildConfig(guildId: string, newGuildConfig: GuildConfigType)
  {
    Config.config.guilds[guildId] = newGuildConfig;
    await Config.write();
  }
};
