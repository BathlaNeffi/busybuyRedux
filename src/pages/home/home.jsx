import { useEffect } from "react"
import ItemsGallery from "../../components/ItemsGallery/ItemsGallery"
import { useDispatch } from "react-redux"
import { userAction } from "../../redux/reducers/usersReducer"
import { getInitialCartOrdersThunk } from "../../redux/reducers/productsReducer";
export default function Home(){
    const dispatch=useDispatch();
   
    useEffect(()=>{
        if(window.localStorage.token){
            dispatch(userAction.setLoggedIn(true));
            dispatch(userAction.setUserLoggedIn(JSON.parse(window.localStorage.index)));
        }
    },[dispatch]);

    useEffect(()=>{
        dispatch(getInitialCartOrdersThunk());
    },[dispatch]);

    return(
        <>
        <ItemsGallery/>
        </>
    )
}