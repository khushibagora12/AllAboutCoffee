import { useNavigate } from "react-router-dom"
import CoffeeButton from "./coffeeButton";
import Header from "./header";

export default function LandingPage() {
    const navigate = useNavigate();
    return (
        <>
            <Header/>
            <div className="hero">
                <video
                    className="bg-video"
                    autoPlay
                    muted
                    playsInline
                >
                    <source src="/bg-animation.mp4" type="video/mp4" />
                </video>

                <div className="overlay" />
                <div className="flex justify-center items-center h-screen">
                    <div className="w-80 sm:w-110">
                        <div className="text-center">
                            <h1 className="text-5xl font-bold fascinate text-[#3D2C22]" >All About Coffee</h1>
                            <p className="playfair text-lg text-[#9a5b39]">Discover nearby cafes, and interact <br/> with new people</p>
                        </div>
                        <div className="text-center mt-5">
                            <CoffeeButton label="SignIn" onClick={() => navigate('/Signin')} />
                            <CoffeeButton label="SignUp" onClick={() => navigate('/Signup')} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}