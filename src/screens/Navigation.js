import { BrowserRouter, Routes, Route } from "react-router-dom"
import LogIn from "./LogIn"
import OlderHome from "./OlderHome"
import DeviceHome from "./DeviceHome";

const Navigation = ({olders, devices}) => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LogIn />} index/>
                <Route path="/olders" element={<OlderHome olders={olders} devices={devices} />} index/>
                <Route path="/devices" element={<DeviceHome olders={olders} devices={devices} />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Navigation;