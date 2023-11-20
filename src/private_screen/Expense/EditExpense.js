import React, { useContext, useEffect, useState } from 'react'
import { Col, Form, InputGroup, Row } from 'react-bootstrap'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { SearchContext } from '../../Context/Add-expenseContext'
import ToastMessage from '../../SharedComponent/ToastMessage'
import { BiArrowBack } from "react-icons/bi";
import { MdOutlineDone } from "react-icons/md";
import { AddExp } from '../../Utiils/AddExpFunc'
import { useAddExpense, useEditExpense, useGrpMember } from '../../api/auth'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup";
import { BsCurrencyDollar } from "react-icons/bs";

function EditExpense() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const param=useParams()
  const [searchData, setSearchData] = useState([])
  const [checked, setChecked] = useState(false)
  const [perId, setPerId] = useState()
  const [users, setUsers] = useState([])
  const [callFriGrpApi, setCallFreGrpApi] = useState(false)
  const [show, setShow] = useState(false);
  const { search, groupdetails, groupdId, expenseDet, paidByDet, splitByDet } = useContext(SearchContext)
  const [stateSearch, setSearchValue] = search;
  const [stateGroupDetail, setStateGroupDetail] = groupdetails;
  const [stateExpeDet, setStateExpDet] = expenseDet;
  const [statePaidByDet, setStatePaidByDet] = paidByDet
  const [stateSplitByDet, setStateSplitByDet] = splitByDet
  const [groupId, setGroupId] = groupdId
  const [paidBy, setPaidBy] = useState(()=>{
      if(statePaidByDet.length > 1){
        return "2+people"
      }
      else if (statePaidByDet.id!==localStorage.getItem("loginid")){
        return statePaidByDet.name      
      }
    else{
      return "you"
    }
  }
  )
  const [splitBy, setSpliBy] = useState(stateSplitByDet.filter(i=>i.amount!==stateExpeDet.amount/stateSplitByDet.length).length > 1 ? "unequally" :  "equally")
  const [catimg, setCatImg] = useState("v1659010310/general_2x_hr4nga.png")


  useEffect(() => {
    if (state?.category) {
        setCatImg(state.category.sAvatar)
    }

    if (state?.paidByMember) {
        console.log("fhkdfksjf")
        setPaidBy("2+ people")
        setStatePaidByDet(state.paidByMember)
        if (stateSplitByDet.length > 0) {
            setSpliBy("unequally")
        }
    }
    else if (state?.pername) {
        console.log("if called")
        console.log(state)
        console.log(statePaidByDet)
        setPaidBy(localStorage.getItem("loginid") !== state.perid ? state.pername : "you")
        // setPaidbyId(state.perid)
        setChecked(false)
        setStatePaidByDet({
            id: state.perid,
            name: state.pername
        })
        if (stateSplitByDet.length > 0) {
            setSpliBy("unequally")
        }
    }
    else if (state?.splitMember) {
        console.log("elseif")
        setChecked(false)
        setSpliBy("unequally")
        setStateSplitByDet(state.splitMember)
        if (statePaidByDet.name) {
            setPaidBy(localStorage.getItem("loginid") !== statePaidByDet?.id ? statePaidByDet.name : "you")
        }
        if (statePaidByDet.length > 0) {
            setPaidBy("2+ people")
        }
    }
    // else {
    //     setPaidBy("you")
    //     // console.log("called")
    //     // setChecked(true)
    // }
}, [state])


  //schema for validation
  const schema = yup.object().shape({
    // groupname: yup.string().required("required field"),
    desciption: yup.string().required(),
    amount: yup.number()
      .typeError('you must specify a number')
      .min(1, 'Min value 1.')
  });

  const onSubmit = (data) => {
    let loginid = localStorage.getItem("loginid")
    setShow(true)
    AddExp(statePaidByDet, stateSplitByDet, stateGroupDetail, setUsers, data, perId, loginid, grpmember, state)
    console.log(data, groupId, users)
    //  mutate(grpid,users,data)
  }

  //hook-form
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
    //add-expense api
    const { mutate, isSuccess, isError, error, data } = useEditExpense()

    //put req for expense(Add expense)
    useEffect(() => {
      console.log("called")
      if (users.length > 0) {
          mutate([groupId, users, stateExpeDet, splitBy, state?.category?._id,param.expid])
      }
  }, [users])


  //fetch grpmember of single group
  const { mutate: grpMutate, data: grpmember, isSuccess: isSuccessGrpmember } = useGrpMember()

  useEffect(()=>{
    console.log("called")
    if(!grpmember && groupId !=="62cd74082f9024ac8a092cbb"){
      grpMutate(groupId)
    }
  },[groupId])


  if (isSuccessGrpmember) {
    setSearchValue(grpmember?.oGroupName?.sGroupName)
    setStateGroupDetail(grpmember)
}
 // if expense edit successfully
 if (isSuccess) {
  navigate(`/group/${groupId}`)
  setStateExpDet({
      description: "",
      amount: "",
  })
  setSearchValue("")
  setStateSplitByDet([])
  setStatePaidByDet([])
}

