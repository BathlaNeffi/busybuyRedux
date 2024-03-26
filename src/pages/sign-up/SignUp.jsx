import{ useNavigate} from "react-router-dom";
import styles from "./SignUp.module.css";
import { useState } from "react";
import { createUserAsync } from "../../redux/reducers/usersReducer";
import { useDispatch } from "react-redux";



export default function SignUp(){
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const [user,setUser]=useState({name:"", email:"",password:""});


    function createUser(e){
        e.preventDefault();
        const status= dispatch(createUserAsync({...user}));

        status.then(
            (result) => { 
            //    console.log(result.payload);
               (result.payload?navigate("/sign-in"):navigate("/sign-up"))
            },
            (error) => { 
               console.log(error);
            }
          );

    }


    return(
        <>
        <div className={styles.formWrapper}>
            <form onSubmit={(e)=>{createUser(e)}}>
                <h2 className={styles.formHeading}>Sign Up</h2>
                <input className={styles.formInput} type="text" name="name" placeholder="Enter Name" required value={user.name} onChange={(e)=>{setUser({...user,name:e.target.value})}}  />
                <input className={styles.formInput} type="text" name="email"placeholder="Enter Email"required value={user.email} onChange={(e)=>{setUser({...user,email:e.target.value})}} />
                <input className={styles.formInput} type="password" name="password" placeholder="Enter Password"  required value={user.password} onChange={(e)=>{setUser({...user,password:e.target.value})}} />
                <input className={styles.btn} type="submit" value="Sign Up" />
            </form>
        </div>
        </>
    )
}