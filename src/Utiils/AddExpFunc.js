export const AddExp=(statePaidByDet,stateSplitByDet,stateGroupDetail,setUsers,data,perId,loginid,grpmember,state)=>{
    //multi payers and split unequally
    if (statePaidByDet.length > 0 && stateSplitByDet.length > 0) {
        console.log("djskadkaj")
        //multi payers and split unequally in group expense
        if (stateGroupDetail.aGroups) {
            stateGroupDetail.aGroups.map((i) =>
                setUsers(currentArray => [...currentArray, {
                    "iUserId": i._id,
                    "nPaidAmount": +statePaidByDet.find(item => item.id === i._id).amount,
                    "nOwedAmount": +stateSplitByDet.find(item => item.id === i._id).amount
                }]))
        }
        //multi payers and split uneually in non-grp expense
        else if (stateGroupDetail.name) {
            console.log("jksdhk")
            console.log(statePaidByDet)
            console.log(stateSplitByDet)
            setUsers([
                {
                    "iUserId": statePaidByDet[0].id,
                    "nPaidAmount": +statePaidByDet[0].amount,
                    "nOwedAmount": +stateSplitByDet[0].amount
                },

                {
                    "iUserId": statePaidByDet[1].id,
                    "nPaidAmount": +statePaidByDet[1].amount,
                    "nOwedAmount": +stateSplitByDet[1].amount
                }
            ])
        }
    }

    //multi payers
    else if (statePaidByDet.length > 0) {
        console.log("dkshkj")
        //multi payers in group split eually in group
        if (stateGroupDetail.aGroups) {
            stateGroupDetail.aGroups.map((i) =>
                // console.log(state.splitMember.find(item=>item.id===i._id).amount),
                setUsers(currentArray => [...currentArray, {
                    "iUserId": i._id,
                    "nPaidAmount": +statePaidByDet.find(item => item.id === i._id).amount,
                    "nOwedAmount": data.amount / stateGroupDetail.nTotalMembers
                }]))
        }
        //multi payers in non-grp split equally
        else if (stateGroupDetail.name) {

            setUsers([
                {
                    "iUserId": statePaidByDet[0].id,
                    "nPaidAmount": +statePaidByDet[0].amount,
                    "nOwedAmount": data.amount / 2
                },

                {
                    "iUserId": statePaidByDet[1].id,
                    "nPaidAmount": +statePaidByDet[1].amount,
                    "nOwedAmount": data.amount / 2
                }
            ])
        }

    }
    //paid bye other and split uneually
    else if (statePaidByDet && stateSplitByDet.length > 0) {
        console.log("fhsfsf")
        if (stateGroupDetail.aGroups) {
            stateGroupDetail.aGroups.map((i) =>
                // console.log(state.splitMember.find(item=>item.id===i._id).amount),
                setUsers(currentArray => [...currentArray, {
                    "iUserId": i._id,
                    "nPaidAmount": statePaidByDet.length===0 ? localStorage.getItem("loginid")===i._id && data.amount :i._id === statePaidByDet.id ? data.amount : 0,
                    "nOwedAmount": +stateSplitByDet.find(item => item.id === i._id).amount
                }]))
        }
        //paid by one and split uneually in non-grp expense
        else if (stateGroupDetail.name) {
            console.log(stateSplitByDet)
            console.log(statePaidByDet)
            setUsers([
                {
                    "iUserId": stateSplitByDet[0]?.id,
                    "nPaidAmount": statePaidByDet.length === 0 ? localStorage.getItem("loginid")===stateSplitByDet[0]?.id ? data.amount : 0 : stateSplitByDet[0].id===statePaidByDet?.id ? data.amount :0,
                    "nOwedAmount": +stateSplitByDet[0].amount
                },

                {
                    "iUserId": stateSplitByDet[1].id,
                    "nPaidAmount": statePaidByDet.length === 0 ? localStorage.getItem("loginid")===stateSplitByDet[1].id && data.amount : stateSplitByDet[1].id===statePaidByDet.id ? data.amount :0,
                    "nOwedAmount": +stateSplitByDet[1].amount
                }
            ])
        }
    }
    //paid by one and split equally
    else if (state?.perid) {
        console.log("fdsfds")
        //paid by one and split equally in group expense
        if (stateGroupDetail?.aGroups) {
            stateGroupDetail.aGroups.map((i) =>
                setUsers(currentArray => [...currentArray, {
                    "iUserId": i._id,
                    "nPaidAmount": i._id === state.perid ? data.amount : 0,
                    "nOwedAmount": data.amount / stateGroupDetail.nTotalMembers
                }]))
        }

        //paid by one and split equally in non-grp
        else if (stateGroupDetail.name) {
            console.log("klksdai")
            console.log(stateGroupDetail)
            console.log(statePaidByDet)
            setUsers([
                {
                    "iUserId": loginid,
                    "nPaidAmount": loginid === statePaidByDet.id ? data.amount : 0,
                    "nOwedAmount": data.amount / 2
                },

                {
                    "iUserId": stateGroupDetail.id,
                    "nPaidAmount": stateGroupDetail.id === statePaidByDet.id ? data.amount : 0,
                    "nOwedAmount": data.amount / 2
                }
            ])
        }

    }
    else if (state?.splitMember) {
        console.log("fjhdjkg")
        stateGroupDetail.aGroups.map((i) =>
            // console.log(state.splitMember.find(item=>item.id===i._id).amount),
            setUsers(currentArray => [...currentArray, {
                "iUserId": i._id,
                "nPaidAmount": i._id === localStorage.getItem("loginid") ? data.amount : 0,
                "nOwedAmount": +state.splitMember.find(item => item.id === i._id).amount
            }]))

    }
    else {
        //non-group expense
        console.log("dfjsf")
        if (perId) {
            setUsers([
                {
                    "iUserId": loginid,
                    "nPaidAmount": data.amount,
                    "nOwedAmount": data.amount / 2
                },

                {
                    "iUserId": perId,
                    "nPaidAmount": 0,
                    "nOwedAmount": data.amount / 2
                }
            ])
        }
        else {
            console.log("else called")
            //group-wise expense
            // grpmember.aGroups.map((i) =>
            //     setUsers(currentArray => [...currentArray, {
            //         "iUserId": i._id,
            //         "nPaidAmount": i._id === localStorage.getItem("loginid") ? data.amount : 0,
            //         "nOwedAmount": data.amount / grpmember.nTotalMembers
            //     }])
            // )
        }
    }
}