// abstract class ValueObject {
//   constructor(parameters) {}
//   abstract equals(vo: ValueObject): boolean;
// }
// class Price implements ValueObject {
//   private _amount: number;
//   private _currency: string;
//   constructor(value: number, currency: string) {
//     this._amount = value;
//     this._currency = currency;
//   }
//   get amount(): number {
//     return this._amount;
//   }
//   get currency(): number {
//     return this._currency;
//   }
//   equals(vo: Price): boolean {
//     return this._amount === vo._amount;
//   }
// }
