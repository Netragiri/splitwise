// import logo from './logo.svg';
// import './App.css';
import "../src/assets/css/app.css"
import Allroutes from "./Utiils/Allroutes";
import {QueryClientProvider, QueryClient} from "react-query"
import { useState } from "react";
import { SearchContext } from "./Context/Add-expenseContext";
import * as Sentry from "@sentry/react";



const queryClient=new QueryClient();

function App() {
  const [search,setSearch]=useState("")
  const [groupdetails,setGroupdetails]=useState([])
  const [groupId,setGroupId]=useState("")
  const [expenseDet,setExpensedet]=useState({
    description:"",
    amount:"",
  })
  const [loginUserData,setLoginUserData]=useState({})
  const [paidByDet,setPaidByDet]=useState([])
  const [splitByDet,setSplitByDet]=useState([])
  return (
    <QueryClientProvider client={queryClient}>
      <SearchContext.Provider  value={{ search: [search, setSearch], groupdetails: [groupdetails, setGroupdetails],groupdId: [groupId, setGroupId],          expenseDet: [expenseDet,setExpensedet],loginUserData: [loginUserData,setLoginUserData],paidByDet: [paidByDet,setPaidByDet],splitByDet:[splitByDet,setSplitByDet] }}>
    <div className="App">
      <Allroutes />
    </div>
    </SearchContext.Provider>
    </QueryClientProvider>
  );
}

export default Sentry.withProfiler(App);