import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaCheck } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNewPass } from '../api/auth';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Spinner from 'react-bootstrap/Spinner';

function NewPassword() {
    const navigate = useNavigate()
    const [searchParams]=useSearchParams()
    const [show, setShow] = useState(false)


    const schema = yup.object().shape({
        password: yup.string().min(8).max(32).matches(/^.*(?=.{6,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/, "Password must contain at least 6 characters, one uppercase, one number and one special case character"),
        confirmPassword: yup.string().required()
            .oneOf([yup.ref('password'), null], 'Passwords must match')
    });

    const { mutate, isSuccess, error, isLoading,data } = useNewPass()
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });


    if (isSuccess) {
        console.log(data.data.sMessage)
        console.log("Success")
        navigate("/login")
    }
    const handlesubmit = (data) => {
        console.log(data)
        mutate(data)
        setShow(true)
    }
console.log(data)
console.log(error)
localStorage.setItem("token",searchParams.get('token'))
    return (
        <div className='p-4'>
            <Container>
                <Row>
                    <Col><FaArrowLeft className='back_arrow' size={25} onClick={() => navigate("/login")} /></Col>
                    <Col className='text-end'><FaCheck className='back_arrow' size={25} /></Col>
                </Row>
            </Container>
            <div className='my-4'>
                <h5>Create a new password for your Splitwise account</h5>
                <Form onSubmit={handleSubmit(handlesubmit)}>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>New password</Form.Label>
                        <Form.Control type="text" placeholder="New password" {...register("password")} />
                    </Form.Group>
                    <p className='err_msg'>{errors.password?.message}</p>
                    <Form.Group className="mb-3" controlId="formBasicComfirmPassword">
                        <Form.Label>Confirm password</Form.Label>
                        <Form.Control type="text" placeholder="Confirm Password" {...register("confirmPassword")} />
                    </Form.Group>
                    <p className='err_msg'>{errors.confirmPassword?.message}</p>
                    <Button type="submit" className='px-4 py-2 done_button'>Done {isLoading ? <Spinner animation="border" size="sm" /> : null}</Button>
                </Form>
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

export default NewPassword