class MagamentModel {
    constructor(idOlder, idDevice) {
        this._idOlder = idOlder
        this._idDevice = idDevice
    }

    getIdOlder() {
        return this._idOlder
    }

    getIdDevice() {
        return this._idDevice;
    }
}

export default MagamentModel;