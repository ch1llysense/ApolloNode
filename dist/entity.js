export default class Entity {
    constructor(id) {
        this._id = id;
    }
    get id() {
        return this._id;
    }
}
