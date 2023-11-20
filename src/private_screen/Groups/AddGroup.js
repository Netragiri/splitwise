import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react'
import { Col, Form, Offcanvas, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { MdClose } from "react-icons/md";
import { MdOutlineDone } from "react-icons/md";
import { MdOutlineHome } from "react-icons/md";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { MdOutlineStickyNote2 } from "react-icons/md";
import { BsSuitHeart } from "react-icons/bs";
import { TbPlane } from "react-icons/tb";
import { useAddGroup } from '../../api/auth';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function AddGroup({ show, handleClose, setShow }) {
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()
    const [radioValue, setRadioValue] = useState('0');
    const [grptype, setGrptype] = useState("")
    const [checked, setChecked] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const radios = [
        { name: 'Trip', value: '1', icon: <TbPlane size={20} className="mt-n1 me-1" /> },
        { name: 'Home', value: '2', icon: <MdOutlineHome size={20} className="mt-n1 me-1 " /> },
        { name: 'Couple', value: '3', icon: <BsSuitHeart size={20} className="me-1" /> },
        { name: 'Other', value: '4', icon: <MdOutlineStickyNote2 size={20} className="me-1" /> },
    ];

    const schema = yup.object().shape({
        groupname: yup.string().required(),
    });

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema)
    });
    // const imagehandler=(e)=>{
    //     console.log(e.target.files)
    //     setImage(URL.createObjectURL(e.target?.files[0]))
    // }


    //queryhook for add group
    const { mutate, error, data, isError, isSuccess } = useAddGroup()
    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append('sGroupName', data?.groupname);
        formData.append('sAvatar', selectedFile);
        formData.append('sType', grptype);
        // formData.append('sType', data?.grptype);
        // formData.append('sAvatar', data?.grpavatar);

        mutate(formData)
        setShowToast(true)
        reset()
        console.log(formData, "formdata")
    }

    if(isSuccess){
        console.log("hii")
    }

    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0])
    }


    //when canvas closed state should be empty
    useEffect(() => {
        setPreview()
        setSelectedFile()
        setRadioValue('0')
        reset()
    }, [show])

    const handleclick = (type) => {
        if (type === grptype) {
            setGrptype("")
            setChecked(false)
        }
        else {
            setGrptype(type)
            setChecked(true)
        }
    }
    // console.log(grptype, "grptype")
    // console.log(checked)
    // console.log(data?.data?.sMessage)
    return (
        <>
            <Offcanvas show={show} onHide={handleClose} placement="bottom">

                <Offcanvas.Body className='m-0 p-0'>
                    <Form onSubmit={handleSubmit(onSubmit)} className="p-3">
                        <Row>
                            <Col className='text-start'><MdClose size={30} onClick={() => setShow(false)} /></Col>
                            <Col> <Offcanvas.Title className='text-center'>Create a group</Offcanvas.Title></Col>
                            <Col className='text-end'><button type="submit" className='add_new_grp'><MdOutlineDone size={30} /></button>
                            </Col>
                        </Row>
                        <Row className='my-3'>
                            <Col xs={3}>
                                <input type="file" onChange={onSelectFile} id="grpimg" hidden />
                                <label htmlFor='grpimg' className='add_img_div'>
                                    {/* <input hidden accept="image/*" multiple type="file" onClick={(e) => handleImage(e)} /> */}
                                    {!selectedFile && <MdOutlineAddAPhoto className="icon_img" size={30} />}
                                    {selectedFile && <img className='grpimg' src={preview} alt="grpimg" />}
                                </label>

                            </Col>
                            <Col xs={9}>
                                <Form.Group className="mt-3" controlId="formBasicEmail">
                                    <Form.Label>Group name</Form.Label>
                                    <Form.Control type="text" placeholder="Group name" {...register("groupname")} />
                                    <Form.Text className="text-muted">
                                        <p className='err_msg'>{errors.groupname?.message}</p>
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                    </Form>

                    <p className='ms-3'>Type</p>
                    <div className='grp_type_scroll'>
                        <ButtonGroup>
                            {radios.map((radio, idx) => (
                                <ToggleButton   
                                    key={idx}
                                    id={`radio-${idx}`}
                                    type="radio"
                                    variant='outline-success'
                                    name="radio"
                                    value={radio.value}
                                    checked={radioValue === radio.value}
                                    onChange={(e) => setRadioValue(e.currentTarget.value)}
                                    onClick={() => handleclick(radio.name)}
                                    className={radioValue === radio.value && checked ? "checked_button_type ms-3" : "unchecked_button_type ms-3 text-center "}
                                >
                                    {radio.icon}{radio.name}
                                </ToggleButton>
                            ))}
                        </ButtonGroup>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            {isError || isSuccess ? <ToastContainer className="p-3" position="top-start">
                <Toast onClose={() => setShowToast(false)} show={showToast} bg={isError ? "danger" : "success"} delay={2000} autohide>
                    <Toast.Header closeButton={false}>
                        <strong className="me-auto">Message</strong>
                    </Toast.Header>
                    <Toast.Body>{isError ? error.response.data.sMessage : data.data.sMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
                : null}
        </>
    )
}

export default AddGroup