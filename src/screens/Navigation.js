import { BrowserRouter, Routes, Route } from "react-router-dom"
import LogIn from "./LogIn"
import OlderHome from "./OlderHome"
import DeviceHome from "./DeviceHome";

const Navigation = ({olders, devices}) => {

    return (
        // chuyển trang
        <BrowserRouter>
            <Routes>
                {/* path "/" chuyển về trang Login */}
                <Route path="/" element={<LogIn />} index/>
                {/* path "/olders" chuyển sang trang OlderHome */}
                <Route path="/olders" element={<OlderHome olders={olders} devices={devices} />} />
                {/* path "/devices" chuyển sang trang DeviceHome */}
                <Route path="/devices" element={<DeviceHome olders={olders} devices={devices} />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Navigation;