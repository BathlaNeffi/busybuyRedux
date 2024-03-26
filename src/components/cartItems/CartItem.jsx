
import { useDispatch } from "react-redux";
import styles from "./CartItem.module.css";
import { decreaseQuantThunk, increaseQuantThunk, removeFromCartThunk } from "../../redux/reducers/productsReducer";

export default function CartItem({item}){

    const {id,name,price,description,category,image, qty}=item;
    // const{handeladdToCart, handelRemoveToCart ,handelRemoveItem}=useUserValue();
    const dispatch=useDispatch();



    const prd={
        id,name,price,description,category,image,qty:1
    }
    function addToCart(){
        dispatch(increaseQuantThunk(prd));

    }

    function removeProductFromCart(){
        dispatch(removeFromCartThunk(prd));
    }

    function removeItem(){
        dispatch(decreaseQuantThunk(prd))
    }
    return<>
    <div className={styles.containerItem}>
        <div className={styles.imgWrapper}>
            <img src={image} alt="item" />
        </div>
        <span>{name.substring(0,20)}...</span>
        <div className={styles.priceDiv}>
        <p className={styles.para}>&#8377; {price} </p>
        <span>
        <img className={styles.imgBtn} onClick={removeItem} src="https://cdn-icons-png.flaticon.com/128/4572/4572882.png" alt=" remove qty" /> <span>{qty}</span> <img className={styles.imgBtn} onClick={addToCart} src="https://cdn-icons-png.flaticon.com/128/561/561169.png" alt="Add qty" />
        </span>
        </div>
        
        <button className={styles.btn} onClick={removeProductFromCart}>Remove</button>
    </div>
    </>
}