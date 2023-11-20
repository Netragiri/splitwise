import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from '../private_screen/Dashboard'
import AddExpense from '../private_screen/Expense/AddExpense'
import AdjustSplit from '../private_screen/Expense/AdjustSplit'
import Category from '../private_screen/Expense/Category'
import MultiPayer from '../private_screen/Expense/MultiPayer'
import PaidBy from '../private_screen/Expense/PaidBy'
import TotalExpense from '../private_screen/Groups/TotalExpense'
import Friends from '../private_screen/Friends/Friends'
import GroupDetail from '../private_screen/Groups/GroupDetail'
// import Friends from '../private_screen/Friends'
import Groups from '../private_screen/Groups/Groups'
import RequireAuth from '../private_screen/RequireAuth'
import Home from '../public_screen/Home'
import Login from '../public_screen/Login'
import NewPassword from '../public_screen/NewPassword'
import ResetPassword from '../public_screen/ResetPassword'
import Signup from '../public_screen/Signup'
import Balances from '../private_screen/Groups/Balances'
import ExpenseDetail from '../private_screen/Expense/ExpenseDetail'
import EditExpense from '../private_screen/Expense/EditExpense'
import FriendDetail from '../private_screen/Friends/FriendDetail'

function Allroutes() {
  return (
    <>
      <Routes>
        {/* public route */}
        <Route path="/" element={<Home />}></Route>
        <Route path="sign-up" element={<Signup />} />
        <Route path="login" element={<Login />} />
        <Route path='reset-password' element={<ResetPassword />}></Route>
        <Route path="new-password" element={<NewPassword />}></Route>

        {/* private route */}
        <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>}>
          <Route path="/group" element={<Groups />} />
          <Route path="group/:grpid" element={<GroupDetail />} />
          <Route path='group/:grpid/total-expense' element={<TotalExpense />} />
          <Route path='group/:grpid/balances' element={<Balances />} />
          <Route path='exp/:expid' element={<ExpenseDetail />} />
          <Route path='exp/:expid/edit' element={<EditExpense />} />
          <Route path="exp/:expid/edit/category" element={<Category />} />
          <Route path="exp/:expid/edit/paidby" element={<PaidBy />} />
          <Route path="exp/:expid/edit/paidby/multi-payer" element={<MultiPayer />} />
          <Route path='exp/:expid/edit/adjust-split' element={<AdjustSplit />} />
          <Route path="friends" element={<Friends />} />
          <Route path="friends/:friendid" element={<FriendDetail />} />
          {/* <Route path="friends" element={<Friends />}></Route> */}
        </Route>
        {/* <Route path="grouplist/:grpid/add-expense" element={<AddExpense />} /> */}
        <Route path="add-expense" element={<AddExpense />} />
        <Route path="add-expense/category" element={<Category />} />
        <Route path="add-expense/paidby" element={<PaidBy />} />
        <Route path="add-expense/paidby/multi-payer" element={<MultiPayer />} />
        <Route path='add-expense/adjust-split' element={<AdjustSplit />}></Route>


      </Routes>
    </>
  )
}

export default Allroutes