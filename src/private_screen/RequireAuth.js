import React from 'react'
import { Navigate } from 'react-router-dom'


function RequireAuth({children}) {
    const token=localStorage.getItem("token")
    if(!token){
        return <Navigate to="/login"  replace={true}/>
    }
  return children 
}

export default RequireAuth