import React from 'react'
import { useNavigate } from 'react-router-dom'
import img from "../assets/images/logo.png"
import Button from 'react-bootstrap/Button';
import { FaGoogle } from "react-icons/fa";


function Home() {
    const navigate = useNavigate()
    return (
        <>
            <div className='img_div'>
                <div className='main_logo'>
                    <img className='splitwise_img' src={img} alt="main_logo" />
                    <p className='main_heading'> Splitwise</p>
                </div>
            </div>
            <div className='d-grid gap-2 p-4'>
                <Button className="sign_up  my-2 p-2" onClick={() => navigate("sign-up")}>
                    Sign up
                </Button>
                <Button className="log_in my-2 p-2" onClick={() => navigate("login")}>
                    Login
                </Button>
                <Button className="log_in my-2 p-2" size="">
                    <FaGoogle />  Sign in with Google
                </Button>
            </div>
            <div className='text-center'>
                <a className='links' href="#/">Terms</a> | <a className='links' href="#/">Privacy Policy</a> | <a className='links' href="#/">Contact us</a>
            </div>
        </>

    )
}

export default Home