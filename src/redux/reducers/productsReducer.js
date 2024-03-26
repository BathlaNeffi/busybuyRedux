import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseInit";

import axios from "axios";
import { toast } from "react-toastify";


const initialState={
    products:[],
    isLoading:true,
    cart:[],
    myorder:[],
    totalAmount:0,
    itemsInCart:0,
}
export const getInitialStateAsync=createAsyncThunk(
    'product/getInitialState',
    ()=>{
        return axios.get("https://fakestoreapi.com/products");
      
    }

)

export const getInitialCartOrdersThunk=createAsyncThunk(
    'product/getCartOrder',
    async (args,thunkAPI)=>{
        const { userReducer, productReducer}= thunkAPI.getState();
        const {isLoggedIn, userLoggedIn}=userReducer;
        if(isLoggedIn){
            const docRef = doc(db, "busybuy-redux", userLoggedIn.id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());
            const data=docSnap.data();
            thunkAPI.dispatch(productActions.setCart(data.cart));
            thunkAPI.dispatch(productActions.setMyOrders(data.order));
            } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
            }

            return productReducer.cart;
        }
    }
);

export const updateCartInDatabase=createAsyncThunk(
    'product/updateCartInDatabase',
    async(args,thunkAPI)=>{
        const { userReducer, productReducer}= thunkAPI.getState();
        const { userLoggedIn}=userReducer;
        const docRef = doc(db, "busybuy-redux", userLoggedIn.id);
        await updateDoc(docRef,{
            cart:productReducer.cart
        })
    }
)

export const increaseQuantThunk=createAsyncThunk(
    "product/increaseQuantThunk",
    async(product,thunkAPI)=>{
        const {productReducer}= thunkAPI.getState();
        const index=productReducer.cart.findIndex((item)=> item.id ===product.id);
        thunkAPI.dispatch(productActions.increaseProductQuantity(index));
        thunkAPI.dispatch(productActions.increaseToatalAmount(product.price));
        thunkAPI.dispatch(updateCartInDatabase());
    }
)

export const decreaseQuantThunk=createAsyncThunk(
    "product/decreaseQuantThunk",
    async(product,thunkAPI)=>{
        const {productReducer}= thunkAPI.getState();
        // console.log(product,"Product");
        // console.log(productReducer.cart,"ProductReducer Cart");
        const index=productReducer.cart.findIndex((item)=> item.id ===product.id);

        if(productReducer.cart[index].qty===1){
                 console.log("qty was 1");
               thunkAPI.dispatch(removeFromCartThunk(product));
        }
        thunkAPI.dispatch(productActions.decreaseProductQuantity(index));
        thunkAPI.dispatch(productActions.decreaseTotalAmount(product.price));
        thunkAPI.dispatch(updateCartInDatabase());
    }
)

export const addToCartThunk=createAsyncThunk(
    'product/addToCart',
    async(product,thunkAPI)=>{
        const { userReducer, productReducer}= thunkAPI.getState();
        const {isLoggedIn, userLoggedIn}=userReducer;
        if(!isLoggedIn){
            toast.error("Please Login First!!");
            return;
        }
        console.log(productReducer.cart);
        const index=productReducer.cart.findIndex((item)=>item.id=== product.id);
        console.log("index= ",index);
        if(index!==-1){
            thunkAPI.dispatch(increaseQuantThunk(productReducer.cart.at(index)))
            toast.success("product Quantity Increased!!!");
            return;
        }
        const docRef = doc(db, "busybuy-redux", userLoggedIn.id);
        await updateDoc(docRef,{
            cart:arrayUnion({...product})
        });
        // console.log(product.price);
        thunkAPI.dispatch(productActions.increaseToatalAmount(product.price));
        thunkAPI.dispatch(productActions.increaseTotalItem());
        // return product;
        toast.success("Added To Cart");


    }
);

export const removeFromCartThunk=createAsyncThunk(
    'product/reremoveFromCart',
    async(product,thunkAPI)=>{
        const { userReducer, }= thunkAPI.getState();
        const { userLoggedIn}=userReducer;
        const docRef = doc(db, "busybuy-redux", userLoggedIn.id);
        await updateDoc(docRef,{
            cart:arrayRemove(product)
        });
        thunkAPI.dispatch(getInitialCartOrdersThunk());
        return product;
    }
);


