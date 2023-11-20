import React from 'react'
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function ToastMessage({isError,error,show,setShow,isSuccess,data}) {
  return (
    <>
    {isError || isSuccess ? <ToastContainer className="p-3" position="top-start">
        <Toast onClose={() => setShow(false)} show={show} delay={3000} bg={isError ?  "danger" : 'success'} autohide>
          <Toast.Header closeButton={false}>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Bootstrap</strong>
            <small>11 mins ago</small>
          </Toast.Header>
      <Toast.Body>{isError ? error?.response?.data?.sMessage : data.data.sMessage }</Toast.Body>
        </Toast>
      </ToastContainer>
        : null}
    </>
  )
}

export default ToastMessage