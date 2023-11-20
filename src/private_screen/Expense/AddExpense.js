import React, { useContext, useEffect, useState } from 'react'
import { Row, Col, Spinner } from 'react-bootstrap'
import { MdOutlineDone } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate, useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { fetchFriendsGroups, useAddExpense, useGrpMember } from '../../api/auth';
import { useQuery } from 'react-query';
import "../../assets/css/add-expense.css"
import InputGroup from 'react-bootstrap/InputGroup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import ToastMessage from '../../SharedComponent/ToastMessage';
import { SearchContext } from '../../Context/Add-expenseContext';
import { AddExp } from '../../Utiils/AddExpFunc';
import { BsCurrencyDollar } from "react-icons/bs";

function AddExpense() {
    const navigate = useNavigate()
    const { state } = useLocation()
    // const param = useParams()
    const [searchData, setSearchData] = useState([])
    const [checked, setChecked] = useState(false)
    const [perId, setPerId] = useState()
    const [users, setUsers] = useState([])
    const [show, setShow] = useState(false);
    const { search, groupdetails, groupdId, expenseDet, paidByDet, splitByDet } = useContext(SearchContext)
    const [paidBy, setPaidBy] = useState("you")
    const [splitBy, setSpliBy] = useState("equally")
    const [stateSearch, setSearchValue] = search;
    const [stateGroupDetail, setStateGroupDetail] = groupdetails;
    const [stateExpeDet, setStateExpDet] = expenseDet;
    const [statePaidByDet, setStatePaidByDet] = paidByDet
    const [stateSplitByDet, setStateSplitByDet] = splitByDet
    const [groupId, setGroupId] = groupdId
    const [catimg, setCatImg] = useState("v1659010310/general_2x_hr4nga.png")



    // console.log(param.grpid)
    // console.log(state?.splitMember, "statesss")
    // clg
    console.log(state, "states")
    console.log(statePaidByDet, "payerssssss")
    console.log(stateSplitByDet, "splitters")
    // console.log(searchData)
    // console.log(statePaidByDet)
    // console.log(stateSplitByDet)
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

            if (statePaidByDet.length > 0) {
                setPaidBy("2+ people")
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
        else {
            setPaidBy("you")
            // console.log("called")
            // setChecked(true)
        }
    }, [state])

    //fetch friends and greoups
    const { isLoading: isLoadFriGro } = useQuery(["friends-groups", stateSearch], () => fetchFriendsGroups(stateSearch), {
        onSuccess: (data) => {
            console.log(data)
            setSearchData(data);
        },
        // enabled:callFriGrpApi,
        refetchOnMount: false,
        retry: 0,
        refetchOnWindowFocus: false
    });

    // console.log(callFriGrpApi)
    //if search length > 0 then this api should call
    // useEffect(()=>{
    //     if(stateSearch.length >0){
    //         setCallFreGrpApi(true)
    //     }
    // },[stateSearch])


    //schema for validation
    const schema = yup.object().shape({
        // groupname: yup.string().required("required field"),
        desciption: yup.string().required(),
        amount: yup.number()
            .typeError('you must specify a number')
            .min(1, 'Min value 1.')
    });

    //onsubmit add expense req
    const onSubmit = (data) => {
        let loginid = localStorage.getItem("loginid")
        setShow(true)
        AddExp(statePaidByDet, stateSplitByDet, stateGroupDetail, setUsers, data, perId, loginid, grpmember, state)
        console.log(data, groupId, users)
        //  mutate(grpid,users,data)
    }

    //post req for expense(Add expense)
    useEffect(() => {
        console.log("called")
        if (users.length > 0) {
            mutate([groupId, users, stateExpeDet, splitBy, state?.category?._id])
        }
    }, [users])


    //hook-form
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });


    //add-expense api
    const { mutate, isSuccess, isError, error, data } = useAddExpense()

    // if expense added successfully
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

    //fetch group members of selected group
    const { mutate: grpMutate, data: grpmember, isSuccess: isSuccessGrpmember } = useGrpMember()


    //setgroupname to search
    if (isSuccessGrpmember) {
        setSearchValue(grpmember?.oGroupName?.sGroupName)
        setStateGroupDetail(grpmember)
    }


    
    //add expense with page from individual group
    // useEffect(() => {
    //     console.log("called")
    //     if (param.grpid) {
    //         grpMutate(param.grpid)
    //         setSearchValue(grpmember?.sGroupName)
    //         setChecked(false)
    //         setGroupId(param.grpid)
    //     }
    // }, [param.grpid])


    // console.log(stateExpeDet,"desc amount")
    // console.log(stateGroupDetail, "grpdetails")
    // console.log(grpmember, "grpmembner")
    // console.log(users, "grpMembersId")
    // console.log(groupId, "idd")
    // console.log(stateGroupDetail)
    return (
        <div className='p-3 add-expense-div'>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col xs={2} className='text-start'><BiArrowBack size={30} onClick={() => navigate("/group")} /></Col>
                    <Col xs={8} className='text-start fs-4'>Add expense</Col>
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
                                    <li>{isLoadFriGro && <Spinner animation="border" />}</li>
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
                        <button className='add-exp-btn' onClick={() => navigate('paidby', { state: { amount: stateExpeDet?.amount } })} disabled={stateSearch?.length === 0 ? true : false}>{paidBy}</button>
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

export default AddExpense