import{Link,useNavigate} from "react-router-dom";
import styles from "./SignIn.module.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createSessionAsync , getInitialUsersAsync } from "../../redux/reducers/usersReducer";

export default function SignIn(){

    const [user,setUser]=useState({email:"",password:""});
    const navigate=useNavigate();
    const dispatch=useDispatch();

    useEffect(()=>{
        dispatch(getInitialUsersAsync());
    },[dispatch])

    async function handelSubmit(e){
        e.preventDefault();
        const status=dispatch(createSessionAsync(user));
        
        status.then(
            (resolve)=>{
                // console.log(resolve);
                resolve.payload?navigate('/'):navigate('/sign-in')
            }
        )
        setUser({email:"",password:""});
    }

    return(
        <>
        <div className={styles.formWrapper}>
            <form onSubmit={(e)=>{handelSubmit(e)}}>
                <h2 className={styles.formHeading}>Sign In</h2>
                <input className={styles.formInput} type="text" placeholder="Enter Email" required value={user.email} onChange={(e)=>{setUser({...user,email:e.target.value})}}/>
                <input className={styles.formInput} type="password" placeholder="Enter Password" required value={user.password} onChange={(e)=>{setUser({...user,password:e.target.value})}} />
                <input className={styles.btn} type="submit"  value="Sign In"/>
            <Link  className={styles.signUpText} to="/sign-up">  Or Sign up instead? </Link>
            </form>
        </div>
        </>
    )
}