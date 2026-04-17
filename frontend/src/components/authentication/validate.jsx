import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { render } from 'react-email';
import { Email } from './emailHtml';

export default function Validate({ user, setUserValidate, setUsername, setEmail, setPassword }) {
    const [number, setNumber] = useState();
    const [randomNumber, setRandomNumber] = useState();

    const random = Math.floor(Math.random() * 100)
    const navigate = useNavigate()

    const sendMail = async () => {
        setRandomNumber('' + random);
        const emailHtml = await render(<Email number={random} />);

        if (user !== null) {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/routes/validateEmail/validate`, {
                number: random,
                their_email: user?.email,
                email: emailHtml
            },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            toast(res.data.message)
        } else {
            toast("something went wrong. refresh")
        }
    }


    const checkNumber = async () => {
        console.log(randomNumber, typeof (randomNumber))
        console.log(number, typeof (number))

        if (randomNumber === number) {
            console.log('matched');
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
                setUsername('')
                setEmail('')
                setPassword('')

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
                <button className="validation-button" onClick={sendMail}>send validation number</button>
                <input className="validation-input" type="number" placeholder="Enter your value" onChange={(e) => setNumber(e.target.value)} />
                <button className="validation-button" onClick={checkNumber}>check</button>
            </div>
            <ToastContainer />
        </>
    )
}