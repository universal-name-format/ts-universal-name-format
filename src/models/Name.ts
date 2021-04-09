import cloneDeep from 'lodash.clonedeep';

import { EASTERN_ORDER, WESTERN_ORDER, PLACEHOLDERS } from '../constants';

type NameType = string | Record<string, unknown>;
type OrderType = string[];
type EncodeType = string;

interface Source {
  name: NameType;
  order: OrderType;
  encode: EncodeType;
}

export default class Name {
  private name: NameType;
  private order: OrderType = [];
  private encode: EncodeType = 'western';

  constructor(source: Source) {
    this.name = source.name;
    this.order = source.order;
    this.encode = source.encode;
  }

  public static isNameValid(name: NameType) {
    // Use toString method for clearer type checking.
    if (name?.toString() === '[object Object]') {
      const placholders = Object.keys(name);

      if (!placholders.length) {
        return false;
      }

      return placholders.every(p => PLACEHOLDERS[p]);
    } else if (typeof name === 'string') {
      return !!name;
    }

    return true;
  }

  public static isOrderValid(order: OrderType) {
    if (!Array.isArray(order)) {
      return false;
    }

    return order.every(o => PLACEHOLDERS[o]);
  }

  public source() {
    return {
      name: this.getName(),
      order: this.getOrder(),
      encode: this.getEncode()
    };
  }

  public formattedName(order?: string) {
    if (typeof this.getName() === 'string') {
      return this.getName();
    }

    const orderedNames = [];
    let orders;

    if (!order) {
      orders = this.getOrder();
    } else if (order === 'eastern' || order === 'family-first') {
      const clone = cloneDeep(this);
      clone.setOrder(EASTERN_ORDER);

      return clone.formattedName();
    } else if (order === 'lexical') {
      return [this.getName('family'), ', ', this.getName('given')].join('');
    } else if (order === 'western' || order === 'given-first') {
      const clone = cloneDeep(this);
      clone.setOrder(WESTERN_ORDER);

      return clone.formattedName();
    }

    orders.forEach(order => {
      if (this.name[order] && this.getName(order)) {
        orderedNames.push(this.getName(order));
      }
    });

    const space = this.getSpace();

    return orderedNames.join(space);
  }

  public fullName() {
    const prefix = this.getName('prefix');
    const suffix = this.getName('suffix');

    return `${prefix ? prefix + ' ' : ''}${this.formattedName()}${
      suffix ? ' ' + suffix : ''
    }`;
  }

  public getName(placeholder?: string) {
    if (placeholder) {
      return this.name[placeholder];
    }

    return this.name;
  }

  public setName(name: string, placeholder?: string) {
    if (this.isMononym()) {
      return;
    }

    if (!Name.isNameValid(name)) {
      throw new Error('Error occured');
    }

    if (placeholder) {
      this.name[placeholder] = name;
    } else {
      this.name = name;
    }

    return this;
  }

  public getOrder() {
    return this.order;
  }

  public setOrder(order: OrderType) {
    if (this.isMononym()) {
      return;
    }

    if (!Name.isOrderValid(order)) {
      throw new Error('Error occured');
    }

    this.order = order;

    return this;
  }

  public getEncode() {
    return this.encode;
  }

  public setEncode(encode: EncodeType) {
    if (this.isMononym()) {
      return;
    }

    this.encode = encode;

    return this;
  }

  public capitalFamilyName() {
    if (this.isMononym() || this.getEncode() === 'eastern') {
      return this;
    }

    const clone = cloneDeep(this);
    clone.setName(clone.getName('family').toUpperCase(), 'family');

    return clone;
  }

  public initialGivenName(includeMiddle?: boolean) {
    if (this.isMononym() || this.getEncode() === 'eastern') {
      return this;
    }

    const clone = cloneDeep(this);
    const initializedName = `${clone.getName('given')[0]}.`;
    clone.setName(initializedName, 'given');

    if (!includeMiddle && this.getName('middle')) {
      const middleRemovedOrder = clone
        .getOrder()
        .filter(order => order !== 'middle');

      clone.setOrder(middleRemovedOrder);
    }

    return clone;
  }

  public initialMiddleName() {
    if (
      this.isMononym() ||
      this.getEncode() === 'eastern' ||
      !this.getName('middle')
    ) {
      return this;
    }

    const clone = cloneDeep(this);
    const initializedName = `${clone.getName('middle')[0]}.`;
    clone.setName(initializedName, 'middle');

    return clone;
  }

  public prefix(customPrefix: string) {
    const clone = cloneDeep(this);
    clone.setName(customPrefix, 'prefix');

    return clone;
  }

  public suffix(customSuffix: string) {
    const clone = cloneDeep(this);
    clone.setName(customSuffix, 'suffix');

    return clone;
  }

  private isMononym() {
    return typeof this.getName() === 'string' && !this.getOrder().length;
  }

  private getSpace() {
    return this.getEncode() === 'western' ? ' ' : '';
  }
}
