import { NavLink, Outlet  } from "react-router-dom";
import styles from "./Nav.module.css";
import { useDispatch, useSelector } from "react-redux";
import { userDestroySessionAnsync, userSelector } from "../../redux/reducers/usersReducer";
export default function Nav (){
    const userId=null;
    const {isLoggedIn,userLoggedIn}=useSelector(userSelector);
    const dispatch=useDispatch();
    function logout(){
        // isLoggedIn ? dispatch(userDestroySessionAnsync()):undefined ;
        if(isLoggedIn){
            dispatch(userDestroySessionAnsync())
        }
    }
    return(
        <>
        <div className={styles.container}>
        <span >
            <NavLink className={styles.brand} to="/">Busy Buy</NavLink></span>
        <div className={styles.btnWarpper}>
            <div >
                <NavLink className={styles.btn} to="/"> 
                <img src="https://cdn-icons-png.flaticon.com/128/2544/2544056.png" alt="Home button" />
                <p>Home</p>
                </NavLink>
            </div>
            {isLoggedIn?
            <>
            <div >
                <NavLink className={styles.btn} to="/orders"  > 
                <img src="https://cdn-icons-png.flaticon.com/128/3142/3142578.png" alt="Orders  button"  />
                <p>Orders</p>
                </NavLink>
            </div>
            <div >
                <NavLink className={styles.btn} to="/cart"  > 
                <img src="https://cdn-icons-png.flaticon.com/128/4290/4290854.png" alt="Cart  button"  />
                <p>Cart</p>
                </NavLink>
            </div>
            </>
            : undefined 

            }
            <div >
                <NavLink className={styles.btn} to="/sign-in"  onClick={logout} > 
                <img src="https://cdn-icons-png.flaticon.com/128/1176/1176390.png" alt="Sign In  button"  />
                <p>{isLoggedIn?"logout":"Sign-In"}</p>
                </NavLink>
            </div>
           
        </div>
        </div>
        <Outlet/>
        </>
    )
}