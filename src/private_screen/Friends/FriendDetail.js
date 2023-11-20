import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BiArrowBack } from "react-icons/bi";
import { fetchFriendDetail } from '../../api/auth';
import { useQuery } from 'react-query';
import { Spinner } from 'react-bootstrap';
import { useState } from 'react';

function FriendDetail() {
    const navigate=useNavigate()
    const param=useParams()
    const [friendDetail,setFriendDetail]=useState([])

    const { isLoading, isSuccess } = useQuery(["friend-detail"], () => fetchFriendDetail(param.friendid), {
        onSuccess: (data) => {
            // console.log(data)
            setFriendDetail(data)
        //   setData(data)
        //   if (isBottomReached.current) {
        //     setGrpDetail([...grpdetail, ...data.aGroupDetails]);
        //     isBottomReached.current = false
        //   } else {
        //     setGrpDetail(data.aGroupDetails);
        //   }
        },
        retry: 0,
        refetchOnWindowFocus: false,
        // refetchOnMount: false,
      });
      console.log(friendDetail)
  return (
    <>
    <div className='top'><button className='back_btn'><BiArrowBack size={30} onClick={() => navigate(-1)} /></button> </div>
    <div className='text-center mt-2'>
        {isLoading &&
          <Spinner animation="border" role="status">
          </Spinner>}
      </div>

      {isSuccess && 
      <div className="grp-div">
      <div className='pt-5 px-3 text-start'> 
        <img className='ind_grp_img' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${friendDetail?.oFriend?.sAvatar}`} alt="grpimg"></img>
        <h4 className='mt-3'>{friendDetail?.oFriend?.sName}</h4>
        <p>{friendDetail?.netAmount === 0 ? "You are all settled up in this group" : friendDetail?.netAmount > 0 ? <span className='text-success'>You are owed  ${friendDetail?.netAmount.toFixed(2)} overall </span> : friendDetail?.netAmount < 0 ? <span className='text-danger'>You owed  ${-friendDetail?.netAmount.toFixed(2)} overall </span> : ""}</p>
        {friendDetail.aTransactions.map((i)=>{
            return <>
            {i.total > 0  ? <p >{friendDetail?.oFriend?.sName} owes you <span className='text-success'>${i.total} </span> in {i.sGroupName}</p>: ""}
            </>
        })}
        {/* {data?.aGroupTransaction?.length > 0 &&
          <>
            {data.aGroupTransaction.map((i,index) => {
              return <p className='m-0' key={index}>{localStorage.getItem("loginid") === i.iFrom ? "You" : i.oFrom.sName} owed {localStorage.getItem("loginid") === i.iTo ? "you" : i.oTo.sName} <span className={i.nAmount > 0 ? "text-success" : "text-danger"}>${Math.abs(i.nAmount).toFixed(2)}</span></p>
            })}
          </>
        } */}
      </div>
      </div>}
    </>
  )
}

export default FriendDetail