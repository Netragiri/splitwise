import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/esm/Button';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from "yup";
import { useLogindata } from '../api/auth';
import Spinner from 'react-bootstrap/Spinner';
import { BsArrowLeft } from "react-icons/bs";
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';



function Login() {
  const navigate = useNavigate()
  const [show, setShow] = useState(false);


  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(8).max(32).matches(/^.*(?=.{6,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/, "Password must contain at least 6 characters, one uppercase, one number and one special case character"),
  });

  const { mutate, isSuccess, isError, error, isLoading } = useLogindata()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onLogin = data => {
    console.log(data)
    mutate(data)
    setShow(true)
  }


  useEffect(()=>{
    if (isSuccess) {
      navigate("/group")
    }
  },[isSuccess])
  
  


  return (
    <div className="p-4">
      <BsArrowLeft className='back_arrow' size={30} onClick={() => navigate(-1)} />
      
      <Form onSubmit={handleSubmit(onLogin)} className="my-3">
        <span className='heading'>Welcome back to Splitwise!</span>
        <Form.Group className="mt-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" {...register("email")} />
          <Form.Text className="text-muted">
            <p className='err_msg'>{errors.email?.message}</p>
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter password" {...register("password", { required: true })} />
          <Form.Text className="text-muted">
            <p className='err_msg'>{errors.password?.message}</p>
          </Form.Text>
        </Form.Group>

        <div className='text-center'>
          <Button type="submit" className='px-4 py-2 done_button'>Log in {isLoading ? <Spinner animation="border" size="sm" /> : null}</Button><br />
          <Link to="/reset-password" className='forgot_pass_link'>Forgot Your password?</Link>
        </div>
      </Form>

      {isError ? <ToastContainer className="p-3" position="top-start">
        <Toast onClose={() => setShow(false)} show={show} delay={3000} bg="danger" autohide>
          <Toast.Header closeButton={false}>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Bootstrap</strong>
            <small>11 mins ago</small>
          </Toast.Header>
          <Toast.Body>{error?.response?.data?.sMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
        : null}

    </div>
  )
}

export default Login