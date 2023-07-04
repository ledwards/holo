import Field from '../models/Field';
import { ARRAY_COMPARATORS, STRING_COMPARATORS, NUMERIC_COMPARATORS } from './comparators';

const FIELDS = [
  new Field('ability', NUMERIC_COMPARATORS, ['a', 'ab']),
  new Field('armor', NUMERIC_COMPARATORS, ['arm']),
  new Field('darksideicons', NUMERIC_COMPARATORS, ['dark side icons', 'ds icons', 'dsicons', 'dsi']),
  new Field('deploy', NUMERIC_COMPARATORS, ['d', 'dep']),
  new Field('destiny', NUMERIC_COMPARATORS, ['dest', 'des', 'destiny number', 'destiny value']),
  new Field('ferocity', NUMERIC_COMPARATORS, ['fer']),
  new Field('forfeit', NUMERIC_COMPARATORS, ['ff']),
  new Field('hyperspeed', NUMERIC_COMPARATORS, ['hs']),
  new Field('landspeed', NUMERIC_COMPARATORS, ['ls']),
  new Field('lightsideicons', NUMERIC_COMPARATORS, ['light side icons', 'ls icons', 'lsicons', 'lsi']),
  new Field('maneuver', NUMERIC_COMPARATORS, ['man']),
  new Field('parsec', NUMERIC_COMPARATORS, ['parsec number', 'par']),
  new Field('politics', NUMERIC_COMPARATORS, ['pol']),
  new Field('power', NUMERIC_COMPARATORS, ['p', 'pow', 'pwr']),

  new Field('extraText', STRING_COMPARATORS, ['extratext', 'extra text']),
  new Field('gametext', STRING_COMPARATORS, ['game text']),
  new Field('lore', STRING_COMPARATORS, ['l']),
  new Field('title', STRING_COMPARATORS, ['t']),
  new Field('type', STRING_COMPARATORS, []),

  // canceledBy - is canceled by Y
  // cancels - cancels Y
  // counterpart - [Dark/Light] counterpart to Y
  // matching - matches Y
  // matchingWeapon - matches Y / matching weapon Y
  // pulledBy - is pulled by Y
  // pulls - pulls Y
  // underlyingCardFor

  new Field('characteristics', ARRAY_COMPARATORS, ['characteristic']),
  new Field('icons', ARRAY_COMPARATORS, ['i']),
  new Field('rarity', STRING_COMPARATORS, ['r']),
  new Field('set', STRING_COMPARATORS, []),
  new Field('side', STRING_COMPARATORS, []),
  new Field('subtype', STRING_COMPARATORS, ['sub-type']),
  new Field('uniqueness', STRING_COMPARATORS, []),
];

export default FIELDS;
