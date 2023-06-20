import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { fireDb } from "../firebase/client"
import { Models } from "../firebase/models"


export default async function getOrderDetails(orderId) {

    const response = {
        success: false,
        message: '',
        orderDetails: undefined
    }

    if (!orderId || !orderId.trim().length) {
        response.message = 'orderId is missing.'
        return response
    }

    try {
        const orderRef = doc(fireDb, Models.ORDERS, orderId)
        const orderDoc = await getDoc(orderRef)

        const order = orderDoc.data()

        const queries = query(
            collection(fireDb, `${Models.PRODUCTS}`),
            where('productId', 'in', [...order.items.map((i) => i.productId)])
        )

        const docsSnap = await getDocs(queries)


        const metaData = docsSnap.docs.map((item) => {
            return item.data()
        })

        const products = metaData

        response.orderDetails = { ...order, items: products }
        response.success = true
        response.message = 'Order details fetched successfully.'
        return response

    } catch (e) {
        console.error(e)
        response.message = JSON.stringify(e)
        return response
    }
}
