import React, { useCallback, useEffect } from "react"
import { useParams } from "react-router-dom"
import getOrderDetails from "../services/getOrderDetails"

const OrderDetails = () =>{
    const {orderId} =  useParams()
    const handleOrderDetails =useCallback(async(orderId)=>{
        console.log(orderId)
        const orderDetails = await getOrderDetails(orderId)
        console.log("orderI",orderDetails)
    },[])
    useEffect(()=>{
        if(orderId){
            handleOrderDetails(orderId)
        }
    },[orderId ])

    return(
        <div>
            OrderDetails
        </div>
    )
}

export default OrderDetails