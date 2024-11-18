import { fs } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import OlderModel from "../model/OlderModel";
import ChooseOlder from "./ChooseOlder";


const DeviceForm = ({olders, device}) => {

    const [older, setOlder] = useState(new OlderModel(null))
    const [display, setDisplay] = useState(false)
    const [magamentID, setMagamentID] = useState("")

    const fetchMagament = async () => {
        try {
            const query = await getDocs(collection(fs, 'magament'));

            query.forEach((doc) => {
                const data = doc.data()
                if (data.idDevice === device.getId()) {
                    olders.forEach((item) => {
                        if (data.idOlder === item.getId()) {
                            setOlder(item)
                            setMagamentID(doc.id)
                        }
                    })
                }
            })
        }
        catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchMagament()
        console.log(older)
    }, [])


    return (
        <div>
            <button className="btn-device" onClick={() => setDisplay(true)}>
                <div className="device-sensor">
                    <img src={require("../assets/chip.png")} className="icon-chip-device" />
                    <p className="device-sensor-name">{device.getName()}</p>
                </div>
                <div className="device-older">
                    <span className="device-older-name">
                        <img src={older.getAvatar()} className="img-avt-older" />
                        {older.getName()}
                    </span>
                    <ul className="device-older-info">
                        <li>Age: {older.getAge()}</li>
                        <li>Gender: {older.getGender()}</li>
                        <li>Phone: {older.getPhone()}</li>
                        <li>Address: {older.getAddress()}</li>
                    </ul>
                </div>
            </button>
            {
                display ?
                <div className="details-container">
                    <ChooseOlder olders={olders} device={device} magamentID={magamentID} />
                    <button className="btn-exit" onClick={() => setDisplay(false)}>
                        <img src={require("../assets/delete.png")} className="icon-delete"/>
                    </button>
                </div>
                : null
            }
        </div>
    )
}

export default DeviceForm;
