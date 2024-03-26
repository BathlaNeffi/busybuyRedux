import { useEffect } from "react"
import ItemsGallery from "../../components/ItemsGallery/ItemsGallery"
import { useDispatch, useSelector } from "react-redux"
import { getInitialUsersAsync, userSelector,userAction } from "../../redux/reducers/usersReducer"
import { getInitialCartOrdersThunk } from "../../redux/reducers/productsReducer";
export default function Home(){
    const {userLoggedIn, isLoggedIn, userList}=useSelector(userSelector);
    const dispatch=useDispatch();
   
    useEffect(()=>{
        if(window.localStorage.token){
            dispatch(userAction.setLoggedIn(true));
            dispatch(userAction.setUserLoggedIn(JSON.parse(window.localStorage.index)));
        }
    },[]);

    useEffect(()=>{
        dispatch(getInitialCartOrdersThunk());
    },[isLoggedIn]);

    return(
        <>
        <ItemsGallery/>
        </>
    )
}