if (isError) {
  setUsers([])
}



  console.log(state,"statesjdh")
  console.log(param)
  // console.log(grpme)
  // console.log(props)
  console.log(statePaidByDet,"paidders")
  console.log(stateSplitByDet,"splitters")
  console.log(stateExpeDet)
  console.log(grpmember)
  console.log(stateGroupDetail)
  // console.log(groupId, users, stateExpeDet, splitBy, state?.category?._id,state.expid)
  return (
    <div className='add-expense-div'>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col xs={2} className='text-start'><BiArrowBack size={30} onClick={() => navigate(-1)} /></Col>
          <Col xs={8} className='text-start fs-4'>Edit expense</Col>
          <Col xs={2} className='text-end'><button type="submit" className='add_new_grp'><MdOutlineDone size={30} /></button>
          </Col>
        </Row>

        <Row className='mt-3'>
          <Col xs={3} className="text-end">with you and:</Col>
          <Col xs={9} className="ps-0">
            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="Enter group-name or friend" value={stateSearch} onChange={(e) => {
                setSearchValue(e.target.value)
                setChecked(true)
              }} />
              <p className='err_msg'>{stateSearch?.length === 0 && "required field"}</p>
              <div className="dropdown">
                <ul className={checked ? "dropdown-menu show mt-3 p-3" : "dropdown-menu p-3"} aria-labelledby="dropdownMenuButton1">
                  {/* <li>{isLoadFriGro && <Spinner animation="border" />}</li> */}
                  {searchData?.oGroups?.length > 0 &&
                    <> <p className='text-secondary'>Groups</p>
                      <div className='mt-3'>
                        {searchData?.oGroups?.map((group) => {
                          return <div className='mt-3' key={group._id}>
                            <li onClick={() => {
                              setSearchValue(group.sGroupName)
                              setChecked(false)
                              setGroupId(group._id)
                              // setAddGrpdata(group)
                              grpMutate(group._id)


                            }}>
                              <img className='grp-frd-icon' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${group.sAvatar}`} alt="grpimg" />
                              <span className='ms-3'>{group.sGroupName}</span>
                            </li>
                          </div>
                        })}
                      </div>
                    </>}

                  {searchData?.oFriends?.length > 0 &&
                    <div className='mt-3'>
                      <p className='text-secondary'>Friends</p>
                      <div className='mt-3'>
                        {searchData?.oFriends?.map((friend) => {
                          return <div className='mt-1' key={friend._id}>
                            <li onClick={() => {
                              setSearchValue(friend.sName)
                              setChecked(false)
                              setGroupId("62cd74082f9024ac8a092cbb")
                              setPerId(friend._id)
                              setStateGroupDetail({
                                id: friend._id,
                                name: friend.sName,
                                avatar: friend.sAvatar
                              })
                              // setAddGrpdata(friend)
                            }}>
                              <img className='grp-frd-icon' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${friend.sAvatar}`} alt="frndimg" />
                              <span className='ms-3'>{friend.sName}</span>
                            </li>
                          </div>
                        })}
                      </div>
                    </div>}
                  {searchData?.oGroups?.length === 0 && searchData?.oFriends?.length === 0 ? "no data available" : null}
                </ul>
              </div>
            </Form.Group>
          </Col>
        </Row>
        <div className='p-5'>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1" onClick={() => navigate("category")}> <img className='exp-cat-icon' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${catimg}`} alt="catimg" /></InputGroup.Text>
            <Form.Control
              placeholder="Enter a description"
              aria-label="Username"
              aria-describedby="basic-addon1"
              autoComplete="off"
              value={stateExpeDet?.description}
              {...register("desciption")}
              onChange={(e) => setStateExpDet(ev => ({
                ...ev,
                description: e.target.value,
              }))}

            />
          </InputGroup><p className='err_msg'>{errors.desciption?.message}</p>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon2"><BsCurrencyDollar size={25} /></InputGroup.Text>
            <Form.Control
              placeholder="0.00"
              aria-label="Username"
              aria-describedby="basic-addon1"
              autoComplete="off"
              value={stateExpeDet?.amount}
              {...register("amount")}
              onChange={(e) => setStateExpDet(ev => ({
                ...ev,
                amount: e.target.value,
              }))}
            />
          </InputGroup><p className='err_msg'>{errors.amount?.message}</p>
          <div className='text-center'>Paid by {"  "}
            <button className='add-exp-btn' onClick={() => navigate('paidby', { state: { amount: stateExpeDet?.amount } })} disabled={stateSearch?.length === 0 ? true : false}>{paidBy} </button>
            and split {"  "}
            <button className='add-exp-btn' onClick={() => navigate('adjust-split', { state: { amount: stateExpeDet?.amount } })} disabled={stateExpeDet.amount.length === 0 ? true : false}>
              {splitBy}
            </button></div>
        </div>
      </Form>

      <ToastMessage isError={isError} error={error} show={show} setShow={setShow} isSuccess={isSuccess} data={data} />
    </div>
  )
}

export default EditExpense