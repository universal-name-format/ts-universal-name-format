import Unf from '../';

describe('Name model test', () => {
  it(`Should return a proper name when 'formattedName' function is called (eastern)`, () => {
    const name = new Unf.Name({
      name: {
        given: '길동',
        family: '홍'
      },
      order: ['family', 'given'],
      encode: 'eastern'
    });

    expect(name.formattedName()).toBe('홍길동');
  });

  it(`Should return a proper name when 'formattedName' function is called (mononym)`, () => {
    const name = new Unf.Name({
      name: 'Mr. Random',
      order: [],
      encode: 'mononym'
    });

    expect(name.formattedName()).toBe('Mr. Random');
  });

  it(`Should return a proper name when 'formattedName' function is called (western)`, () => {
    const name = new Unf.Name({
      name: {
        given: 'John',
        middle: 'Middle',
        family: 'Doe'
      },
      order: ['given', 'middle', 'family'],
      encode: 'western'
    });

    expect(name.formattedName()).toBe('John Middle Doe');
  });

  it('Change the name order and get its source (eastern)', () => {
    const name = new Unf.Name({
      name: {
        given: 'John',
        middle: 'Middle',
        family: 'Doe'
      },
      order: ['given', 'middle', 'family'],
      encode: 'western'
    });
    const source = {
      encode: 'western',
      name: {
        family: 'Doe',
        given: 'John',
        middle: 'Middle'
      },
      order: ['family', 'given']
    };

    name.setOrder(Unf.EASTERN_ORDER);
    expect(name.source()).toEqual(source);
  });

  it('Change the name order and get its source (western)', () => {
    const name = new Unf.Name({
      name: {
        given: 'John',
        middle: 'Middle',
        family: 'Doe'
      },
      order: ['given', 'middle', 'family'],
      encode: 'western'
    });
    const source = {
      encode: 'western',
      name: {
        family: 'Doe',
        given: 'John',
        middle: 'Middle'
      },
      order: ['given', 'middle', 'family']
    };

    name.setOrder(Unf.WESTERN_ORDER);
    expect(name.source()).toEqual(source);
  });

  it('Print western name as other name orders', () => {
    const name = new Unf.Name({
      name: {
        given: 'John',
        middle: 'Middle',
        family: 'Doe'
      },
      order: ['given', 'middle', 'family'],
      encode: 'western'
    });

    expect(name.formattedName()).toBe('John Middle Doe');
    expect(name.formattedName('lexical')).toBe('Doe, John');
    expect(name.formattedName('eastern')).toBe('Doe John');
  });

  it('Print the name as a capitalized family name', () => {
    const name = new Unf.Name({
      name: {
        given: 'John',
        middle: 'Middle',
        family: 'Doe'
      },
      order: ['given', 'middle', 'family'],
      encode: 'western'
    });

    expect(name.capitalFamilyName().formattedName()).toBe('John Middle DOE');
  });

  it('Print the name as a simplified middle name', () => {
    const name = new Unf.Name({
      name: {
        given: 'John',
        middle: 'Middle',
        family: 'Doe'
      },
      order: ['given', 'middle', 'family'],
      encode: 'western'
    });

    expect(name.initialMiddleName().formattedName()).toBe('John M. Doe');
  });

  it('Add honorifics with simplified given name', () => {
    const name = new Unf.Name({
      name: {
        given: 'John',
        middle: 'Middle',
        family: 'Doe'
      },
      order: ['given', 'middle', 'family'],
      encode: 'western'
    });

    expect(name.initialGivenName().prefix('Dr.').fullName()).toBe('Dr. J. Doe');
    expect(name.initialGivenName(true).fullName()).toBe('J. Middle Doe');
  });
});

describe('Migrate to the model from a pure string', () => {
  it('Migrate name to eastern model', () => {
    const targetName = '홍길동';
    const model = {
      encode: 'eastern',
      name: {
        family: '홍',
        given: '길동'
      },
      order: ['family', 'given']
    };

    expect(Unf.easternToName(targetName)).toEqual(model);
  });

  it('Migrate name to mononym model', () => {
    const targetName = 'k4ng';
    const model = {
      encode: 'mononym',
      name: 'k4ng',
      order: []
    };

    expect(Unf.mononymToName(targetName)).toEqual(model);
  });

  it('Migrate name to western model', () => {
    const targetName = 'John Middle Doe';
    const model = {
      encode: 'western',
      name: {
        family: 'Doe',
        given: 'John',
        middle: 'Middle'
      },
      order: ['given', 'middle', 'family']
    };

    expect(Unf.westernToName(targetName)).toEqual(model);
  });
});
