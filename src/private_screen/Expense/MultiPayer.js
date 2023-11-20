import React, { useContext, useEffect, useState } from 'react'
import { Col,Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { SearchContext } from '../../Context/Add-expenseContext';
import { BiArrowBack } from "react-icons/bi";
import { MdOutlineDone } from "react-icons/md";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import AdjustAmount from '../../SharedComponent/AdjustAmount';

function MultiPayer() {
    const navigate = useNavigate()
    const param=useParams()
    const { groupdetails, expenseDet, paidByDet } = useContext(SearchContext)
    const stateGroupDetail = groupdetails[0];
    const [value, setValue] = useState([])
    const det = expenseDet[0]
    const [show, setShow] = useState(false)
    const error = "The per person amount not match with total amount"
    const loginUser = JSON.parse(localStorage.getItem("loginDetails"))
    const payers = paidByDet[0]
    const [nonGrpPaidAmnt, setNonGrpPaidAmnt] = useState(payers.length > 0 ? payers?.find(item => item.id === stateGroupDetail.id)?.amount : "")
    const [loginPaidAmnt, setLoginPaidAmnt] = useState(payers.length > 0 ? payers?.find(item => item.id === loginUser._id)?.amount : "")
    const [total, setTotal] = useState(payers.length > 0 ? payers.reduce(function (prev, current) {
        return prev + +current.amount
    }, 0) : 0)

    console.log(stateGroupDetail)
    console.log(payers)

console.log(nonGrpPaidAmnt,loginPaidAmnt)
console.log(value)
    const handleamount = (e, index) => {
        console.log("func called")
        let data = [...value]
        data[index][e.target.name] = e.target.value;
        setValue(data)
        setTotal(value.reduce(function (prev, current) {
            return prev + +current.amount
        }, 0))
    }

    useEffect(() => {
        console.log("called")
         if (payers.length > 0) {
            console.log("hsdfghs")
            setValue(payers)
        }
        else if (stateGroupDetail?.aGroups) {
            console.log("fhsfhj")
            stateGroupDetail?.aGroups?.map((i) =>
                setValue(currentArray => [...currentArray, {
                    "id": i._id,
                    "amount": 0
                }]))

        }
        else if (stateGroupDetail?.name) {
            console.log("dgfjsfgjsjhfjsfhjs")
            setValue([{
                "id": stateGroupDetail.id,
                "amount": 0
            },
            {
                "id": loginUser._id,
                "amount": 0
            }
            ])
        }
    }, [])

    const submithandler = () => {
        console.log("hi")
        if (total !== +det.amount) {
            setShow(true)
        }
        else {
            if(param.expid){
                navigate(`/exp/${param.expid}/edit`, { state: { paidByMember: value } })
            }
            else{
                navigate("/add-expense", { state: { paidByMember: value } })
            }
        }
    }

    // console.log(value)
    // console.log(expenseDet)
    // console.log(det)
    console.log(nonGrpPaidAmnt,loginPaidAmnt)
    return (
        <>
            <div className='p-3'>
                <Row>
                    <Col xs={2} className='text-start'><BiArrowBack size={30} onClick={() => navigate(-1)} /></Col>
                    <Col xs={8} className='text-start fs-4'>Enter paid amounts</Col>
                    <Col xs={2} className='text-end'><button type="submit" className='add_new_grp'><MdOutlineDone size={30} onClick={submithandler} /></button>
                    </Col>
                </Row>

               <AdjustAmount stateGroupDetail={stateGroupDetail} handleamount={handleamount} nonGrpPaidAmnt={nonGrpPaidAmnt} setNonGrpPaidAmnt={setNonGrpPaidAmnt} loginUser={loginUser} loginPaidAmnt={loginPaidAmnt} setLoginPaidAmnt={setLoginPaidAmnt} total={total} det={det} payers={payers}     />
              
            </div>


            <ToastContainer className="p-3" position="top-start">
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
                    <Toast.Body>{error}</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    )
}

export default MultiPayer