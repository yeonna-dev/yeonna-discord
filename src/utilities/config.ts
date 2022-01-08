import jsonfile from 'jsonfile';

type ConfigType = {
  servers: {
    [key: string]:
    {
      pointsName?: string;
      collectiblesName?: string;
      mostCollectiblesReward?:
      {
        channel: string;
        prizes: number[];
      };
      roleRequestsApprovalChannel: string;
    };
  };
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
  }

  /* Create the initial config data */
  static async init()
  {
    await Config.read();
    await Config.write();
  }

  static async get(): Promise<ConfigType>
  {
    await Config.read();
    return Config.config;
  }

  static async ofServer(guildId: string)
  {
    const config = await Config.get();
    return config.servers[guildId] || {};
  }

  static async setRoleRequestsApprovalChannel(guildId: string, channelId: string)
  {
    const config = await Config.get();
    config.servers[guildId].roleRequestsApprovalChannel = channelId;
    await Config.write(config);
  }
};
