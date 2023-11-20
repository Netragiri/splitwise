import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BsArrowLeft } from "react-icons/bs";
import * as yup from "yup";
import Button from 'react-bootstrap/esm/Button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useResetPass } from '../api/auth';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';




function ResetPassword() {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const { mutate, error, isLoading, data } = useResetPass()

  const schema = yup.object().shape({
    email: yup.string().email().required(),
  });


  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const resethandle = (data) => {
    mutate(data)
    setShow(true)
  }

  return (
    <div className='p-4'>
      <BsArrowLeft className='back_arrow d-inline' size={30} onClick={() => navigate(-1)} /><h5 className='d-inline mx-3'>Reset-password</h5>
      <div className='text-center my-4'>
        <h3>Reset your password</h3>
        <p>Enter your email address or phone number and we'll send you a link to reset your password.</p>
        <div className='my-5'>
          <Form onSubmit={handleSubmit(resethandle)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" {...register("email")} />
            </Form.Group>
            <p className='err_msg'>{errors.email?.message}</p>
            <Button type="submit" className='px-4 py-2 done_button my-2'>Reset password {isLoading ? <Spinner animation="border" size="sm" /> : null}</Button>
          </Form>
        </div>

      </div>
      {error || data ? <ToastContainer className="p-3" position="top-start">
        <Toast onClose={() => setShow(false)} show={show} delay={3000} bg={error ? "danger": data ? "success": ""} autohide>
          <Toast.Header closeButton={false}>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Bootstrap</strong>
            <small>11 mins ago</small>
          </Toast.Header>
          <Toast.Body>{error ? error.response.data.sMessage : data ? data?.data?.sMessage : ""}</Toast.Body>
        </Toast>
      </ToastContainer>
        : null}
    </div>
  )
}

export default ResetPassword