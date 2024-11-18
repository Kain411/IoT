class DeviceModel {
    constructor(id, name) {
        this._id = id
        this._name = name;
    }

    getId() {
        return this._id
    }

    getName() {
        return this._name;
    }
}

export default DeviceModel;