export const clearCartThunk=createAsyncThunk(
    'product/clearCart',
    async(args,thunkAPI)=>{
        const { userReducer, productReducer }= thunkAPI.getState();
        const { userLoggedIn}=userReducer;

        if(productReducer.cart.length===0){
            toast.error("Nothing to remove from Cart!!");
            return;
        }
        const docRef = doc(db, "busybuy-redux", userLoggedIn.id);
        await updateDoc(docRef,{
            cart:[]
        });
        toast.success("Empty Cart!!");
    }
);


export const purchaseAllThunk=createAsyncThunk(
    'product/purchaseAll',
    async(args,thunkAPI)=>{
        const { userReducer, productReducer }= thunkAPI.getState();
        const { userLoggedIn}=userReducer;
        if(productReducer.cart.length===0){
            toast.error("Add Items to Purchase!!");
            return;
        }
        const docRef=doc(db,"busybuy-redux", userLoggedIn.id);
        const timestampValue =  new Date();
        const orderObject = {
            timestamp: timestampValue,
            cart: productReducer.cart,
            totalPrice: productReducer.totalAmount
          };
            await updateDoc(docRef, {
                order:arrayUnion(orderObject),
              });

              thunkAPI.dispatch(clearCartThunk());
    }
)





const procuctsSlice=createSlice({
    name:'product',
    initialState:initialState,
    reducers:{
        setCart:(state,action)=>{
            state.cart=action.payload;
        },
        setMyOrders:(state,action)=>{
            // console.log(action.payload);
            state.myorder=action.payload;
            state.myorder.reverse();

        },
        increaseProductQuantity:(state,action)=>{
            const index=action.payload;
            state.cart.at(index).qty++;
        }, 
        decreaseProductQuantity:(state,action)=>{
            const index=action.payload;
            state.cart.at(index).qty--;
        },
        increaseTotalItem:(state,action)=>{
            state.itemsInCart++;

        },
        increaseToatalAmount:(state,action)=>{
            state.totalAmount+=action.payload;
        },
        decreaseTotalAmount:(state,action)=>{
            state.totalAmount-=action.payload;
        }

    },
    extraReducers:(builder)=>{
        builder.addCase(getInitialStateAsync.pending,(state,action)=>{
            state.isLoading=true;
        }).addCase(getInitialStateAsync.fulfilled,(state,action)=>{
            state.products.push(action.payload.data);
            // console.log(action.payload.data);
            state.isLoading=false;
        }).addCase(getInitialCartOrdersThunk.fulfilled,(state,action)=>{
            const cart=action.payload;
            if(cart){
                let sum=0,len=0;
                cart.map((item)=>{
                    Number(sum+= item.qty*item.price);
                    Number(len+=item.qty);
                    return item
                })
                state.totalAmount=sum;
                state.itemsInCart=len;
            }
        }).addCase(increaseQuantThunk.fulfilled,(state,action)=>{
            state.itemsInCart++;
        }).addCase(decreaseQuantThunk.fulfilled,(state,action)=>{
            if(state.itemsInCart>1){
                state.itemsInCart--;
            }
        }).addCase(removeFromCartThunk.fulfilled,(state,action)=>{
            const product=action.payload;
            state.totalAmount-=product.price*product.qty;
            state.itemsInCart-=product.qty;
            toast.success("Removed from Cart!!");
        }).addCase(clearCartThunk.fulfilled,(state,action)=>{
            state.itemsInCart=0;
            state.totalAmount=0;
            state.cart=[];
        }).addCase(addToCartThunk.fulfilled,(state,action)=>{
            // const product=action.payload;
            // if(product){
            // console.log(product,"inside add to cart extra reducer");
            // state.cart.push(product);
            // state.totalAmount+=product.price*product.qty;
            // state.itemsInCart+=product.qty;
            // toast.success("Added To Cart");
            // }

            // state.totalAmount+=action.payload;
        })
    }
});


export const productReducer=procuctsSlice.reducer;
export const productActions=procuctsSlice.actions;
// Selector
export const productSelector=(state)=>state.productReducer;



