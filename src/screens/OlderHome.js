import { useEffect, useState } from 'react';
import { db } from "../utils/firebase"
import { ref, onValue } from "firebase/database"

import { Link, useNavigate } from 'react-router-dom';
import OlderForm from './OlderForm';

const OlderHome = ({olders, devices}) => {

    const navigate = useNavigate()

    const [username, setUsername] = useState("Tzei Kain")
    const [contentSearch, setContentSearch] = useState("")

    // lưu trữ lần lượt giá trị của: temperature, humidity, motion
    const [temperature, setTemperature] = useState(25)
    const [humidity, setHumidity] = useState(80)
    const [motion, setMotion] = useState(1)

    // liên tục lấy dự liệu của sensor_in_room trong realtime của fb sau mỗi 1000ms
    useEffect(() => {
        const dbRef = ref(db, '/sensor_in_room');
        onValue(dbRef, (sn) => {
            const value = sn.val();
            setTemperature(value["temperature"])
            setHumidity(value["humidity"])
            setMotion(value["motion"])

        });
    }, [10])

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
                // toán tử 2 ngôi:
                // vd: x>1 ? console.log("Correct") : console.log("Incorrect")
                // x=2: -> in "Correct"
                // x=0: -> in "Incorrect"
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

                        // kiểm tra xem nội dung người dùng nhập vào tìm kiếm có khớp với tên của bất cứ older nào không
                        if (contentSearch==="" || older.getName().toLowerCase().includes(contentSearch.toLowerCase())) {
                            return (
                                <OlderForm key={older.getId()} older={older} devices={devices} />
                            )
                        }
                    })
                }
            </div>
        </div>
    );
}

export default OlderHome;