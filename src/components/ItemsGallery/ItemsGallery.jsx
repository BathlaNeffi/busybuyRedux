import { useEffect, useState } from "react";
import { productSelector,productActions,getInitialStateAsync } from "../../redux/reducers/productsReducer"
import { useSelector, useDispatch } from "react-redux";
import styles from "./ItemsGallery.module.css";
import ItemCard from "../items/ItemCard";
import Search from "../searchInput/Search";

export default function ItemsGallery(){

    const dispatch=useDispatch();
    useEffect(()=>{
        fetchData();
    },[])

    function fetchData(){
        dispatch(getInitialStateAsync());
    }

    const [search, setSearch]=useState("");
    const state=useSelector(productSelector);
    const [priceRange,setPriceRange]=useState(99);
    const [cateagory,setCatagory]=useState([]);

    function updateValue(e) {
        setPriceRange(e.target.value);
        return;
      }

      function checkBoxValue(cate){
            const ind=cateagory.findIndex((item)=>item===cate)
            if(ind===-1){
                setCatagory([cate,...cateagory]);
            }else{
                cateagory.splice(ind,1);
                setCatagory([...cateagory]);

            }
      }

    return (
        <>
        <Search setSearch={setSearch} />
        
        <div className={styles.itemsContainer}>
        <aside className={styles.filterBox}>
            <form>
                <h2>Filter</h2>
                <span className={styles.priceRangeValue}>Value: {priceRange}</span>
                <input type="range" value={priceRange}  min="0" step="1"  max="999" onChange={(e)=>{updateValue(e)}} />
                <h2>Catagory</h2>
                <div>
                <input type="checkbox" name="Men's Clothing" id="mens" value="men's clothing" onChange={(e)=>{checkBoxValue(e.target.value)}}/>
                <label id="mens">Men's Clothing</label>
                </div>
                <div>
                <input type="checkbox" name="" id="women"  value="women's clothing" onChange={(e)=>{checkBoxValue(e.target.value)}}/>
                <label id="women">Women's Clothing</label>
                </div>
                <div>
                <input type="checkbox" name="" id="jewelery" value="jewelery" onChange={(e)=>{checkBoxValue(e.target.value)}} />
                <label id="jewelery">Jewelery</label>
                </div>
                <div>
                <input type="checkbox" name="" id="Electronics"  value="electronics" onChange={(e)=>{checkBoxValue(e.target.value)}}/>
                <label id="Electronics">Electronics</label>
                </div>

            </form>
        </aside>
            <div className={styles.itemsWraapper}>
                    {state.isLoading? "Loading...":
                        state.products[0].filter((prod)=>{return search.toLocaleLowerCase() === ""? prod: prod.title.toLocaleLowerCase().includes(search)
                    }).filter((pricebag)=> {
                        return pricebag.price <= priceRange? pricebag:undefined
                    }).filter((cate)=> {
                        return cateagory.length===0?true:cateagory.includes(cate.category.toLowerCase());
                    }).map((item,i)=><ItemCard item={item} key={i}/>  )
                    }
            </div>
        </div>
       
        </>
    )
}