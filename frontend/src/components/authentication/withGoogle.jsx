import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export default function AuthWithGoogle() {
    const [user, setUser] = useState([])
    const [profile, setProfile] = useState([])
    const navigate = useNavigate();

    const google_auth = async(credentialResponse) => {
        const user_res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/routes/auth/google_auth`, {
            credential: credentialResponse.credential,
            client_id: credentialResponse.clientId
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        );
        
        if (user_res.data.message === "Logged in successfully") {
            localStorage.setItem('token', user_res.data.token);
            localStorage.setItem('userId', user_res.data.userId);
            localStorage.setItem('username', user_res.data.username);

            toast(user_res.data.message);

            setTimeout(() => {
                navigate('/cafeData');
            }, 1000);
        }
        else if (user_res.data.message === 'User created successfully') {
            toast(user_res.data.message);

            setTimeout(() => {
                navigate('/cafeData');
            }, 1000);
        }
        else {
            toast("something went wrong!")
        }
    }

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
            <GoogleLogin
                onSuccess={credentialResponse => {
                    console.log("credentials: ", credentialResponse);
                    google_auth(credentialResponse)
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
            />
        </GoogleOAuthProvider>
    )
}