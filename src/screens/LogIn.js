import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";

const LogIn = () => {

    // dùng để chuyển trang sử dụng useNavigate của react hook
    const navigate = useNavigate()

    // lưu trữ giá trị chuỗi người dùng nhập vào trong ô input name="username"
    const [username, setUsername] = useState("")
    // lưu trữ giá trị chuỗi người dùng nhập vào trong ô input name="pasword"
    const [password, setPassword] = useState("")

    // xử lý khi người dùng ấn nút Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(username)
            console.log(password)
            // hàm signInWithEmailAndPassword: kiểm tra sự tồn tại của username và password người dùng nhập 
            // có trùng với bất kỳ username, password nào đã đăng ký trong authen.. của fb trước đó không
            await signInWithEmailAndPassword(auth, username, password);
            // chuyển sang trang OlderHome
            navigate('/olders')
        }
        catch (error) {
            console.log(error)
            alert("Sai thông tin đăng nhập")
        }
    }

    return (
        <div className="container">
            <form className="login-main" onSubmit={handleSubmit}>
                <h2 className="login-title">Log In</h2>
                <label for="username" className="login-content"><i>Username: </i></label>
                <input type="text" id="username" name="username" className="login-input" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                <label for="password" className="login-content"><i>Password: </i></label>
                <input type="password" id="password" name="password" className="login-input" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                <button className="btn-submit">Submit</button>
            </form>
        </div>
    )
}
export default LogIn;