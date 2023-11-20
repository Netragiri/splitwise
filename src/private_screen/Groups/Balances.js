import React from 'react'
import { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap'
import { BiArrowBack } from "react-icons/bi";
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchBalances } from '../../api/auth';
import Accordion from 'react-bootstrap/Accordion';
import "../../assets/css/group.css"

function Balances() {
  const navigate = useNavigate()
  const param = useParams()
  const [balances, setBalances] = useState([])

  const { isLoading, isSuccess } = useQuery("balances-grp", () => fetchBalances(param.grpid), {
    onSuccess: (data) => {
      console.log(data)
      setBalances(data)
    },
    retry: 0,
    refetchOnWindowFocus: false,
    // refetchOnMount: false,
  });
  return (
    <>
    <div className='top'>
      <Row>
        <Col xs={2} className='text-start'><button className='back_btn'><BiArrowBack size={30} onClick={() => navigate(-1)} /></button> </Col>
        <Col xs={10} className='text-start fs-4'>Balances</Col>
      </Row>
      </div>

      <div className='mt-5 balances-div'>
        {balances?.aResult?.map((i, index) => {
          return <Accordion className=''>
            <Accordion.Item eventKey={index}>
              <Accordion.Header>
                {i.nOverallAmount > 0 ? <>
                  <img className='grp-frd-icon' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${i.sAvatar}`} alt="grpmem-img" />
                  <p className='ms-3'>{i.sName} gets back <span className='text-success'>${i.nOverallAmount.toFixed(2)}</span> in total</p>
                </>
                  : i.nOverallAmount < 0 ? <>
                    <img className='grp-frd-icon' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${i.sAvatar}`} alt="grpmem-img" />
                    <p className='ms-3'>{i.sName} owes <span className='text-danger'>${-i.nOverallAmount.toFixed(2)}</span> in total</p>
                  </>
                    : <>
                      <img className='grp-frd-icon' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${i.sAvatar}`} alt="grpmem-img" />
                      <p className='ms-3'>{i.sName} is settled up</p>
                    </>
                }
              </Accordion.Header>
              <Accordion.Body className='py-0 '>
                {i.aTransactions.map((trans) => {
                  return <div className=''>
                    {trans.nAmount > 0 ? <>

                    <Row>
                      <Col xs={1} className="text-end"> <img className='balance-icon d-inline' src={i.memberId === trans.iFrom ? `https://res.cloudinary.com/dc1ck5lh8/image/upload/${trans.oTo.sAvatar}`
                      : `https://res.cloudinary.com/dc1ck5lh8/image/upload/${trans.oFrom.sAvatar}`} alt="grpmem-img" /></Col>
                      <Col xs={11} className="text-start p-0">   <p className='d-inline ms-3 text-secondary'>{trans.oFrom.sName} owes  <span className='text-success'>${trans.nAmount.toFixed(2)}</span>  to {trans.oTo.sName}</p><br/></Col>
                    </Row>
                    <Row>
                      <Col xs={1}></Col>
                      <Col xs={11}> <button className='settle-up-btn mt-2 ms-3\'>Settle up</button></Col>
                    </Row>
                      
                    </>
                    
                    
                    : <>

                      <Row>
                      <Col xs={1} className="text-end"> <img className='balance-icon d-inline' src={i.memberId === trans.iFrom ? `https://res.cloudinary.com/dc1ck5lh8/image/upload/${trans.oTo.sAvatar}`
                      : `https://res.cloudinary.com/dc1ck5lh8/image/upload/${trans.oFrom.sAvatar}`} alt="grpmem-img" />
                      </Col>
                      <Col xs={11} className="text-start p-0">   <p className='d-inline ms-3 text-secondary'>{trans.oFrom.sName} owes <span className='text-danger'>${-trans.nAmount.toFixed(2)}</span>  to {trans.oTo.sName}</p></Col>
                    </Row>
                    <Row>
                      <Col xs={1}></Col>
                      <Col xs={11}> <button className='settle-up-btn mt-2 ms-3\'>Settle up</button></Col>
                    </Row>
  
                    </> }
                    <br/>
                  </div>
                })}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        })}
      </div>

   
    </>
  )
}

export default Balances