import { useEffect, useState } from "react";
import HeartRate from "../component/HeartRate";

import { fs, db } from '../utils/firebase';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { ref, onValue } from "firebase/database"

const OlderDetails = ({older, devices, myDevice}) => {

    const [heartRateData, setHeartRateData] = useState([]);
    const [run, setRun] = useState(false)

    // như bên OlderForm
    const fetchResult = async () => {
        try {
            const query = await getDoc(doc(fs, "result", older.getId()));
        
            const str = query.data().value;
            const lst = str.split(",").map(Number);
            setHeartRateData(lst);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {fetchResult()}, [])

    // cập nhật giá trị nhịp tim mới đo được vào firestore: 
    // firestore lưu dạng string nên phải trong code phải convert từ list về string
    // vd: [1, 2, 3] => "1,2,3"
    const updateResult = async (lst) => {
        let str = ""
        lst.forEach(e => {
            str += String(e) + ","
        })
        str = str.substring(0, str.length-1)
        try {
            const docRef = doc(fs, 'result', older.getId());
            await setDoc(docRef, {
                value: str
            });
        } catch (error) {
        }
    }

    // đọc liên tục giá trị mà sensor tim đo được đẩy lên realtime
    const updateRate = () => {
        const dbRef = ref(db, '/nhip_tim_1');
        onValue(dbRef, (snapshot) => {
            const value = snapshot.val();
            if (value && value.bpm && value.bpm!==heartRateData[heartRateData.length-1]) { 
                // lấy 20 giá trị đo gần nhất để lưu vào firestore và vẽ đồ thị
               const lst = heartRateData.slice(-20)
               lst.push(value.bpm)
               // lưu vào firestore
                updateResult(lst)
                // set lại list heartRateData để vẽ đồ thị
                setHeartRateData(lst)
            }
        });
    }

    // hàm này để kiểm tra xem hiện tại older này còn được gắn với thiết bị nhịp tim nào không
    const fetchMagament = async () => {
        try {
            const query = await getDocs(collection(fs, "magament"));
            const lst = []
            setRun(false)
            query.forEach((doc) => {
                const data = doc.data()
                if (data.idOlder==older.getId() && data.idDevice==myDevice.getId() && myDevice.getName()==="sensor 1") {
                    setRun(true)
                }
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    // như bên OlderForm
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchMagament()
        }, 1000);
    
        return () => clearTimeout(timer);
    }, [])

    // gọi 1 lần 2 cái fecth này
    useEffect(() => {
        fetchResult();
        fetchMagament();
    }, []);

    useEffect(() => {
        if (heartRateData.length > 0 && run) {
            updateRate();
        }
    }, [heartRateData]);



    return (
        <div className="details-main">
            <div className="details-user">
                <img src={older.getAvatar()} className="details-user-avatar"/>
                <div className="details-user-info">
                    <ul>
                        <li><b>Name:</b> {older.getName()}</li>
                        <li><b>Age:</b> {older.getAge()}</li>
                        <li><b>Gender:</b> {older.getGender()}</li>
                        <li><b>Phone:</b> {older.getPhone()}</li>
                        <li><b>Address:</b> {older.getAddress()}</li>
                    </ul>
                    <div className="details-realtime">
                        {
                            true ? 
                            <div className="details-realtime-info" style={{color: "green"}}>Moving</div> 
                            : <div className="details-realtime-info" style={{color: "red"}}>Waring</div> 
                        }
                        <div className="details-realtime-info">
                            <img src={require("../assets/heartbeat.png")} className="icon-heart"/>
                            <span>{heartRateData[heartRateData.length-1]}npm</span>
                        </div> 
                    </div>
                </div>
            </div>
            <div className="details-heart-rate">
                <div className="details-sensor">
                    <button className="my-sensor">
                        <img src={require("../assets/chip.png")} className="icon-chip"/>
                        <p className="details-sensor-name">{myDevice.getName()}</p>
                    </button>
                </div>
                <div className="details-chart">
                    <HeartRate heartRateData={heartRateData} />
                </div>
            </div>
        </div>
    )
}

export default OlderDetails;