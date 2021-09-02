import { Command } from 'comtroller';

import { updatePoints } from '../actions/updatePoints';

export const setpoints: Command =
{
  name: 'setpoints',
  run: ({ message, params }) => updatePoints({ message, params }),
};
