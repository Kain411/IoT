import { useState } from 'react';
import './App.css';
import Navigation from './screens/Navigation';

import { fs } from './utils/firebase';
import { collection, getDocs } from 'firebase/firestore';

import OlderModel from "./model/OlderModel";
import DeviceModel from "./model/DeviceModel";

function App() {

  const [olders, setOlders] = useState([])
  const [devices, setDevices] = useState([])

  const fetchOlder = async () => {
      try {
          const lst = []
          const query = await getDocs(collection(fs, "older"));

          query.forEach((doc) => {
              const data = doc.data()
              lst.push(new OlderModel(doc.id, data.avatar, data.name, data.age, data.gender, data.phone, data.address))
          })

          setOlders(lst)
      }
      catch (error) {
          console.log(error)
      }
  };
  fetchOlder();

  const fetchDevice = async () => {
      try {
          const query = await getDocs(collection(fs, "device"));
          const lst = []

          query.forEach((doc) => {
              const data = doc.data()
              lst.push(new DeviceModel(doc.id, data.name))
          })

          setDevices(lst)
      }
      catch (error) {
          console.log(error)
      }
  };
  fetchDevice();

  return (
    <Navigation olders={olders} devices={devices} />
  );
}

export default App;
