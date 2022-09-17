import { updatePoints } from 'src/actions/updatePoints';
import { isDeveloperOnly } from 'src/guards/isDeveloper';
import { YeonnaCommand } from 'src/types';

export const addpoints: YeonnaCommand =
{
  name: 'addpoints',
  guards: [isDeveloperOnly],
  run: ({ discord, params, config }) => updatePoints({ discord, params, add: true, config }),
};
