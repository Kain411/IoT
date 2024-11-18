import { useEffect, useState } from 'react';
import { db } from "../utils/firebase"
import { ref, onValue } from "firebase/database"

import { Link, useNavigate } from 'react-router-dom';
import OlderForm from './OlderForm';

const OlderHome = ({olders, devices}) => {

    const navigate = useNavigate()

    const [username, setUsername] = useState("Tzei Kain")
    const [contentSearch, setContentSearch] = useState("")
    const [temperature, setTemperature] = useState(25)
    const [humidity, setHumidity] = useState(80)
    const [motion, setMotion] = useState(1)

    useEffect(() => {
        const dbRef = ref(db, '/sensor_in_room');
        onValue(dbRef, (sn) => {
            const value = sn.val();
            setTemperature(value["temperature"])
            setHumidity(value["humidity"])
            setMotion(value["motion"])

        });
    }, [])

    return (
        <div className="container">
            <div className='header'>
                <p className='user'>Welcome: {username}</p>
                <div>
                    <button className='sign' onClick={() => navigate("/devices")}>Devices</button>
                    <button className='sign' onClick={() => navigate("/")}>Sign out</button>
                </div>
            </div>

            <div className='parameter'>
                <div className='parameter-details'>
                    <img src={require("../assets/temperature.png")} className='icon-temperature'/>
                    {temperature}
                    <img src={require("../assets/celsius.png")} className='icon-celsius'/>
                </div>
                <hr/>
                <div className='parameter-details'>
                    <img src={require("../assets/humidity.png")} className='icon-humidity'/>
                    {humidity} %
                </div>
            </div>

            {
                motion==1 ? 
                <ul className='motion'>
                    <li className='motion-on'>Moving</li>
                </ul>
                :
                <ul className='motion'>
                    <li className='motion-off'>Warning</li>
                </ul>
            }

            <div className='search'>
                <input 
                    type='text' 
                    value={contentSearch}
                    onChange={(e) => {
                        setContentSearch(e.target.value)
                    }}
                    placeholder='Search...' 
                    className='input-search'/>
                <button className='btn-search'>
                    <img src={require("../assets/search.png")} className='icon-search'/>
                </button>
            </div>

            <div className='main'>
                {
                    olders.map((older) => {

                        if (contentSearch==="" || older.getName().toLowerCase().includes(contentSearch.toLowerCase())) {
                            return (
                                <OlderForm key={older.getId()} user={older} devices={devices} />
                            )
                        }
                    })
                }
            </div>
        </div>
    );
}

export default OlderHome;