import * as migration_20260228_060019 from './20260228_060019';
import * as migration_20260228_062335 from './20260228_062335';
import * as migration_20260228_074216_talent_taxonomy_update from './20260228_074216_talent_taxonomy_update';
import * as migration_20260228_081029_add_application_status from './20260228_081029_add_application_status';
import * as migration_20260301_140000_media_alt_localized from './20260301_140000_media_alt_localized';
import * as migration_20260305_151750 from './20260305_151750';
import * as migration_20260306_045204_section_header_fields from './20260306_045204_section_header_fields';

export const migrations = [
  {
    up: migration_20260228_060019.up,
    down: migration_20260228_060019.down,
    name: '20260228_060019',
  },
  {
    up: migration_20260228_062335.up,
    down: migration_20260228_062335.down,
    name: '20260228_062335',
  },
  {
    up: migration_20260228_074216_talent_taxonomy_update.up,
    down: migration_20260228_074216_talent_taxonomy_update.down,
    name: '20260228_074216_talent_taxonomy_update',
  },
  {
    up: migration_20260228_081029_add_application_status.up,
    down: migration_20260228_081029_add_application_status.down,
    name: '20260228_081029_add_application_status',
  },
  {
    up: migration_20260301_140000_media_alt_localized.up,
    down: migration_20260301_140000_media_alt_localized.down,
    name: '20260301_140000_media_alt_localized',
  },
  {
    up: migration_20260305_151750.up,
    down: migration_20260305_151750.down,
    name: '20260305_151750',
  },
  {
    up: migration_20260306_045204_section_header_fields.up,
    down: migration_20260306_045204_section_header_fields.down,
    name: '20260306_045204_section_header_fields'
  },
];
