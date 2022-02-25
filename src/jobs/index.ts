import { RewardMostCollectibles } from './rewardMostCollectibles';

import { Client } from 'discord.js';

export function startJobs(client: Client)
{
  RewardMostCollectibles.start(client);
}
