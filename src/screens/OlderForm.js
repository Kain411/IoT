import { useEffect, useState } from "react";
import OlderDetails from "./OlderDetails";
import DeviceModel from "../model/DeviceModel";

import { fs } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const OlderForm = ({user, devices}) => {

    const [display, setDisplay] = useState(false)
    const [myDevice, setMyDevice] = useState(new DeviceModel("null", "null"))
    const [heartRateData, setHeartRateData] = useState([]);

    const fetchMagament = async () => {
        try {
          const query = await getDocs(collection(fs, "magament"));
          const lst = []
    
          query.forEach((doc) => {
              const data = doc.data()
              if (data.idOlder==user.getId()) {
                devices.forEach(e => {
                    if (e.getId() == data.idDevice) {
                        setMyDevice(e)
                    }
                })
              }
          })
        }
        catch (error) {
            console.log(error)
        }
    }
    fetchMagament();

    const fetchResult = async () => {
        try {
            const query = await getDoc(doc(fs, "result", user.getId()));
        
            const str = query.data().value;
            const lst = str.split(",").map(Number);
            setHeartRateData(lst);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchResult()
        }, 10);
    
        return () => clearTimeout(timer);
    }, [])

    return (
        <div>
            <button className="older-container" onClick={() => setDisplay(true)}>
                <img src={user.getAvatar()} className="older-avt" />
                <div className="older-info">
                    <p className="older-content">
                        <b>Name: </b>
                        <i>{user.getName()}</i>
                    </p>
                    <p className="older-content">
                        <b>Age: </b>
                        <i>{user.getAge()}</i>
                    </p>
                    <p className="older-content">
                        <b>Phone: </b>
                        <i>{user.getPhone()}</i>
                    </p>
                    <p className="older-status">----- Status -----</p>
                    <div className="older-realtime">
                        {
                            true ?
                            <div className="older-moving">
                                <p className="older-chip-name">{myDevice.getName()}</p>
                            </div>
                            : null
                        }
                        <span className="older-heart-rate">{heartRateData[heartRateData.length-1]} bpm</span>
                    </div>
                </div>
            </button>
            {
                display ? 
                <div className="details-container">
                    <OlderDetails user={user} devices={devices} myDevice={myDevice} />
                    <button className="btn-exit" onClick={() => setDisplay(false)}>
                        <img src={require("../assets/delete.png")} className="icon-delete"/>
                    </button>
                </div>
                : null

            }
            
        </div>
    )
}

export default OlderForm;