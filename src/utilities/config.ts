import jsonfile from 'jsonfile';

type ServerConfigType = {
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

type ConfigType = {
  servers: {
    [key: string]: ServerConfigType;
  };
  enabledCommands?: string[];
};

export class Config
{
  private static config: ConfigType = { servers: {} };
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

    if(!Config.config.servers)
      await Config.write({ servers: {} });
    else
      await Config.write(Config.config);
  }

  static async get(): Promise<ConfigType>
  {
    await Config.read();
    return Config.config;
  }

  static async ofServer(guildId: string)
  {
    const config = await Config.get();
    const serversConfig = config.servers;
    return serversConfig ? serversConfig[guildId] : ({} as ServerConfigType);
  }

  static async setRoleRequestsApprovalChannel(guildId: string, channelId: string)
  {
    const serverConfig = await Config.ofServer(guildId);
    serverConfig.roleRequestsApprovalChannel = channelId;
    await Config.updateServerConfig(guildId, serverConfig);
  }

  static async updateServerConfig(guildId: string, newServerConfig: ServerConfigType)
  {
    Config.config.servers[guildId] = newServerConfig;
    await Config.write();
  }
};
