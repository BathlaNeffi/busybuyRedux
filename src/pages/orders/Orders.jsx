import { useEffect } from "react";
import styles from "./Orders.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getInitialCartOrdersThunk, productSelector } from "../../redux/reducers/productsReducer";

export default function Orders(){
    // const {orderHistory, onstart}=useUserValue();
     const {myorder}=useSelector(productSelector);
     const dispatch=useDispatch();
    useEffect(()=>{
        dispatch(getInitialCartOrdersThunk());
    },[]);
    const orderHistory=myorder;
    console.log(orderHistory);
    // orderHistory.map((arr)=>arr.map((item)=>console.log(item.timestamp)))
    
    return<>
    <div className={styles.ordersConatiner}> 
        <h1 style={{fontSize:"2.3rem", fontWeight:"800"}}>Your Orders</h1>
        <div>
            {orderHistory.map((item,i)=>  
            <>
                <h2 key={i}>Ordered On:- {
                (new Date(item.timestamp.seconds * 1000 + item.timestamp.nanoseconds / 1000000)).toLocaleString()
                }</h2>
                <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                </tr>
            </thead>
            <tbody>
                {item.cart.map((prd)=>
                <tr>
                    <td >{prd.title}</td>
                    <td>{prd.price}</td>
                    <td>{prd.qty}</td>
                    <td>{prd.qty*prd.price}</td>
                </tr>
                
                )}
                <tr >
                    <th className={styles.total}>&#8377; {item.totalPrice}</th>
                </tr>
                
            </tbody>
            </table>
            </>      
                
                )}


        </div>
    </div>

    </>
}