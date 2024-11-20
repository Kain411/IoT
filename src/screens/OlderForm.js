import { useEffect, useState } from "react";
import OlderDetails from "./OlderDetails";
import DeviceModel from "../model/DeviceModel";

import { fs } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const OlderForm = ({older, devices}) => {

    const [display, setDisplay] = useState(false)
    const [myDevice, setMyDevice] = useState(new DeviceModel("null", "null"))
    const [heartRateData, setHeartRateData] = useState([]);

    const fetchMagament = async () => {
        try {
        // get tất cả document của collection magament trong firestore
          const query = await getDocs(collection(fs, "magament"));
          const lst = []
    
          query.forEach((doc) => {
              const data = doc.data()
              // kiểm tra xem older hiện tại có đang được gắn với thiết bị nhịp tim nào không
              if (data.idOlder==older.getId()) {
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
            // get thông tin nhịp tim (duy nhất) của older hiện tại
            const query = await getDoc(doc(fs, "result", older.getId()));
        
            const str = query.data().value;
            // vì trong firestore lưu dạng chuỗi nên dùng split để tách chuỗi rồi convert sang number (kiểu số)
            const lst = str.split(",").map(Number);
            setHeartRateData(lst);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        // gọi liên tục fecthResult sau 10ms timer ?? cái này k chắc lắm :>>
        const timer = setTimeout(() => {
            fetchResult()
        }, 10);
    
        return () => clearTimeout(timer);
    }, [])

    return (
        <div>
            <button className="older-container" onClick={() => setDisplay(true)}>
                <img src={older.getAvatar()} className="older-avt" />
                <div className="older-info">
                    <p className="older-content">
                        <b>Name: </b>
                        <i>{older.getName()}</i>
                    </p>
                    <p className="older-content">
                        <b>Age: </b>
                        <i>{older.getAge()}</i>
                    </p>
                    <p className="older-content">
                        <b>Phone: </b>
                        <i>{older.getPhone()}</i>
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
                    <OlderDetails older={older} devices={devices} myDevice={myDevice} />
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