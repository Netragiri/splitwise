import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Row, Spinner } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchGroupDetail } from '../../api/auth'
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { BiArrowBack } from "react-icons/bi";
import { useQuery } from 'react-query';

function GroupDetail() {
  const params = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState({})
  const [grpdetail, setGrpDetail] = useState([])
  const isBottomReached = useRef(false)
  const [payload, setPayload] = useState({
    skip: 0,
    limit: 10,
  });

  useEffect(() => {
    // attaching scroll event listener
    const Element = document.getElementById("groupsection");
    Element.addEventListener("scroll", (e) => {
      const value = e.target;
      if (value.scrollHeight - value.scrollTop === value.clientHeight) {
        handleBottomReached(grpdetail)
      }
    });
  }, []);

  function handleBottomReached(data) {
    isBottomReached.current = true
    setPayload({
      ...payload,
      skip: payload.skip + payload.limit,
    });
  }
  console.log(params.grpid)
  console.log("hiii")

  const { isLoading, isSuccess } = useQuery(["group-detail", payload], () => fetchGroupDetail(params.grpid, payload), {
    onSuccess: (data) => {
      setData(data)
      if (isBottomReached.current) {
        setGrpDetail([...grpdetail, ...data.aGroupDetails]);
        isBottomReached.current = false
      } else {
        setGrpDetail(data.aGroupDetails);
      }
    },
    retry: 0,
    refetchOnWindowFocus: false,
    // refetchOnMount: false,
  });

  // const { isLoading, data } = useGroupDeatil(params.grpid,payload,)
  // console.log(data)
  // console.log(isLoading, isSuccess)
  // console.log(data?.oGroup?.sGroupName)
  console.log(data)
  return (
    <>
      <div className='top'><button className='back_btn'><BiArrowBack size={30} onClick={() => navigate("/group")} /></button> </div>
      <div className='text-center mt-2'>
        {isLoading &&
          <Spinner animation="border" role="status">
          </Spinner>}
      </div>


      <div className="grp-div">
      <div className='pt-5 px-3 text-start'> 
        <img className='ind_grp_img' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${data?.oGroup?.sAvatar}`} alt="grpimg"></img>
        <h4 className='mt-3'>{data?.oGroup?.sGroupName}</h4>
        <p>{data?.nOverallAmount === 0 ? "You are all settled up in this group" : data?.nOverallAmount > 0 ? <span className='text-success'>You are owed  ${data?.nOverallAmount.toFixed(2)} overall </span> : data?.nOverallAmount < 0 ? <span className='text-danger'>You owed  ${-data?.nOverallAmount.toFixed(2)} overall </span> : ""}</p>
        {data?.aGroupTransaction?.length > 0 &&
          <>
            {data.aGroupTransaction.map((i,index) => {
              return <p className='m-0' key={index}>{localStorage.getItem("loginid") === i.iFrom ? "You" : i.oFrom.sName} owed {localStorage.getItem("loginid") === i.iTo ? "you" : i.oTo.sName} <span className={i.nAmount > 0 ? "text-success" : "text-danger"}>${Math.abs(i.nAmount).toFixed(2)}</span></p>
            })}
          </>
        }
      </div>
      <div className='ind_grp_scroll_btns py-3'>
        <Button className='settle-up_btn'>Settle up</Button>
        <Button className='balances_btn' onClick={()=>navigate("balances")}>Balances</Button>
        <Button className='balances_btn' onClick={()=>navigate("total-expense")}>Totals</Button>
      </div>
      <div>
        {grpdetail.length === 0 && "no expense available"}
        {grpdetail?.length > 0 &&
          <>
            {grpdetail.map((i) => {


              const date = new Date(i.dCreatedAt)
              const dd = date.toISOString().substring(5, 7)
              const monthname = date.toLocaleString('default', { month: 'short' })
              const userDetail = i?.aUsers?.find((i) => i.iUserId === localStorage.getItem("loginid"))
              const expAddPer = i?.aPayers?.find((i) => i.iUserId === localStorage.getItem("loginid"))
              const totalOwedmoney = userDetail?.nPaidAmount - userDetail?.nOwedAmount

              return <Row className='text-start mt-3' key={i._id} onClick={()=>navigate(`/exp/${i._id}`)}>
                <Col xs={1} >
                  <p className='m-0 mm_txt'>{monthname}</p>
                  <p className='m-0 dd_txt'>{dd}</p>
                </Col>
                <Col xs={1}>
                  {Object.keys(i).some(key => key === 'isExpence') ?
                    <img className='expense-img' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${i.oExpenceCategory.sAvatar}`} alt="exp-img" /> : <FaRegMoneyBillAlt color='green' size={28} />}
                </Col>
                <Col xs={7} className="ps-4">
                  {Object.keys(i).some(key => key === 'isExpence') ?
                    <>
                      <p className='fs-6 fw-normal m-0'>{i.sDescription}</p>
                      <p className='m-0 trans_txt'>{i?.aPayers?.length > 1 ? `${i?.aPayers?.length} people` : expAddPer ? "you" : i?.aPayers[0]?.sName} paid ${i?.nTotalPaidAmount}.</p>
                    </>
                    :
                    <span className='trans_txt'>
                      {i.oTo.sName} paid {i.oFrom.sName} ${Math.abs(i.nAmount)}
                    </span>}
                </Col>
                <Col xs={3} className="text-center"> {Object.keys(i).some(key => key === 'isExpence') && totalOwedmoney > 0 ? <><p className='text-success expense_txt m-0'>you lent</p><p className='text-success expense_txt m-0'> ${totalOwedmoney.toFixed(2)}</p></> : totalOwedmoney < 0 ? <><p className='text-danger expense_txt m-0'>you borrowed</p><p className='text-danger expense_txt m-0'> ${-totalOwedmoney.toFixed(2)}</p></> : totalOwedmoney === 0 ? <p className='text-secondary expense_txt m-0'>no balance</p> : ""}</Col>

              </Row>
            })}
          </>}
          <p className='text-center'>{isLoading && <Spinner animation="border" role="status" />}</p>
      </div>
      </div>
    </>
  )
}

export default GroupDetail