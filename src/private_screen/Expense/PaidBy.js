import React, { useContext, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { BiArrowBack } from "react-icons/bi";
// import {  MutationCache, QueryClient } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
// import { useGetFetchQuery } from '../../api/auth';
// import { useQueryClient } from "react-query";
// import { useGrpMember } from '../../api/auth';
import { MdOutlineDone } from "react-icons/md";
import { SearchContext } from '../../Context/Add-expenseContext';


function PaidBy() {
    const navigate = useNavigate() 
    const param=useParams();
    const { groupdetails ,paidByDet} = useContext(SearchContext)
    const stateGroupDetail = groupdetails[0];
    const payer=paidByDet[0]
    // const [loginUseDet,setLoginUseDet]=loginUserData
    
  const [checked,setChecked]=useState(payer.length!==0 ? payer.id :localStorage.getItem("loginid"))
  const loginUser=JSON.parse(localStorage.getItem("loginDetails"))


//   console.log(groupdetails)
    // console.log(grpmember?.aGroups)
    // console.log(checked,"checked")
    // console.log(state.grpid)
    // const queryClient = useQueryClient();

    // const data = useGetFetchQuery("usergrouplist");
    // console.log(queryClient)
    // console.log(queryClient.getMutationDefaults("grpmembers"))
    console.log(stateGroupDetail)
    console.log(JSON.parse(localStorage.getItem("loginDetails")))
    console.log(payer)

    return (
        <div className='p-3'>
            <Row>
                <Col xs={2} className='text-start'><BiArrowBack size={30} onClick={() => navigate(-1)} /></Col>
                <Col xs={10} className='text-start fs-4'>Who paid?</Col>
            </Row>
            {stateGroupDetail.aGroupMember && 
            <>
            {stateGroupDetail?.aGroupMember?.map((i) => {
                return <Row key={i._id} className='py-3' onClick={()=>{
                    if(param.expid){
                        navigate(`/exp/${param.expid}/edit`,{state:{perid:i._id,pername:i.sName}})
                    }
                    else{
                        navigate("/add-expense",{state:{perid:i._id,pername:i.sName}})
                    }
                    setChecked(i._id)
                }}>
                    <Col xs={2} className="text-end">
                        <img className='grp-frd-icon' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${i.sAvatar}`} alt="grpimg" />
                    </Col>
                    <Col xs={8} className="mt-2">{i.sName}</Col>
                    <Col xs={2}>
                       {checked === i._id && <MdOutlineDone size={25} /> } 
                    </Col>
                </Row>
            })}
            </>
            }

                 {stateGroupDetail.name &&
                <>
                    <Row  className='py-3' onClick={()=>{
                        if(param.expid){
                            navigate(`/exp/${param.expid}/edit`,{state:{perid:stateGroupDetail.id,pername:stateGroupDetail.name}})
                        }
                        else{
                            navigate("/add-expense",{state:{perid:stateGroupDetail.id,pername:stateGroupDetail.name}})
                        }
                        // setChecked(i._id)
                    }}>
                        <Col xs={2} className="text-end">
                            <img className='grp-frd-icon' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${stateGroupDetail.avatar}`} alt="grpimg" />
                        </Col>
                        <Col xs={8} className="mt-2">{stateGroupDetail.name}</Col>
                        <Col xs={2}>
                        {checked === stateGroupDetail.id && <MdOutlineDone size={25} /> } 
                        </Col>
                    </Row>
                    <Row  className='py-3' onClick={()=>{
                        if(param.expid){
                            navigate(`/exp/${param.expid}/edit`,{state:{perid:loginUser._id,pername:loginUser.sName}})
                        }
                        else{
                            navigate("/add-expense",{state:{perid:loginUser._id,pername:loginUser.sName}})
                        }
                        // setChecked(i._id)
                    }}>
                        <Col xs={2} className="text-end">
                            <img className='grp-frd-icon' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${loginUser.sAvatar}`} alt="grpimg" />
                        </Col>
                        <Col xs={8} className="mt-2">{loginUser.sName}</Col>
                        <Col xs={2}>
                        {checked === loginUser._id && <MdOutlineDone size={25} /> } 
                        </Col>
                    </Row>
                    </>
    } 

<Row>
    <Col xs={2}></Col>
    <Col xs={8}> <Link to="multi-payer">Multiple People  </Link></Col>
    <Col xs={2}> {payer.length > 0 && <MdOutlineDone size={25} /> } </Col>
</Row>
   
        </div>
    )
}

export default PaidBy