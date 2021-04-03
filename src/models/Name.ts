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
  private _name: NameType;
  private _order: OrderType = [];
  private _encode: EncodeType = 'western';

  constructor(source: Source) {
    this._name = source.name;
    this._order = source.order;
    this._encode = source.encode;
  }

  public static isValidName(name: NameType) {
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

  public static isValidOrder(order: OrderType) {
    if (!Array.isArray(order)) {
      return false;
    }

    return order.every(o => PLACEHOLDERS[o]);
  }

  public name(order?: string) {
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

      return clone.name();
    } else if (order === 'lexical') {
      return [this.getName('family'), ', ', this.getName('given')].join('');
    } else if (order === 'western' || order === 'given-first') {
      const clone = cloneDeep(this);
      clone.setOrder(WESTERN_ORDER);

      return clone.name();
    }

    orders.forEach(order => {
      if (this._name[order] && this.getName(order)) {
        orderedNames.push(this.getName(order));
      }
    });

    const space = this.getSpace();

    return orderedNames.join(space);
  }

  public fullName() {
    const prefix = this.getName('prefix');
    const suffix = this.getName('suffix');

    return `${prefix + prefix ? ' ' : ''}${this.name()}${' ' + suffix || ''}`;
  }

  public getName(placeholder?: string) {
    if (placeholder) {
      return this._name[placeholder];
    }

    return this._name;
  }

  private setName(name: string, placeholder?: string) {
    if (this.isMononym()) {
      return;
    }

    if (!Name.isValidName(name)) {
      return false;
    }

    if (placeholder) {
      this._name[placeholder] = name;
    }
  }

  public getOrder() {
    return this._order;
  }

  private setOrder(order: OrderType) {
    if (this.isMononym()) {
      return;
    }

    if (!Name.isValidOrder(order)) {
      return false;
    }

    this._order = order;
  }

  public getEncode() {
    return this._encode;
  }

  private setEncode(encode: EncodeType) {
    if (this.isMononym()) {
      return;
    }

    this._encode = encode;
  }

  public capitalFamilyName() {
    if (this.isMononym() || this.getEncode() === 'eastern') {
      return this;
    }

    const clone = cloneDeep(this);
    clone.setName(clone.getName('family').toUpperCase(), 'family');

    return clone;
  }

  public initialGivenName(isIncludingMiddle?: boolean) {
    if (this.isMononym() || this.getEncode() === 'eastern') {
      return this;
    }

    const clone = cloneDeep(this);
    const initializedName = `${clone.getName('given')[0]}.`;
    clone.setName(initializedName, 'given');

    if (!isIncludingMiddle && this.getName('middle')) {
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
