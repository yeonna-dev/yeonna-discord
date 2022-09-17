import { updatePoints } from 'src/actions/updatePoints';
import { isDeveloperOnly } from 'src/guards/isDeveloper';
import { YeonnaCommand } from 'src/types';

export const setpoints: YeonnaCommand =
{
  name: 'setpoints',
  guards: [isDeveloperOnly],
  run: ({ discord, params, config }) => updatePoints({ discord, params, config }),
};
