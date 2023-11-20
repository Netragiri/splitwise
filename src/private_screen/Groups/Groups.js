import React, { useEffect, useRef, useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import { MdOutlineGroupAdd } from "react-icons/md";
import { BsFilterSquare } from "react-icons/bs";
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import { Grouplist } from '../../api/auth';
import "../../assets/css/group.css"
import Spinner from 'react-bootstrap/esm/Spinner';
import { Dropdown } from 'react-bootstrap';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useQuery } from 'react-query';
import AddGroup from './AddGroup';
import { useNavigate, useOutletContext } from 'react-router-dom';

function Groups() {
  const [show, setShow] = useState(false);
  const isBottomReached = useRef(false)
  const [grplist, setGrplist] = useState([])
  const [selected, setSelected] = useState('undefined');
  const [search] = useOutletContext()
  const [totalamount, setTotalAmount] = useState()
  const navigate = useNavigate()
  const [payload, setPayload] = useState({
    skip: 0,
    limit: 5,
    filterByowed: "",
    search: "",
  });


  


  // setgrplist(grouplist)
  // console.log(grplist)
  const handlechange = (event) => {
    console.log(setPayload.type)
    setSelected(event.target.value)
    setPayload({
      ...payload,
      skip: 0,
      filterByowed: event.target.value,
    });
  };


  //for seraching the groups
  useEffect(() => {
    setGrplist([])
    setPayload({
      ...payload,
      skip: 0,
      search: search
    })
  }, [search]);


  useEffect(() => {
    // attaching scroll event listener
    // throw new Error("hello");
    const Element = document.getElementById("groupsection");
    Element.addEventListener("scroll", (e) => {
      const value = e.target;
      if (value.scrollHeight - value.scrollTop === value.clientHeight) {
        handleBottomReached(grplist)
      }
    });
  }, []);


  // const isLongEnough = search.payload < 7;
  const { isLoading, isSuccess, data: group } = useQuery(["usergrouplist", payload], () => Grouplist(payload), {
  // const { data: group, isLoading, isSuccess } = useQuery(["usergrouplist", payload], () => Grouplist(payload), {
    onSuccess: (data) => {
      // console.log(data)
      setTotalAmount(data.nOverallAmount)
      if (isBottomReached.current) {
        setGrplist([...grplist, ...data.aGroups]);
        isBottomReached.current = false
      } else {
        setGrplist(data.aGroups);
      }
    },
    retry: 0,
    refetchOnWindowFocus: false,
    // refetchOnMount: false,
  });
// console.log({data})
  // console.log(data,"dataaaaaaaa")
  function handleBottomReached(data) {
    console.log(group)
    // if(group.aGroups.length===5){
      isBottomReached.current = true
      setPayload({
        ...payload,
        skip: payload.skip + payload.limit,
      });
    // }
  }


  const handleClose = () => setShow(false);

  // console.log(data[1])
  // console.log(grplist.length)
  console.log(group ,"response")
  

  return (
    <>

      <div className='text-center scrolling_div'>
        {/* {isLoading ? <Spinner animation="border" role="status"></Spinner> : null} */}
        <Row>
          <Col className='text-start'>
            {!isLoading && isSuccess && grplist?.length !== undefined && <>Overall, <span className={totalamount > 0 ? "owed_text" : totalamount === 0 ? "settledup_text" : "group_owed_text"}>{totalamount < 0 ? `you owed ${totalamount.toFixed(2)} ` : totalamount > 0 ? `you are owed ${totalamount.toFixed(2)}` : totalamount === 0 ? `settled up` : ""}</span></>}

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
                  All groups
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
                  Groups you owe
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
                  Groups that owe you
                </label>
              </div>
            </Dropdown.Item>

          </DropdownButton></Col>
        </Row>


        <div className='my-3'>
          {grplist.length === undefined ? "no data found" : ""}
          {grplist.map((group, index) => {
            return <Row className='my-4' key={index} onClick={() => navigate(`/group/${group._id}`)}>
              <Col sm={3} xs={3} className='ps-3 text-start'><img src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${group.sAvatar}`} alt="grpimg" className='grp_img'></img></Col>
              <Col sm={9} xs={9} className="text-start">
                <p className='grp_name m-0'> {group.sGroupName}</p>

                {/* {setNonGrpDet(group?.nonGroupTransactions?.reduce(function (prev, current) {
                  return prev + +current.nAmount
              }, 0) )} */}
                {/* {totNonGrp} */}


                {group._id === "62cd74082f9024ac8a092cbb" ?
                  <>
                  {/* for non-grp detail */}
                    {group?.nonGroupTransactions?.reduce(function (prev, current) {
                      return prev + +current.nAmount
                    }, 0) > 0 ? <p className='owed_text'>you owed ${group?.nonGroupTransactions?.reduce(function (prev, current) {
                      return prev + +current.nAmount
                    }, 0).toFixed(2)}  </p> :
                    group?.nonGroupTransactions?.reduce(function (prev, current) {
                      return prev + +current.nAmount
                    }, 0) < 0 ? <p className='group_owed_text'>you owed ${-group?.nonGroupTransactions?.reduce(function (prev, current) {
                      return prev + +current.nAmount
                    }, 0).toFixed(2)}  </p>
                    : <p className='settledup_text'> settled up</p>
                    
                    }
                  </>

                  :
                  // group details
                  <p className={group.nNetAmount > 0 ? "owed_text" : group.nNetAmount === 0 ? "settledup_text" : "group_owed_text"}>
                    {group.nNetAmount < 0 ? `you owed $${-group.nNetAmount.toFixed(2)} ` : group.nNetAmount > 0 ? `you are owed  $${group.nNetAmount.toFixed(2)}` : "settled up"}
                  </p>
                }
                <div className='prsn_owed_text'> 
                {group?.groupTransaction?.slice(0,2).map((i,index) => {
              return  <div key={index}> <span className='m-0' >{localStorage.getItem("loginid")=== i.iFrom ? "You" : i.oFrom.sName} owed {localStorage.getItem("loginid")=== i.iTo ? "you" : i.oTo.sName}</span> <span className={i.nAmount > 0 ? "text-success" : "text-danger"}>${Math.abs(i.nAmount).toFixed(2)}</span></div>
            })}
            {group.nonGroupTransactions?.slice(0,2).map((i,index) => {
              return <p className='m-0' key={index}>{localStorage.getItem("loginid")=== i.iFrom ? "You" : i.oFrom.sName} owed {localStorage.getItem("loginid")=== i.iTo ? "you" : i.oTo.sName} <span className={i.nAmount > 0 ? "text-success" : "text-danger"}>${Math.abs(i.nAmount).toFixed(2)}</span></p>
            })}
                </div>
              </Col>
            </Row>
          })}

          {isLoading && (
            <Spinner animation="border" role="status">
            </Spinner>)}
          {/* {grplist?.aGroups?.length < 5 &&  <Spinner animation="border" role="status">
            </Spinner>} */}

        </div>
        <Button className='add_grp_btn' onClick={() => setShow(true)}><MdOutlineGroupAdd size={20} className="mx-2" />Start a new group</Button>
      </div>

      <AddGroup show={show} onHide={handleClose} setShow={setShow} />
    </>
  )
}

export default Groups