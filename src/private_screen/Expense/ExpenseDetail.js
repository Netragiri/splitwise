import React from 'react'
import { Col, Row, Spinner } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchExpDetail } from '../../api/auth';
import { BiArrowBack } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import { useState } from 'react';
import { useContext } from 'react';
import { SearchContext } from '../../Context/Add-expenseContext';
import { MdOutlineDeleteOutline } from "react-icons/md";

function ExpenseDetail() {
    const param=useParams()
    const navigate=useNavigate()
    const [expDet,setExpDet]=useState({})
    const [month,setMonth]=useState("")
    const [date,setDate]=useState("")
    const [year,setYear]=useState("")
    const {search,expenseDet,paidByDet,splitByDet,groupdId,groupdetails}=useContext(SearchContext)
    const [stateSearch,setStateSearch]=search
    const [stateExpDet,setStateExpDet]=expenseDet
    const [statePaidBy,setStatePaidBy]=paidByDet
    const [stateSplitBy,setStateSplitBy]=splitByDet
    const [groupid,setGroupid]=groupdId
    const [stateGroupDetail, setStateGroupDetail] = groupdetails;

    const { isLoading } = useQuery("expense-detail", () => fetchExpDetail(param.expid), {
        onSuccess: (data) => {
            const date=new Date(data.expence.dCreatedAt)
            console.log(data.expence)
            setMonth(date.toLocaleString('default', { month: 'long' }))
            setDate(date.toISOString().substring(5, 7))
            setYear(date.getFullYear())
            setExpDet(data.expence)
            //grpwise expense
            if(data.expence.iGroupId._id!=="62cd74082f9024ac8a092cbb"){
                setStateSearch(data.expence.iGroupId.sGroupName)    
                console.log("if called")
                if(data.expence.aPayers.length===1){
                    setStatePaidBy({
                        id:data.expence.aPayers[0].iUserId,
                        name:data.expence.aPayers[0].sName
                      })
                } 
                data.expence.aUsers.forEach((i) =>{
                    if(data.expence.aPayers.length > 1){
                        setStatePaidBy(currentArray => [...currentArray, {
                            "id": i.iUserId._id,
                            "amount": i.nPaidAmount,
                        }])
                    }
                    
                    if(i.nOwedAmount!==data.expence.nTotalPaidAmount/data.expence.aUsers.length){
                    setStateSplitBy( (currentArray) => [...currentArray, {
                            "id": i.iUserId._id,
                            "amount": i.nOwedAmount,
                        }])
                       }
                })
            }
            //non-grp expense
            else{
                setStateSearch(data.expence.aUsers.find(i=>i.iUserId._id!==localStorage.getItem("loginid")).iUserId.sName)
                setStateGroupDetail({
                    id: data.expence.aUsers.find(i=>i.iUserId._id!==localStorage.getItem("loginid")).iUserId._id,
                    name: data.expence.aUsers.find(i=>i.iUserId._id!==localStorage.getItem("loginid")).iUserId.sName,
                    avatar: data.expence.aUsers.find(i=>i.iUserId._id!==localStorage.getItem("loginid")).iUserId.sAvatar
                  })
                console.log("called else")
                if(data.expence.aPayers.length===1){
                    setStatePaidBy({
                        id:data.expence.aPayers[0].iUserId,
                        name:data.expence.aPayers[0].sName
                    })
                }
                else{
                    data.expence.aUsers.forEach((i) =>{
                        
                            setStatePaidBy(currentArray => [...currentArray, {
                                "id": i.iUserId._id,
                                "amount": i.nPaidAmount,
                            }])

                            if(i.nOwedAmount!==data.expence.nTotalPaidAmount/data.expence.aUsers.length){
                                setStateSplitBy(currentArray => [...currentArray, {
                                    "id": i.iUserId._id,
                                    "amount": i.nOwedAmount,
                                }])
                            }
                    })
                }
               
                
                
            }
            setGroupid(data.expence.iGroupId._id)
            setStateExpDet({
                description:data.expence.sDescription,
                amount:data.expence.nTotalPaidAmount,
            })
            
            },
        retry: 0,
        refetchOnWindowFocus: false,
        // refetchOnMount: false,
    });
    console.log(stateExpDet)
    console.log(statePaidBy,'paiderss')
    console.log(stateSplitBy)
    console.log(stateSearch)
    // console.log(param.expid)
    console.log(groupid)
    console.log(stateGroupDetail)
  return (
    <div className=''>
        <Row>
        <Col xs={2} className='text-start'><button className='back_btn'><BiArrowBack size={30} onClick={() => {
            navigate(-1)
            setStateExpDet({
                description:"",
                amount:"",
              })
              setStateSplitBy([])
              setStatePaidBy([])
              setStateSearch("")
              setStateGroupDetail([])
        }} /></button> </Col>
        <Col xs={8}></Col>
        <Col xs={1}><MdOutlineDeleteOutline size={25} /></Col>
        <Col xs={1} className="text-end"><Link to="edit" state={{payers:expDet.aPayers}}><FiEdit2 size={20} color="black" /></Link></Col>
        </Row>
    
        {!isLoading && Object.keys(expDet).length !== 0 ?
        <div className='ps-3 pt-3'>
            <h4>{expDet.sDescription}</h4>
            <h3 className='fw-bold'>${expDet.nTotalPaidAmount}</h3>
            <p className='text-secondary'>Added by {expDet?.iAddedBy?._id===localStorage.getItem("loginid") ? "you" : expDet?.iAddedBy?.sName} on {month} {date},{year}</p>

            <Row>
            <Col xs={1}><img className='grp-frd-icon' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${expDet.aPayers[0].sAvatar}`} alt="grpimg"></img></Col>
            {/* <Col xs={1}>I</Col> */}
            <Col xs={11} className="ps-3">{expDet?.aPayers?.length > 1 ? <p className='m-0'>{expDet?.aPayers?.length} people paid ${expDet.nTotalPaidAmount.toFixed(2)}</p>: <p className='m-0+9'>{expDet.aPayers[0].iUserId===localStorage.getItem("loginid") ? "you" :  expDet.aPayers[0].sName} paid ${expDet.nTotalPaidAmount.toFixed(1)}</p>}</Col>
        </Row>

        {expDet.aPayers.length === 1 ? <div>
            {expDet.aUsers.map((person,index)=>{
                return <Row key={index}>
                    <Col xs={1}></Col>
                    <Col xs={11}><p className='text-secondary my-1'>{person.iUserId._id===localStorage.getItem("loginid") ? "you" : person.iUserId.sName} owe ${person.nOwedAmount.toFixed(2)}</p></Col>
                </Row>
                
            })}
        </div> : <div>
        {expDet.aUsers.map((person,index)=>{
                return <Row key={index}>
                <Col xs={1}></Col>
                <Col xs={11}> <p className='text-secondary m-0'>{person.iUserId._id===localStorage.getItem("loginid") ? "you" : person.iUserId.sName} paid ${person.nPaidAmount} and owe ${person.nOwedAmount.toFixed(2)}</p></Col>
            </Row>
            
               
            })}
        </div> }
        </div>
        : <Spinner animation="border" role="status" className='mt-4'/>}

        {!isLoading && <div>
       
        </div>}
    </div>
  )
}

export default ExpenseDetail