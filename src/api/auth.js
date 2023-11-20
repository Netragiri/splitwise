import { useMutation } from 'react-query'
import { baseUrl, encryption } from './baseURL'
import { useQueryClient } from "react-query";
// import jwt from 'jwt-decode';
// import jwt from 'jsonwebtoken';

//register user
const adduser = (userdata) => {
    console.log(userdata)
    return baseUrl.post('/register', {
        sName: userdata.full_name,
        sEmail: userdata.email,
        sPassword: encryption(userdata.password)
    })
}
export const useAdduserdata = () => {
    return useMutation(adduser)
}

//login user
const loginuser = (userdata) => {
    // const { sign, verify } = jwt;
    // console.log(res.data.sToken)
    return baseUrl.post('/login', {
        sEmail: userdata.email,
        sPassword: encryption(userdata.password)
    }).then(res => {
        localStorage.setItem("token", res.data.sToken)
        // localStorage.setItem("loginid", "62a05dea201c7bfd68aabdc0")
        // console.log(jwt.decode(res.data.sToken) )
        // console.log(jwt.verify(res.data.sToken, 'jayakravadra'))
        //   console.log(decoded) // bar
        // navigate("/dashboard")
    })

}
export const useLogindata = () => {
    return useMutation(loginuser)
}

//reset-password
const resetpass = (data) => {
    return baseUrl.post('/forgotpassword', {
        sEmail: data.email,
    })
}

export const useResetPass = () => {
    return useMutation(resetpass)
}


//new-password
const newpass = (data) => {
    console.log(data)
    return baseUrl.post('/resetpassword', {
        sNewPassword: encryption(data.password),
        sConfirmPassword: encryption(data.confirmPassword),
        sToken: localStorage.getItem("token"),
    })
}
export const useNewPass = () => {
    return useMutation(newpass)
}



//fetch group-list
export const Grouplist = async (payload) => {
    const token = localStorage.getItem("token");
    const {
        data
    } = await baseUrl.get(
        `/usergrouplist?limit=${payload.limit}&search=${payload.search}&skip=${payload.skip}&filterByowed=${payload.filterByowed}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
};


//add new group
//reset-password
const addgroup = (formData) => {
    const token = localStorage.getItem("token");
    return baseUrl.post('/creategroup', formData, { headers: { Authorization: `Bearer ${token}` } })
}

export const useAddGroup = () => {
    return useMutation(addgroup)
}

// //fetch group-details
// export const fetchGroupDetail = async (grpid,payload) => {
//     const token=localStorage.getItem("token")
//     const {data} = await baseUrl.get( `/group-detail/${grpid}?limit=${payload.limit}&skip=${payload.skip}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//         );
//      return data
// }

// export const useGroupDeatil = (grpid,payload) => {
//     console.log(payload)
//     // console.log(grpid)
//     return useQuery(["group-detail",payload],()=> fetchGroupDetail(grpid,payload),{
//         retry: 0,
//         refetchOnWindowFocus: false,
//         // refetchOnMount: false,
//       })
// }


//fetch individual group-detail
export const fetchGroupDetail = async (grpid, payload) => {
    const token = localStorage.getItem("token");
    const {
        data
    } = await baseUrl.get(
        `/group-detail/${grpid}?limit=${payload.limit}&skip=${payload.skip}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
};

//fetch friends and groups of loggedin user
export const fetchFriendsGroups = async (search) => {
    const token = localStorage.getItem("token");
    console.log(search)
    const {
        data
    } = await baseUrl.get(
        `/friends-groups?search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
};


//add expense
const addExpense = (data) => {
    console.log(data,"api data")
    const token = localStorage.getItem("token");
    return baseUrl.post('/addexpence', {
        sDescription: data[2].description,
        nTotalPaidAmount: +data[2].amount,
        iGroupId: data[0],
        iExpenceCategory: data[4],
        eSplitMethod: data[3],
        aUsers: [...data[1]]
    }, { headers: { Authorization: `Bearer ${token}` } })
}

export const useAddExpense = () => {
    return useMutation(addExpense)
}

//edit expense
const editExpense = (data) => {
    console.log(data,"api data")
    const token = localStorage.getItem("token");
    return baseUrl.put(`/editexpence/${data[5]}`, {
        sDescription: data[2].description,
        nTotalPaidAmount: +data[2].amount,
        iGroupId: data[0],
        iExpenceCategory: data[4],
        eSplitMethod: data[3],
        aUsers: [...data[1]]
    }, { headers: { Authorization: `Bearer ${token}` } })
}

export const useEditExpense = () => {
    return useMutation(editExpense)
}

//fetch group members
export const fetchGroupMembers = async (grpid) => {
    // console.log('1',grpid)
    const token = localStorage.getItem("token");
    const {
        data
    } = await baseUrl.get(
        `/groupmembers/${grpid}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
};

export const useGrpMember=()=>{
    return useMutation(fetchGroupMembers,{mutationKey:"grpmembers"})
}


export const useGetFetchQuery = (name) => {
    const queryClient = useQueryClient();
    // console.log(queryClient)

    return queryClient.getQueryData(name);
};

//login user details
export const loginUserdata = async () => {
    // console.log('1',grpid)
    const token = localStorage.getItem("token");
    const {
        data
    } = await baseUrl.get(
        "/profile",
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
};

//Main category for expense 
export const MainCatExp = async () => {
    const token = localStorage.getItem("token");
    const {
        data
    } = await baseUrl.get(
        "/categorylist",
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
};

//Sub category list
export const SubcatExp = async (search) => {
    const token = localStorage.getItem("token");
    const {
        data
    } = await baseUrl.get(
        `/subcategorylist?search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
};

//fetch total-expense in group
export const fetchTotalGrpExp=async(grpid,search)=>{
    const token = localStorage.getItem("token");
    const {
        data
    } = await baseUrl.get(
        `/total-expence/${grpid}?filterByMonth=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
}


//fetch total-expense in group
export const fetchBalances=async(grpid)=>{
    const token = localStorage.getItem("token");
    const {
        data
    } = await baseUrl.get(
        `/groupbalance/${grpid}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
}


//fetch single expense detail
export const fetchExpDetail=async(expid)=>{
    const token = localStorage.getItem("token");
    const {
        data
    } = await baseUrl.get(
        `/expence/${expid}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
}

//frtch friend list 
export const friendList = async (payload) => {
    const token = localStorage.getItem("token");
    const {
        data
    } = await baseUrl.get(
        `/friends?limit=${payload.limit}&search=${payload.search}&skip=${payload.skip}&filterByowed=${payload.filterByowed}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
};


//fetch individual friend-detail
export const fetchFriendDetail = async (friendid, payload) => {
    const token = localStorage.getItem("token");
    const {
        data
    } = await baseUrl.get(
        `/frienddetail/${friendid}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
};