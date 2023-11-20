import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from 'react-router-dom';
import "../assets/css/sign_up.css"
import img from "../assets/images/splitwiseImg.jpeg"
import { useAdduserdata } from '../api/auth';
import Button from 'react-bootstrap/esm/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function Signup() {
    const navigate = useNavigate()
    const [show, setShow] = useState(false);


    const { mutate, isSuccess, isError, error, data, isLoading } = useAdduserdata()
    const schema = yup.object().shape({
        full_name: yup.string().required("Full-name is required field").matches(/^[A-Za-z0-9 ]+$/, "invalid Full_name"),
        email: yup.string().email().required(),
        password: yup.string().min(8).max(32).matches(/^.*(?=.{6,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/, "Password must contain at least 6 characters, one uppercase, one number and one special case character"),
    });
    // console.log(useAdduserdata())
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = data => {
        console.log(data)
        mutate(data)
        setShow(true)
    }

    if (isSuccess) {
        console.log(data.data.sMessage)
        console.log("Success")
        navigate("/",{state:{
            message:data.data.sMessage
        }})
    }
    if (isError) {
        console.log("error")
        console.log(error.response.data.sMessage)
    }

    return (
        <>
            {isSuccess ? <Alert className='m-3' variant="success">
                Register successfully
            </Alert> : null}
            <Form onSubmit={handleSubmit(onSubmit)} className="p-5">
            <img src={img} alt="logo" className='signup_icon' onClick={() => navigate("/")}></img>

            <Form.Group className="mt-3" controlId="formBasicText">
          <Form.Label>Full name</Form.Label>
          <Form.Control type="text" placeholder="Full name" {...register("full_name")}  />
          <Form.Text className="text-muted">
          <p className='err_msg'>{errors.full_name?.message}</p>
          </Form.Text>
        </Form.Group>
        <Form.Group className="mt-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Your email-id" {...register("email")} />
          <Form.Text className="text-muted">
            <p className='err_msg'>{errors.email?.message}</p>
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Your password" {...register("password", { required: true })} />
          <Form.Text className="text-muted">
            <p className='err_msg'>{errors.password?.message}</p>
          </Form.Text>
        </Form.Group>

        <div className='text-center'>
                    <Button type="submit" className='m-2 px-4 py-2 back_button' onClick={() => navigate(-1)}>Back</Button>

                    <Button type="submit" className='m-2 px-4 py-2 done_button'>Done {isLoading ? <Spinner animation="border" size="sm" /> : null}</Button>
                </div>
        </Form>

        {isError ? <ToastContainer className="p-3" position="top-start">
        <Toast onClose={() => setShow(false)} show={show} delay={3000} bg="danger" autohide>
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Message</strong>
          </Toast.Header>
          <Toast.Body>{error.response.data.sMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
        : null}

{/* 
            <form onSubmit={handleSubmit(onSubmit)} className="p-5">
                

                <input type="text"  placeholder="Full name" className="my-4" />
                

                <input type="text"  {...register("email")} placeholder="Your email id" className="my-4" />
                <p className='err_msg'>{errors.email?.message}</p>

                <input type="password" {...register("password", { required: true })} placeholder="Your password" className="my-4" />
                <p className='err_msg'>{errors.password?.message}</p>




                

            </form> */}
        </>
    )
}

export default Signup