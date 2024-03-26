import { Outlet } from "react-router-dom";
import styles from "./Search.module.css";

export default function Search({setSearch}){



    return(
        <>
        <div className={styles.searchContainer}>
            <input type="text" placeholder="Search By name" onChange={(e)=>{setSearch(e.target.value)}}/>
        </div>
        <Outlet/>
        </>
    )
}