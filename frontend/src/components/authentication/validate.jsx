import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { render } from 'react-email';

export default function Validate({ user}) {
    const [number, setNumber] = useState();

    const navigate = useNavigate()

    useEffect(() => {
        const sendMail = async () => {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/routes/validateEmail/checkEmail`, {
                their_email: user?.email,
                number: number
            },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            toast(res.data.message)
        }
        sendMail();
    }, []);

    const checkNumber = async () => {
        // console.log(number, typeof (number))

        const check = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/routes/validateEmail/matchEmail`, {
            their_email: user?.email,
            number : number
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        );

        if (check.data.message === "matched") {
            // console.log('matched');
            const userRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/routes/auth/signup`, {
                username: user?.username,
                email: user?.email,
                password: user?.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            );
            toast(userRes.data.message);
            console.log(userRes);
            if (userRes.data.message === "User created successfully") {
                setTimeout(() => {
                    navigate('/Signin');
                }, 1000);
            } else {
                setUserValidate(false)
            }
        } else {
            toast("Number didn't match. Try again")
        }
    }
    return (
        <>
            <div className="validation-card">
                <h1 className="validation-head">Enter the number we have sent on your mail</h1>
                {/* <button className="validation-button" onClick={sendMail}>send validation number</button> */}
                <input className="validation-input" type="number" placeholder="Enter your value" onChange={(e) => setNumber(e.target.value)} />
                <button className="validation-button" onClick={checkNumber}>check</button>
            </div>
            <ToastContainer />
        </>
    )
}