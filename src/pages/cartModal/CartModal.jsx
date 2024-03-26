import styles from "./CartModal.module.css";
import CartItem from "../../components/cartItems/CartItem";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInitialCartOrdersThunk, productSelector, purchaseAllThunk } from "../../redux/reducers/productsReducer";
// import { userSelector } from "../../redux/reducers/usersReducer";

export default function CartModal(){
    // const{cart, totalPrice,  handelPurchase, onstart}=useUserValue();
    const {cart ,totalAmount,itemsInCart}=useSelector(productSelector);
    // const {isLoggedIn}=useSelector(userSelector);
    const dispatch=useDispatch();
        useEffect(()=>{
            
            dispatch(getInitialCartOrdersThunk());
            setTimeout(()=>{
                setLoading(false);
            },300);
        },[dispatch]);

        const [isLoading,setLoading]=useState(true);



        function handelPurchase(){
            dispatch(purchaseAllThunk());
        }
    return<>
    {isLoading?"Loding...":
    <div className={styles.cartOuterContainer}>
        <div className={styles.totalBox}>
            <h3>Total price &#8377; {totalAmount}</h3>
            <h3>Total Items {itemsInCart}</h3>
            <button className={styles.purchaseBtn} onClick={handelPurchase}>Purchase</button>
        </div>

    <div className={styles.itemsOuterContainer}>
        {cart.length>0? cart.map((item,i)=><CartItem item={item} key={i}/>):<><h1>Empty Cart</h1></>}
        
    </div>

    </div>

    }
    </>
}