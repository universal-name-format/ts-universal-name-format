import { Name } from '../models';
import { EASTERN_ORDER, WESTERN_ORDER } from '../constants';

export const easternToName = (name: string) => {
  const nameLeng = name.length;
  const filteredName =
    nameLeng > 2
      ? {
          family: name.slice(0, -2),
          given: name.slice(-2, nameLeng)
        }
      : {
          family: name[0],
          given: name[1]
        };

  return new Name({
    name: filteredName,
    order: EASTERN_ORDER,
    encode: 'eastern'
  });
};

export const mononymToName = (name: string) => {
  return new Name({
    name,
    order: [],
    encode: 'mononym'
  });
};

export const westernToName = (name: string) => {
  const splittedName = name.split(' ');
  const filteredName =
    splittedName.length === 2
      ? {
          given: splittedName[0],
          family: splittedName[1]
        }
      : {
          given: splittedName[0],
          middle: splittedName[1],
          family: splittedName[2]
        };

  return new Name({
    name: filteredName,
    order: WESTERN_ORDER,
    encode: 'western'
  });
};
