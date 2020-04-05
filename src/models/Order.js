export class Order {
    constructor() {
      this._id = null;
      this.id = null;
      this.items = [];
      this.orderedBy = {};
      this.totalPrice = 0;
      this.quantity = 0;
      this.createdAt = null;
      this.updatedAt = null;
    }
}