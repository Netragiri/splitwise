import React from 'react'
import { Col, Row, Spinner } from 'react-bootstrap'
import { BiArrowBack } from "react-icons/bi";
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTotalGrpExp } from '../../api/auth';
import Dropdown from 'react-bootstrap/Dropdown';
import "../../assets/css/group.css"
import { useState } from 'react';

function TotalExpense() {
    const navigate = useNavigate()
    const param = useParams()
    const [filterMonth, setFilterMonth] = useState("THIS MONTH")
    const [search,setSearch]=useState(0)
    const [data, setData] = useState({})
    console.log(param)

    const { isLoading } = useQuery(["total-expense",search], () => fetchTotalGrpExp(param.grpid,search), {
        onSuccess: (data) => {
            setData(data)
        },
        retry: 0,
        refetchOnWindowFocus: false,
        // refetchOnMount: false,
    });

    return (
        <div className='total-expense'>
            <Row>
                <Col xs={2} className='text-start'><button className='back_btn'><BiArrowBack size={30} onClick={() => navigate(-1)} /></button> </Col>
                <Col xs={10} className='text-start fs-4'>Group spending summary</Col>
            </Row>


            <div className='p-3'>
                <div className='mt-3'>
                    <h4>{data?.oGroupName?.sGroupName}</h4>
                </div>

                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {filterMonth}{"  "}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => {
                            setFilterMonth("THIS MONTH")
                            setSearch(0)
                        }}>THIS MONTH</Dropdown.Item>
                        <Dropdown.Item onClick={() => {
                            setFilterMonth("LAST MONTH")
                            setSearch(1)
                        }}>LAST MONTH</Dropdown.Item>
                        <Dropdown.Item onClick={() => {
                            setFilterMonth("ALL TIME")
                            setSearch(2)
                        }}>ALL TIME</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <div className='mt-3'>
                    <h6>TOTAL GROUP SPENDING</h6>
                    <h5>${" "}{data?.oTotalExpence?.nTotalGroupSpending?.toFixed(2)}</h5>
                </div>
                <div className='mt-4'>
                    <h6>TOTAL YOU PAID FOR</h6>
                    <h5>${" "}{data?.oTotalYouPaid?.nTotalYouPaid?.toFixed(2)}</h5>
                </div>
                <div className='mt-4'>
                    <h6>YOUR TOTAL SHARE</h6>
                    <h5>${" "}{data?.oTotalYourShare?.nTotalYourShare?.toFixed(2)}</h5>
                </div>
            </div>
        </div>
    )
}

export default TotalExpense