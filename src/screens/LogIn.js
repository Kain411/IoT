import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";

const LogIn = () => {

    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(username)
            console.log(password)
            await signInWithEmailAndPassword(auth, username, password);
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
                <input type="text" id="username" name="username" className="login-input" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <label for="password" className="login-content"><i>Password: </i></label>
                <input type="password" id="password" name="password" className="login-input" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button className="btn-submit">Submit</button>
            </form>
        </div>
    )
}
export default LogIn;