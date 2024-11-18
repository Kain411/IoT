import { useState } from "react"
import { fs } from "../utils/firebase"
import { doc, setDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

const DeviceUpdate = ({older, device, magamentID}) => {

    const navigate = useNavigate()

    const [display, setDisplay] = useState(false)

    const update = async () => {
        try {
            const query = doc(fs, 'magament', magamentID);
            await setDoc(query, {
                idDevice: device.getId(),
                idOlder: older.getId()
            });
            navigate("/olders")
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <button onClick={() => setDisplay(true)} className="choose-form">
                <img src={older.getAvatar()} className="older-avt" />
                <ul className="device-older-info">
                    <li>Name: {older.getName()}</li>
                    <li>Age: {older.getAge()}</li>
                    <li>Gender: {older.getGender()}</li>
                    <li>Phone: {older.getPhone()}</li>
                </ul>
            </button>
            {
                display ? 
                <div className="details-container update-container">
                    <div className="alert">
                        <h2>Alert</h2>
                        <p className="title">Confirm selection: <i>{older.getName()}</i> !</p>
                        <div className="btn-alert">
                            <button onClick={() => setDisplay(false)} className="btn-cancel">Cancel</button>
                            <button onClick={update} className="btn-confirm">Confirm</button>
                        </div>
                    </div>
                </div>
                : null
            }
        </div>
    )
}

export default DeviceUpdate;