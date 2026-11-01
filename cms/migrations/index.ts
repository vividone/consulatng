import * as migration_20261030_132750_initial from './20261030_132750_initial';
import * as migration_20261101_191812_add_services from './20261101_191812_add_services';

export const migrations = [
  {
    up: migration_20261030_132750_initial.up,
    down: migration_20261030_132750_initial.down,
    name: '20261030_132750_initial',
  },
  {
    up: migration_20261101_191812_add_services.up,
    down: migration_20261101_191812_add_services.down,
    name: '20261101_191812_add_services'
  },
];
