import { Link, useNavigate } from "react-router-dom";
import DeviceForm from "./DeviceForm";
import { useState } from "react";

const DeviceHome = ({olders, devices}) => {

    const navigate = useNavigate()

    const [contentSearch, setContentSearch] = useState("")

    return (
        <div className="container">
            <button className="btn-back" onClick={() => navigate("/olders")}>
                <img src={require("../assets/back.png")} className="icon-back" />
            </button>

            <div className="devices-header">
                Devices
            </div>

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

            <div className="main">
                {
                    devices.map((device) => {
                        if (contentSearch==="" || device.getName().toLowerCase().includes(contentSearch.toLowerCase())) {
                            return (
                                <DeviceForm key={device.getId()} olders={olders} device={device} />
                            )
                        }
                    })
                }
            </div>
        </div>
    )
}

export default DeviceHome;