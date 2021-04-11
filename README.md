# UNF: Universal Name Format

## Installation

### npm
```
npm install @universal-name-format/universal-name-format
```

### yarn
```
yarn add @universal-name-format/universal-name-format
```

## Examples and Common Usages

### Create the model from UNF JSON source

```typescript
import { Name } from '@universal-name-format/universal-name-format';

// Eastern name

const me = new Name({
  name: {
    given: '길동',
    family: '홍'
  },
  order: ['family', 'given'],
  encode: 'eastern'
});

me.formattedName(); // '홍길동'

// Mononym

import { Name } from '@universal-name-format/universal-name-format';

const me = new Name({
  name: 'Mr. Random',
  order: [],
  encode: 'mononym'
});

me.formattedName(); // 'Mr. Random'

// Western name

import { Name } from '@universal-name-format/universal-name-format';

const me = new Name({
  name: {
    given: 'John',
    middle: 'Middle',
    family: 'Doe'
  },
  order: ['given', 'middle', 'family'],
  encode: 'western'
});

me.formattedName(); // 'John Middle Doe'
```

### Migrate to the model from a pure string

```typescript
import {
  easternToName,
  mononymToName,
  westernToName
} from '@universal-name-format/universal-name-format';

// From an eastern name

const targetString = '홍길동';
const me = easternToName(targetString);

// From a mononym

const targetString = 'k4ng';
const me = mononymToName(targetString);

// From a western name

const targetString = 'John Middle Doe';
const me = westernToName(targetString);
```

### Change the name order and get its source

```typescript
import { Name, EASTERN_ORDER } from '@universal-name-format/universal-name-format';

const me = new Name({
  name: {
    given: 'John',
    middle: 'Middle',
    family: 'Doe'
  },
  order: ['given', 'middle', 'family'],
  encode: 'western'
});

me.setOrder(EASTERN_ORDER); // ['family', 'given']
me.source();
// { name: { given: 'John', middle: ...
```

### Print western name as other name orders

```typescript
import { Name } from '@universal-name-format/universal-name-format';

const me = new Name({
  name: {
    given: 'John',
    middle: 'Middle',
    family: 'Doe'
  },
  order: ['given', 'middle', 'family'],
  encode: 'western'
});

me.formattedName(); // 'John Middle Doe'
me.formattedName('lexical'); // 'Doe, John'
me.formattedName('eastern'); // 'Doe John'
```

### Print the name as a capitalized family name

```typescript
import { Name } from '@universal-name-format/universal-name-format';

const me = new Name({
  name: {
    given: 'John',
    middle: 'Middle',
    family: 'Doe'
  },
  order: ['given', 'middle', 'family'],
  encode: 'western'
});

me.capitalFamilyName().formattedName(); // 'John Middle DOE'
```

### Print the name as a simplified middle name

```typescript
import { Name } from '@universal-name-format/universal-name-format';

const me = new Name({
  name: {
    given: 'John',
    middle: 'Middle',
    family: 'Doe'
  },
  order: ['given', 'middle', 'family'],
  encode: 'western'
});

me.initialMiddleName().formattedName(); // 'John M. Doe'
```

### Add honorifics with simplified given name

```typescript
import { Name } from '@universal-name-format/universal-name-format';

const me = new Name({
  name: {
    given: 'John',
    middle: 'Middle',
    family: 'Doe'
  },
  order: ['given', 'middle', 'family'],
  encode: 'western'
});

me.initialGivenName().prefix('Dr.').fullName(); // 'Dr. J. Doe'
me.initialGivenName(true).fullName(); // 'J. Middle Doe'
```
