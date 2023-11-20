import React from 'react'
import { Col, Form, InputGroup, Row } from 'react-bootstrap'

function AdjustAmount({stateGroupDetail,handleamount,nonGrpPaidAmnt,setNonGrpPaidAmnt,loginUser,loginPaidAmnt,setLoginPaidAmnt,total,det,payers,splitMemdet,nonGrpSplitAmnt,setNonGrpSplitAmnt,loginSplitAmnt,setLoginSplitAmnt}) {



    console.log(nonGrpPaidAmnt,loginPaidAmnt,nonGrpSplitAmnt,loginSplitAmnt)
  return (
    <div>
         {stateGroupDetail?.aGroupMember?.map((i, index) => {
                    return <div className='px-3' key={i._id} >
                        <Row className='py-3' >
                            <Col xs={2} className="text-end">
                                <img className='grp-frd-icon' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${i.sAvatar}`} alt="grpimg" />
                            </Col>
                            <Col xs={7} className="mt-2">{i.sName}</Col>
                            <Col xs={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Text id="inputGroup-sizing-sm">$</InputGroup.Text>
                                    <Form.Control
                                        aria-label="Small"
                                        aria-describedby="inputGroup-sizing-sm"
                                        placeholder='0.00'
                                        value={ payers?.length > 0 ? payers?.find(item => item.id === i._id).amount 
                                        :splitMemdet?.length > 0 ? splitMemdet?.find(item => item.id === i._id).amount : undefined}
                                        onChange={(e) => handleamount(e, index)}
                                        name="amount"
                                    />
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
                            <Col xs={7} className="mt-2">{stateGroupDetail.name}</Col>
                            <Col xs={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Text id="inputGroup-sizing-sm">$</InputGroup.Text>
                                    <Form.Control
                                        aria-label="Small"
                                        aria-describedby="inputGroup-sizing-sm"
                                        placeholder='0.00'
                                        value={payers ? nonGrpPaidAmnt: splitMemdet ? nonGrpSplitAmnt : 45}
                                        onChange={(e) => {
                                            handleamount(e, 0)
                                           if(payers){
                                            setNonGrpPaidAmnt(e.target.value)
                                           }
                                           else if(splitMemdet){
                                            setNonGrpSplitAmnt(e.target.value)
                                           }
                                        }}
                                        name="amount"
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='py-3' >
                            <Col xs={2} className="text-end">
                                <img className='grp-frd-icon' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${loginUser.sAvatar}`} alt="grpimg" />
                            </Col>
                            <Col xs={7} className="mt-2">{loginUser.sName}</Col>
                            <Col xs={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Text id="inputGroup-sizing-sm">$</InputGroup.Text>
                                    <Form.Control
                                        aria-label="Small"
                                        aria-describedby="inputGroup-sizing-sm"
                                        placeholder='0.00'
                                        value={payers ? loginPaidAmnt: splitMemdet ? loginSplitAmnt : 45}
                                        onChange={(e) => {
                                            handleamount(e, 1)
                                            if(payers){
                                                setLoginPaidAmnt(e.target.value)
                                               }
                                               else if(splitMemdet){
                                                setLoginSplitAmnt(e.target.value)
                                               }
                                        }}
                                        name="amount"
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                    </div>}



                <div class="fixed-bottom text-center div_bottom">
                    <p className='m-0 fs-5 fw-bold'>$ {total} of $  {det?.amount}</p>
                    $  {det?.amount - total < 0 ?
                        <span className='text-danger fw-bold'>{(det?.amount - total).toFixed(2)} over</span> :
                        <span class="fw-bold">{(det?.amount - total).toFixed(2)} left</span>}
                </div>
    </div>
  )
}

export default AdjustAmount