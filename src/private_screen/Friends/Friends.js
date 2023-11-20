import React, { useEffect } from 'react'
import { useState } from 'react';
import { Col, Dropdown, DropdownButton, Row } from 'react-bootstrap'
import { MdPersonAddAlt } from "react-icons/md";
import { MdSearch } from "react-icons/md";
import { useQuery } from 'react-query';
import { friendList } from '../../api/auth';
import { BsFilterSquare } from "react-icons/bs";
import "../../assets/css/friends.css"
import { Navigate, useNavigate } from 'react-router-dom';

function Friends() {
  const [search,setSearch]=useState("")
  const [show,setShow]=useState(false)
  const [friendlist, setFriendlist] = useState([])
  const [totalamount,setTotalAmount]=useState(0)
  const [selected, setSelected] = useState('undefined');
  const navigate=useNavigate()
  const [payload, setPayload] = useState({
    skip: 0,
    limit: 5,
    filterByowed: "",
    search: "",
  });



  //fetch friends of login user
  const { isLoading, isSuccess, data: group } = useQuery(["usergrouplist", payload], () => friendList(payload), {
    // const { data: group, isLoading, isSuccess } = useQuery(["usergrouplist", payload], () => Grouplist(payload), {
      onSuccess: (data) => {
        console.log(data)
        setTotalAmount((data.aFriends.reduce(function (prev, current) {
          return prev + current.netAmount
      }, 0)))
        setFriendlist(data.aFriends)
        // setTotalAmount(data.nOverallAmount)
        // if (isBottomReached.current) {
        //   setGrplist([...grplist, ...data.aGroups]);
        //   isBottomReached.current = false
        // } else {
        //   setGrplist(data.aGroups);
        // }
      },
      retry: 0,
      refetchOnWindowFocus: false,
      // refetchOnMount: false,
    });


    //filter friends 
    const handlechange = (event) => {
      console.log(setPayload.type)
      setSelected(event.target.value)
      setPayload({
        ...payload,
        skip: 0,
        filterByowed: event.target.value,
      });
    };


    //for seraching the friends
  useEffect(() => {
    setPayload({
      ...payload,
      skip: 0,
      search: search
    })
  }, [search]);

    console.log(friendlist)
    console.log(totalamount)
  return (
    <>
     <Row>
        <Col xs={10}>
          {show &&
          <input type="search" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search friends"></input>
          }
        </Col>
        <Col xs={1}> <MdSearch size={30} className='' onClick={() => setShow(!show)}/></Col>
        <Col xs={1}><MdPersonAddAlt size={30}  /></Col>
      </Row>

      <Row className='my-3'>
          <Col className='text-start m-0'>
            {!isLoading && isSuccess && friendlist?.length !== undefined && <>Overall, <span className={totalamount > 0 ? "owed_text" : totalamount === 0 ? "settledup_text" : "group_owed_text"}>{totalamount < 0 ? `you owed ${totalamount.toFixed(2)} ` : totalamount > 0 ? `you are owed ${totalamount.toFixed(2)}` : totalamount === 0 ? `settled up` : ""}</span></>}

          </Col>
          <Col className='text-end'><DropdownButton
            // variant="outline-secondary"
            title={<BsFilterSquare />}
            id="input-group-dropdown-1"
            className='filter_grp_btn'
          >
            <Dropdown.Item href="#/">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexDisabled"
                  id="flexRadioDisabled"
                  value="undefined"
                  onChange={handlechange}
                  checked={selected === "undefined"}></input>
                <label
                  className="form-check-label"
                  htmlFor="flexRadioDisabled"
                >
                  All friends
                </label>
              </div>
            </Dropdown.Item>
            <Dropdown.Item href="#/">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexDisabled"
                  id="flexRadio"
                  value="0"
                  onChange={handlechange}
                  checked={selected === "0"}
                />
                <label className="form-check-label" htmlFor="flexRadio">
                  Outstanding balances
                </label>
              </div>
            </Dropdown.Item>
            <Dropdown.Item href="#/">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexDisabled"
                  id="flexRadio1"
                  value="1"
                  onChange={handlechange}
                  checked={selected === "1"}
                />
                <label className="form-check-label" htmlFor="flexRadio1">
                  Friend you owe
                </label>
              </div>
            </Dropdown.Item>
            <Dropdown.Item href="#/">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexDisabled"
                  id="flexRadio12h"
                  value="-1"
                  onChange={handlechange}
                  checked={selected === "-1"}
                />
                <label className="form-check-label" htmlFor="flexRadio12h">
                  Friend who owe you
                </label>
              </div>
            </Dropdown.Item>

          </DropdownButton></Col>
        </Row>

         {friendlist.length===0  && isSuccess ?  <p>no friends available</p> : null}
        <div className='my-3'>
          {friendlist.map((friend,index)=>{
            return <Row className='my-2' key={index} onClick={()=>navigate(`/friends/${friend.oFriend._id}`)}>
                  <Col xs={1}><img src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${friend.oFriend.sAvatar}`} alt="grpimg" className='friend_img' /></Col>
                  <Col xs={8} className="ps-4">{friend.oFriend.sName}</Col>
                  <Col xs={3} className="text-center">
                  {friend.netAmount > 0 ? <><p className='text-success expense_txt m-0'>owes you</p><p className='text-success expense_txt m-0'> ${friend.netAmount.toFixed(2)}</p></> : friend.netAmount < 0 ? <><p className='text-danger expense_txt m-0'>you borrowed</p><p className='text-danger expense_txt m-0'> ${-friend.netAmount.toFixed(2)}</p></> : friend.netAmount === 0 ? <p className='text-secondary expense_txt m-0'>no balance</p> : ""}
                    </Col>
                </Row>
          })}
        </div>
    </>
  )
}

export default Friends