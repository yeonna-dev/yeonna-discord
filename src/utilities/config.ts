import jsonfile from 'jsonfile';

type ConfigType = {
  servers: {
    [key: string]:
    {
      pointsName?: string,
      collectiblesName?: string,
      mostCollectiblesReward?:
      {
        channel: string;
        prizes: number[];
      };
    };
  };
};

export class Config
{
  private static config: ConfigType = { servers: {} };
  private static configFile = 'config.json';

  private static async read()
  {
    this.config = await jsonfile.readFile(this.configFile);
  }

  private static async write(newConfig?: ConfigType)
  {
    await jsonfile.writeFile(this.configFile, newConfig || this.config, { spaces: 2 });
  }

  /* Create the initial config data */
  static async init()
  {
    await this.read();
    await this.write();
  }

  static async get(): Promise<ConfigType>
  {
    await this.read();
    return this.config;
  }
};
