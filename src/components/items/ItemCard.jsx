
import { useDispatch } from "react-redux";
import styles from "./ItemCard.module.css";
import { addToCartThunk } from "../../redux/reducers/productsReducer";

export default function ItemCard({item}){

    const {id,title,price,description,category,image}=item;
    const dispatch=useDispatch();



    function addToCart(){
        const item={
            id,name:title,price,description,category,image,qty:1
        }
        // console.log('item', item)
        dispatch(addToCartThunk(item));
    }
    return<>
    <div className={styles.containerItem}>
        <div className={styles.imgWrapper}>
            <img src={image} alt="item" />
        </div>
        <span>{title.substring(0,20)}...</span>
        <p>	&#8377; {price} </p>
        <button className={styles.btn} onClick={addToCart}>Add To Cart</button>
    </div>
    </>
}