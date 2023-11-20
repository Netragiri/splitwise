import React, { useContext, useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { MdOutlineDone } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import { SearchContext } from '../../Context/Add-expenseContext';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import AdjustAmount from '../../SharedComponent/AdjustAmount';
import "../../assets/css/add-expense.css"

function AdjustSplit() {
    const navigate = useNavigate()
    const param=useParams()
    const [value, setValue] = useState([])
    const [checked, setChecked] = useState(0)
    const { state,pathname } = useLocation()
    const { groupdetails, splitByDet, expenseDet } = useContext(SearchContext)
    const [show, setShow] = useState(false)
    const stateGroupDetail = groupdetails[0];
    const det = expenseDet[0]
    const [error, setError] = useState("The per person amount not match with total amount")
    // const error = "The per person amount not match with total amount"
    const loginUser = JSON.parse(localStorage.getItem("loginDetails"))
    const [splitMemdet,setSplitMemDet] = splitByDet
    const [nonGrpSplitAmnt, setNonGrpSplitAmnt] = useState(splitMemdet.length > 0 ? splitMemdet?.find(item => item.id === stateGroupDetail.id)?.amount : "")
    const [loginSplitAmnt, setLoginSplitAmnt] = useState(splitMemdet.length > 0 ? splitMemdet?.find(item => item.id === loginUser._id)?.amount : "")
    const [total, setTotal] = useState(splitMemdet.length > 0 ? splitMemdet.reduce(function (prev, current) {
        return prev + +current.amount
    }, 0) : 0)
    const [totalPercent, setTotalPercent] = useState(0)
    const [totalshares, setTotalShares] = useState(0)
    const [checkboxarray, setCheckboxarray] = useState(stateGroupDetail?.aGroupMember?.map(i=>i._id))



    //split by amount
    const handlamount = (e, index) => {
        let data = [...value]
        data[index][e.target.name] = e.target.value;
        setValue(data)
        setTotal(value.reduce(function (prev, current) {
            return prev + +current.amount
        }, 0))
    }

    //split by percentage
    const handlePercentage = (e, index) => {
        let data = [...value]
        data[index][e.target.name] = e.target.value;
        data[index]["amount"] = det.amount * e.target.value / 100;
        setValue(data)
        setTotalPercent(value.reduce(function (prev, current) {
            return prev + +current.percent
        }, 0))
    }

    //split by shares
    const handleShares = (e, index, id) => {
        let data = [...value]
        let selitem = data.find(i => i.id === id);
        //    selitem.amount=+e.target.value*100/(totalshares + +e.target.value);
        selitem.share = +e.target.value
        //    array.push(selitem)
        const newTotalShares = data.reduce(function (prev, current) {
            return prev + +current.share
        }, 0)
        /* let unselitem=data.filter(i=>i.id!==id).map(i=>{
         // return {...i,amount:  +i.share*100/(newTotalShares + +e.target.value)}
         return {...i,amount:  +i.share*100/(newTotalShares)}
        }) */
        //    shares*expenseDet/totalShares
        //    setValue([...unselitem,selitem])
        //    let unselitem=data.filter(i=>i.id!==id)
        const newValue = data.map(i => {
            return { ...i, amount: +i.share * det.amount / newTotalShares }
        })


        setValue(newValue)
        setTotalShares(newTotalShares)
    }

    // console.log(totalshares)
    // console.log(totalPercent, "array")

    useEffect(() => {
        console.log("called")
        if (splitMemdet.length > 0) {
            setValue(splitMemdet)
        }
        else if (stateGroupDetail?.aGroupMember) {
            stateGroupDetail?.aGroupMember?.map((i) =>
                setValue(currentArray => [...currentArray, {
                    "id": i._id,
                    "amount": 0,
                    "percent": 0,
                    "share": 0
                }]))
        }
        else if (stateGroupDetail?.name) {
            setValue([{
                "id": stateGroupDetail.id,
                "amount": 0,
                "percent": 0,
                "share": 0
            },
            {
                "id": loginUser._id,
                "amount": 0,
                "percent": 0,
                "share": 0
            }
            ])
        }
    }, [stateGroupDetail])


    const submithandler = () => {
        console.log("hi")
        if (checked === 0) {
            setSplitMemDet([])
            if(param.expid){
                navigate(`/exp/${param.expid}/edit`, { state: { splittype: "equally" } })
            }
            else{
                navigate("/add-expense", { state: { splittype: "equally" } })
            }
            console.log("equally")
        }
        else if (checked === 1) {
            if (total !== +state.amount) {
                console.log("if called")
                setShow(true)
            }
            else {
                if(param.expid){
                    navigate(`/exp/${param.expid}/edit`, { state: { splitMember: value } })
                }
                else{
                    navigate("/add-expense", { state: { splitMember: value } })
                }
            }
        }
        else if (checked === 2) {
            if (totalPercent < 100) {
                setError(`The per person amounts don't add up to 100%. you are under by ${100 - totalPercent}%`)
                setShow(true)
            }
            else if (totalPercent > 100) {
                setError(`The per person amount don't add up to 100%. you are over by ${-(100 - totalPercent)}%`)
                setShow(true)
            }
            else {
                if(param.expid){
                    navigate(`/exp/${param.expid}/edit`, { state: { splitMember: value } })
                }
                else{
                    navigate("/add-expense", { state: { splitMember: value } })
                }
            }
        }
        else if (checked === 3) {
            if(param.expid){
                navigate(`/exp/${param.expid}/edit`, { state: { splitMember: value } })
            }
            else{
                navigate("/add-expense", { state: { splitMember: value } })
            }
        }
        else {
            if(param.expid){
                navigate(`/exp/${param.expid}/edit`, { state: { splitMember: value } })
            }
            else{
                navigate("/add-expense", { state: { splitMember: value } })
            }
        }
    }

    // console.log(value)
    // console.log(splitMemdet)
    // console.log(nonGrpSplitAmnt, loginSplitAmnt)
    // console.log(det)
    console.log(pathname)
    // console.log(state.amount)
    console.log(stateGroupDetail)
    // console.log(loginUser)


    //extra items array
    const handleCheck = (event, id) => {
        let updatedList = [...checkboxarray];

        if (event.target.checked) {
            updatedList = [...checkboxarray, id];
        } else {
            updatedList.splice(checkboxarray.indexOf(event.target.value), 1);
        }
        setCheckboxarray(updatedList);
    };

    console.log(checkboxarray,"checkboxarray")
    return (
        <div className='p-3 h-100'>
            <Row>
                <Col xs={2} className='text-start'><BiArrowBack size={30} onClick={() => navigate(-1)} /></Col>
                <Col xs={8} className='text-start fs-4'>Adjust  split</Col>
                <Col xs={2} className='text-end'><button type="submit" className='add_new_grp'><MdOutlineDone size={30} onClick={submithandler} /></button>
                </Col>
            </Row>

            <div className='mt-4 scrollmenu'>
                <span className={checked === 0 ? "sel-btn" : "unsel-btn"} onClick={() => setChecked(0)}>Equally</span>
                <span className={checked === 1 ? "sel-btn " : "unsel-btn"} onClick={() => setChecked(1)}>Unequally</span>
                <span className={checked === 2 ? "sel-btn " : "unsel-btn"} onClick={() => setChecked(2)}>By percentages</span>
                <span className={checked === 3 ? "sel-btn " : "unsel-btn"} onClick={() => setChecked(3)}>By shares</span>
            </div>


            {checked === 0 && <>
                <h5 className='text-center mt-3'>Split equally</h5>
                <p className='text-center text-secondary'>Select which person owe an equal share</p>

                <div>
                    {stateGroupDetail?.aGroupMember?.map((member)=>{
                        return <Row className='my-3'>
                            <Col xs={2}><img className='person_img' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${member.sAvatar}`} alt="grpimg"></img></Col>
                            <Col xs={8}>{member.sName}</Col>
                            <Col xs={2}>             
                                            <div className=''>
                                                <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="check1"
                                                name="option1"
                                                value={member._id}
                                                onChange={(e) => handleCheck(e, member._id)}
                                                defaultChecked={checkboxarray.includes(member._id)}
                                            /></div>
                                            
                            </Col>
                        </Row>
                    })}
                </div>
            </>}


            {checked === 1 && <>
                <h5 className='text-center mt-3'>Split by exact amounts</h5>
                <p className='text-center text-secondary'>Specify exactly how much each person owes</p>

                <AdjustAmount stateGroupDetail={stateGroupDetail} total={total} det={det} loginUser={loginUser} splitMemdet={splitMemdet} handleamount={handlamount} nonGrpSplitAmnt={nonGrpSplitAmnt} setNonGrpSplitAmnt={setNonGrpSplitAmnt} loginSplitAmnt={loginSplitAmnt} setLoginSplitAmnt={setLoginSplitAmnt} />
            </>
            }

            {checked === 2 && <>
                <h5 className='text-center mt-3'>Split by exact percentages</h5>
                <p className='text-center text-secondary'>Enter the percentage split that's fair for your situation</p>
                {stateGroupDetail?.aGroupMember?.map((i, index) => {
                    return <div className='px-3' key={i._id} >
                        <Row className='py-3' >
                            <Col xs={2} className="text-end">
                                <img className='grp-frd-icon' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${i.sAvatar}`} alt="grpimg" />
                            </Col>
                            <Col xs={7} className="mt-2">
                                <p className='m-0'>{i.sName}</p>
                                <p className='text-secondary'>${value.find(item => item.id === i._id).amount}</p>
                            </Col>
                            <Col xs={3}>
                                <InputGroup size="sm" className="mb-3">

                                    <Form.Control
                                        aria-label="Small"
                                        aria-describedby="inputGroup-sizing-sm"
                                        placeholder='0.00'
                                        onChange={(e) => handlePercentage(e, index)}
                                        value={splitMemdet.length > 0 ? splitMemdet?.find(item => item.id === i._id).percent : undefined}
                                        name="percent"
                                    />
                                    <InputGroup.Text id="inputGroup-sizing-sm">%</InputGroup.Text>
                                </InputGroup>
                            </Col>
                        </Row>
                    </div>
                })}

                {stateGroupDetail?.name &&
                    <div>
                        <Row className='py-3' >
                            <Col xs={2} className="text-end">
                                <img className='grp-frd-icon' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${stateGroupDetail.avatar}`} alt="grpimg" />
                            </Col>
                            <Col xs={7} className="mt-2">
                                <p>{stateGroupDetail.name}</p>
                                <p>${value[0].amount}</p>
                            </Col>
                            <Col xs={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Text id="inputGroup-sizing-sm">$</InputGroup.Text>
                                    <Form.Control
                                        aria-label="Small"
                                        aria-describedby="inputGroup-sizing-sm"
                                        placeholder='0.00'
                                        value={nonGrpSplitAmnt}
                                        onChange={(e) => {
                                            handlePercentage(e, 0)
                                            setNonGrpSplitAmnt(e.target.value)
                                        }}
                                        name="percent"
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='py-3' >
                            <Col xs={2} className="text-end">
                                <img className='grp-frd-icon' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${loginUser.sAvatar}`} alt="grpimg" />
                            </Col>
                            <Col xs={7} className="mt-2">
                                <p className='m-0'> {loginUser.sName}</p>
                                <p>${value[1].amount}</p>

                            </Col>
                            <Col xs={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Text id="inputGroup-sizing-sm">$</InputGroup.Text>
                                    <Form.Control
                                        aria-label="Small"
                                        aria-describedby="inputGroup-sizing-sm"
                                        placeholder='0.00'
                                        value={loginSplitAmnt}
                                        onChange={(e) => {
                                            handlePercentage(e, 1)
                                            setLoginSplitAmnt(e.target.value)
                                        }}
                                        name="percent"
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                    </div>}


                <div class="fixed-bottom text-center div_bottom">
                    <p className='m-0 fs-5 fw-bold'> {totalPercent} % of  {100}%</p>
                    {100 - totalPercent < 0 ?
                        <span className='text-danger fw-bold'>{-(100 - totalPercent)} % over</span> :
                        <span class="fw-bold">{(100 - totalPercent)}% left</span>}
                </div>


            </>}



            {/*------------- split byShares---------------------- */}

            {checked === 3 && <>
                <h5 className='text-center mt-3'>Split by shares</h5>
                <p className='text-center text-secondary'>Great for time-based splitting (2 nights -- 2 shares) and splitting across families (family of 3 -- 3 shares)</p>
                {stateGroupDetail?.aGroupMember?.map((i, index) => {
                    return <div className='px-3' key={i._id} >
                        <Row className='py-3' >
                            <Col xs={2} className="text-end">
                                <img className='grp-frd-icon' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${i.sAvatar}`} alt="grpimg" />
                            </Col>
                            <Col xs={7} className="mt-2">
                                <p className='m-0'>{i.sName}</p>
                                <p className='text-secondary'>${value.find(item => item.id === i._id)?.amount.toFixed(2)}</p>
                            </Col>
                            <Col xs={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <Form.Control
                                        aria-label="Small"
                                        aria-describedby="inputGroup-sizing-sm"
                                        placeholder='0'
                                        onChange={(e) => handleShares(e, index, i._id)}
                                        value={splitMemdet.length > 0 ? splitMemdet?.find(item => item.id === i._id).percent : undefined}
                                        name="share"
                                    />
                                    <InputGroup.Text id="inputGroup-sizing-sm">shares</InputGroup.Text>
                                </InputGroup>
                            </Col>
                        </Row>
                    </div>
                })}

                {stateGroupDetail?.name &&
                    <div>
                        <Row className='py-3' >
                            <Col xs={2} className="text-end">
                                <img className='grp-frd-icon' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${stateGroupDetail.avatar}`} alt="grpimg" />
                            </Col>
                            <Col xs={7} className="mt-2">
                                <p>{stateGroupDetail.name}</p>
                                <p>${value.find(item => item.id === stateGroupDetail.id)?.amount.toFixed(2)}</p>
                            </Col>
                            <Col xs={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Text id="inputGroup-sizing-sm">$</InputGroup.Text>
                                    <Form.Control
                                        aria-label="Small"
                                        aria-describedby="inputGroup-sizing-sm"
                                        placeholder='0.00'
                                        value={nonGrpSplitAmnt}
                                        onChange={(e) => {
                                            handleShares(e, 0,stateGroupDetail.id)
                                            setNonGrpSplitAmnt(e.target.value)
                                        }}
                                        name="share"
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='py-3' >
                            <Col xs={2} className="text-end">
                                <img className='grp-frd-icon' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${loginUser.sAvatar}`} alt="grpimg" />
                            </Col>
                            <Col xs={7} className="mt-2">
                                <p>{loginUser.sName}</p>
                                <p>${value.find(item => item.id === loginUser._id)?.amount.toFixed(2)}</p>
                                </Col>
                            <Col xs={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Text id="inputGroup-sizing-sm">$</InputGroup.Text>
                                    <Form.Control
                                        aria-label="Small"
                                        aria-describedby="inputGroup-sizing-sm"
                                        placeholder='0.00'
                                        value={loginSplitAmnt}
                                        onChange={(e) => {
                                            handleShares(e, 1,loginUser._id)
                                            setLoginSplitAmnt(e.target.value)
                                        }}
                                        name="share"
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                    </div>}


                <div class="fixed-bottom text-center div_bottom">
                    <p className='m-0 fs-5 fw-bold'>{totalshares} total shares</p>
                </div>


            </>}
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
        </div>

    )
}

export default AdjustSplit

// {stateGroupDetail?.aGroups?.map((i, index) => {
//     return <div className='px-3' key={i._id} >
//         <Row className='py-3' >
//             <Col xs={2} className="text-end">
//                 <img className='grp-frd-icon' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${i.sAvatar}`} alt="grpimg" />
//             </Col>
//             <Col xs={7} className="mt-2">{i.sName}</Col>
//             <Col xs={3}>
//                 <InputGroup size="sm" className="mb-3">
//                     <InputGroup.Text id="inputGroup-sizing-sm">$</InputGroup.Text>
//                     <Form.Control
//                         aria-label="Small"
//                         aria-describedby="inputGroup-sizing-sm"
//                         placeholder='0.00'
//                         onChange={(e) => handleamount(e, index)}
//                         value={splitMemdet.length>0 ? splitMemdet?.find(item=>item.id===i._id).amount : undefined }
//                         name="amount"
//                     />
//                 </InputGroup>
//             </Col>
//         </Row>
//     </div>
// })}

// {stateGroupDetail?.name &&
//     <div>
//         <Row className='py-3' >
//             <Col xs={2} className="text-end">
//                 <img className='grp-frd-icon' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${stateGroupDetail.avatar}`} alt="grpimg" />
//             </Col>
//             <Col xs={7} className="mt-2">{stateGroupDetail.name}</Col>
//             <Col xs={3}>
//                 <InputGroup size="sm" className="mb-3">
//                     <InputGroup.Text id="inputGroup-sizing-sm">$</InputGroup.Text>
//                     <Form.Control
//                         aria-label="Small"
//                         aria-describedby="inputGroup-sizing-sm"
//                         placeholder='0.00'
//                         value={nonGrpSplitAmnt}
//                         onChange={(e) => {
//                             handleamount(e, 0)
//                             setNonGrpSplitAmnt(e.target.value)
//                         }}
//                         name="amount"
//                     />
//                 </InputGroup>
//             </Col>
//         </Row>
//         <Row className='py-3' >
//             <Col xs={2} className="text-end">
//                 <img className='grp-frd-icon' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${loginUser.sAvatar}`} alt="grpimg" />
//             </Col>
//             <Col xs={7} className="mt-2">{loginUser.sName}</Col>
//             <Col xs={3}>
//                 <InputGroup size="sm" className="mb-3">
//                     <InputGroup.Text id="inputGroup-sizing-sm">$</InputGroup.Text>
//                     <Form.Control
//                         aria-label="Small"
//                         aria-describedby="inputGroup-sizing-sm"
//                         placeholder='0.00'
//                         value={loginSplitAmnt}
//                         onChange={(e) => {
//                             handleamount(e, 1)
//                             setLoginSplitAmnt(e.target.value)
//                         }}
//                         name="amount"
//                     />
//                 </InputGroup>
//             </Col>
//         </Row>
//     </div>}


// <div class="fixed-bottom text-center div_bottom">
//     <p className='m-0 fs-5 fw-bold'>$ {total} of $  {state?.amount}</p>
//     $  {state.amount - total < 0 ?
//         <span className='text-danger fw-bold'>{(state.amount - total).toFixed(2)} over</span> :
//         <span class="fw-bold">{(state.amount - total).toFixed(2)} left</span>}
// </div>
