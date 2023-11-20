import React, { useContext, useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "../assets/css/dashboard.css"
import Button from 'react-bootstrap/esm/Button';
import { Outlet, useLocation, useNavigate, useParams} from 'react-router-dom';
import { BsPeople } from "react-icons/bs";
import { BsPerson } from "react-icons/bs";
import { BsGraphUp } from "react-icons/bs";
import { BsPersonCircle } from "react-icons/bs";
import { MdOutlineStickyNote2 } from "react-icons/md";
import { MdOutlineGroupAdd } from "react-icons/md";
import { MdSearch } from "react-icons/md";
import AddGroup from './Groups/AddGroup';
import { loginUserdata } from '../api/auth';
import { useQuery } from 'react-query';
import { SearchContext } from '../Context/Add-expenseContext';

function Dashboard() {
  const [activebtn,setActivebtn]=useState("groups")
  const navigate=useNavigate()
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [showSearchbar,setShowSearchbar]=useState(false)
  const [search,setSearch]=useState("")
  const param=useParams()
  const {loginUserData}=useContext(SearchContext)
  const [loginUseDet,setLoginUseDet]=loginUserData
  // const navigate=useNavigate()
  const location=useLocation()

 const {isSuccess,data}= useQuery("login-user-data", () => loginUserdata(),{
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });


  useEffect(()=>{
    if(isSuccess){
      setLoginUseDet(data)
      localStorage.setItem("loginDetails",JSON.stringify(data.oUser))
      localStorage.setItem("loginid",data.oUser._id)
    }
  },[isSuccess])

// console.log(loginUseDet)
console.log(location.pathname,"locationnn")
  // console.log(location.pathname)
  // console.log(param.grpid)
  // console.log(search)
  return (
    <>
    {location.pathname==="/group" && <div className='p-3'>
      <Row>
        <Col xs={10}>
          {showSearchbar && 
          <input type="search" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search by group-name"></input>
      }
        </Col>
        <Col xs={1}> <MdSearch size={30} className='' onClick={()=>setShowSearchbar(!showSearchbar)} /></Col>
        <Col xs={1}><MdOutlineGroupAdd size={30} onClick={() => setShow(true)} /></Col>
      </Row>
     </div>  }
    
    <div className={location.pathname==="/group" ? 'p-3 outlet_div':'without-header-div p-4' } id="groupsection">
      <Outlet context={[search]} />
    </div>
      <div  className='dashboard p-1'>
        {location.pathname==="/group" || param.grpid || location.pathname==="/friends" ?
        <Button className='add_expense_btn' onClick={()=>{
          if(param.grpid){
            navigate("add-expense",{state:{paramGrpId:param.grpid}})
          }else{
            navigate("add-expense")}
          }
          }><MdOutlineStickyNote2 size={25} className="me-2"/>Add expense</Button> : null}
      <Container>
      <Row>
        <Col><Button className={location.pathname==="/group" || param.grpid ? "main_cat_btn shadow-none" : "default_btn shadow-none"} 
        onClick={()=>{
          navigate("/group")
          
        }}><BsPeople /><p>Groups</p></Button></Col>
        <Col><Button className={location.pathname==="/friends" || param.friendid ? "main_cat_btn shadow-none" : "default_btn shadow-none"}
         onClick={()=>{
         setActivebtn("/friends")
         navigate("/friends")
         }
         }><BsPerson /><p>Friends</p></Button></Col>
        <Col><Button className={location.pathname==="/activity" ? "main_cat_btn shadow-none" : "default_btn shadow-none"} onClick={()=>setActivebtn/("activity")}><BsGraphUp /><p>Activity</p></Button></Col>
        <Col><Button className={location.pathname==="/account" ? "main_cat_btn shadow-none" : "default_btn shadow-none"}onClick={()=>setActivebtn("/account")}><BsPersonCircle /><p>Account</p></Button></Col>
      </Row>
    </Container>
      </div>
    
      <AddGroup show={show} onHide={handleClose} setShow={setShow} />
    </>
  )
}

export default Dashboard