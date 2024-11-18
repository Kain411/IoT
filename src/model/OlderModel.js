class OlderModel {
    constructor(id, avatar, name, age, gender, phone, address) {
        this._id = id;
        this._avatar = avatar;
        this._name = name;
        this._age = age;
        this._gender = gender;
        this._phone = phone;
        this._address = address;
    }

    getId() {
        return this._id
    }
    
    getAvatar() {
        return this._avatar
    }

    getName() {
        return this._name
    }

    getAge() {
        return this._age
    }

    getGender() {
        return this._gender
    }

    getPhone() {
        return this._phone
    }

    getAddress() {
        return this._address
    }

}

export default OlderModel;