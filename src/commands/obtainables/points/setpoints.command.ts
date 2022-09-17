import { Command } from 'comtroller';
import { updatePoints } from 'src/actions/updatePoints';
import { isDeveloperOnly } from 'src/guards/isDeveloper';

export const setpoints: Command =
{
  name: 'setpoints',
  guards: [isDeveloperOnly],
  run: ({ discord, params, config }) => updatePoints({ discord, params, config }),
};
