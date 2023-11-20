import React, { useEffect, useState } from 'react'
import { Col, Form, Row,Spinner } from 'react-bootstrap';
import { set } from 'react-hook-form';
import { BiArrowBack } from "react-icons/bi";
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { MainCatExp, SubcatExp } from '../../api/auth';


function Category() {
  const navigate = useNavigate()
  const [mainCat, setMainCat] = useState([])
  const [subCat, setSubCat] = useState([])
  const [search, setSearch] = useState("")


  //get main-category name
  const { isLoading, isSuccess } = useQuery(["main-cat-list"], () => MainCatExp(), {
    onSuccess: (data) => {
      console.log(data)
      setMainCat(data.aSubCategory)
    },
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });


  const { isError } = useQuery(["sub-cat-list", search], () => SubcatExp(search), {
    onSuccess: (data) => {
      console.log(data)
      setSubCat(data.aSubCategory)
    },
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const handleClick=(cat)=>{
    console.log(cat)
    navigate("/add-expense",{state:{category:cat}})
  }




  console.log(mainCat)
  console.log(subCat)
  return (
    <div className='p-3'>
      <Row>
        <Col xs={1} className='text-start'><BiArrowBack size={30} onClick={() => navigate(-1)} /></Col>
        <Col xs={11}>
          <Form.Group className="mb-3">
            <Form.Control type="text" placeholder="Search or select a category" value={search} onChange={(e) => {
              setSearch(e.target.value)
            }} />
          </Form.Group>
        </Col>
      </Row>
      <div>
        {mainCat?.map((i) => (
          //this filter is for not showing the cat which is not in the searched subcategory
          <div key={i._id}>
          {isLoading && <Spinner animation="border" role="status"></Spinner>}
          {subCat.some(cat=>cat.iCategoryId===i._id) && 
          <Row key={i._id} className="p-3">
            <p className='fw-bold fs-5 px-0'>
              {i.sName}
              </p>
            <div>
              {subCat.some(cat=>cat.iCategoryId===i._id) && subCat.filter(item => item.iCategoryId === i._id).map((cat) => {
                return <Row key={cat._id} className="py-2" onClick={()=>handleClick(cat)}>
                  <Col xs={1} className="ps-0"> <img className='cat-icon' src={`https://res.cloudinary.com/dc1ck5lh8/image/upload/${cat.sAvatar}`} alt="catimg" /></Col>
                  <Col xs={9} className="mx-3">{cat.sName}</Col>
                </Row>
              })}

            </div>
          </Row>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Category