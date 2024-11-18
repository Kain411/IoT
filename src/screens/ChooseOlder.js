import { useState } from "react";
import DeviceUpdate from "./DeviceUpdate";

const ChooseOlder = ({olders, device, magamentID}) => {

    const [contentSearch, setContentSearch] = useState("")

    return (
        <div className="details-main choose-container">
            <div className='search choose-older-search'>
                <input 
                    type='text' 
                    value={contentSearch}
                    onChange={(e) => {
                        setContentSearch(e.target.value)
                    }}
                    placeholder='Search...' 
                    className='input-search'/>
                <button className='btn-search choose-older-btn-search'>
                    <img src={require("../assets/search.png")} className='icon-search'/>
                </button>
            </div>

            <div className="choose-main">
                    {
                        olders.map((older) => {
                            return (
                                <DeviceUpdate key={older.getId()} older={older} device={device} magamentID={magamentID} />
                            )
                        })
                    }
            </div>
        </div>
    )
}

export default ChooseOlder;