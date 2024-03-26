import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../../firebaseInit";
import { serverTimestamp, doc , setDoc,collection, getDocs } from "firebase/firestore"; 
import { getAuth, createUserWithEmailAndPassword,} from 'firebase/auth';
import { toast } from 'react-toastify';


import 'react-toastify/dist/ReactToastify.css';
const initialState={
    userList:[],
    isLoggedIn:false,
    userLoggedIn:null
}

const auth=getAuth();

export const getInitialUsersAsync=createAsyncThunk(
    'user/usersList',
    async (args,thunkApi)=>{
        const querySnapshot = await getDocs(collection(db, "busybuy-redux"));
       const users= querySnapshot.docs.map((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id);
        return {
            id:doc.id,
            ...doc.data()
        }
        });
        thunkApi.dispatch(userAction.setUsersList(users));
});



export const createSessionAsync=createAsyncThunk(
    'user/createSession',
    async(data, thunkAPI)=>{
        const {userReducer}=thunkAPI.getState();
        const {userList}=userReducer;
        const index=userList.findIndex((item)=> item.user.email=== data.email);
        if(index === -1){
            toast.error("Email does not exist, Try again or SignUp Instead!!!");
            return false;
        }

        if(userList[index].user.password === data.password){

            toast.success("Sign In Successfully!!!");
            
            // logging in user and storing its data in local variable
            thunkAPI.dispatch(userAction.setLoggedIn(true));
            thunkAPI.dispatch(userAction.setUserLoggedIn(userList[index]));
            
            // generating user's login token and store user's data 
            window.localStorage.setItem("token",true);
            window.localStorage.setItem("index",JSON.stringify(userList[index]));
            return true;
        }
        else{
            // if password doesn't match in database
            toast.error("Wrong UserName/Password, Try Again");
            return false;
        }

    }
)



export const createUserAsync=createAsyncThunk(
    'user/createUser',
    async (payload)=>{
        try{
            const userCredential= await createUserWithEmailAndPassword(auth, payload.email, payload.password);
            const newUser = userCredential.user;
              console.log('User signed up successfully!');
              toast.success("User signed up successfully!");
              console.log('New User ID:', newUser.uid);
             await setDoc(doc(db, "busybuy-redux",newUser.uid), {
                  user:payload,
                  cart:[],
                  order:[],
                  timestamp: serverTimestamp() 
                });
              return true;
        }catch(error){
            const errorMessage=error.message;
            const startIndex = errorMessage.indexOf("(") + 1;
            const lastIndex= errorMessage.indexOf(")");
            toast.error(errorMessage.substring(startIndex,lastIndex), {position: "top-right",},{ autoClose: 2000 });
            return false;
        }
    
    }
);

export const userDestroySessionAnsync=createAsyncThunk(
    'user/destroySession',
    ()=>{
        
        window.localStorage.clear();
    }
)

export const usersSlice=createSlice({
    name:'users',
    initialState:initialState,
    reducers:{
        setUsersList:(state,action)=>{
            // console.log(action.payload);
           state.userList=action.payload;
        },
        setLoggedIn:(state,action)=>{
            state.isLoggedIn=action.payload;
        },
        setUserLoggedIn:(state,action)=>{
            state.userLoggedIn=action.payload
        }
    },extraReducers:(builder)=>{
        builder.addCase(userDestroySessionAnsync.fulfilled,(state,action)=>{
            state.isLoggedIn=false;
            state.userLoggedIn=null;
            toast.success("Sign Out successfully!!!!");
        })
    }

});

export const userReducer=usersSlice.reducer;
export const userSelector=(state)=> state.userReducer;
export const userAction=usersSlice.actions;
