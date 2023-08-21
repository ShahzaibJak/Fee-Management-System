import { useState } from 'react';
import { auth, provider } from '../../config/firebase';
import './login.css'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';

export function Login() {

    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleEmailChange = (event:any) =>{
        setEmail(event.target.value)
    }

    const handlePasswordChange = (event:any) =>{
        setPassword(event.target.value)
    }

    const signInWithGoogle = async (event:any) => {
        event.preventDefault()
        if(email === "" || password === ""){
            return;
        }
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log(result)
        navigate('/')
    }
    return (
        <div>
            <h3>Login to Conitnue</h3>
            <form className='search-form' onSubmit={signInWithGoogle}>
                <input type="email" value={email} onChange={handleEmailChange} name="email" id="email" placeholder='Email' required />
                <input type="password" value={password} onChange={handlePasswordChange} name="password" id="password" placeholder='Password' required />
                <input type='submit' value="Sign In" />
            </form>
        </div>
    )
}