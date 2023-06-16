


import { deleteDoc, doc } from "firebase/firestore";
import { fireDb } from "../firebase/client";
import { Models } from "../firebase/models";



export default async function deleteProduct(productId) {

    const response = {
        success: false,
        message: ''
    }

    if (!productId) {
        response.message = 'Product id is required to delete.'
        return response
    }

    try {
        await deleteDoc(doc(fireDb, Models.PRODUCTS, productId));
        response.success = true
        response.message = "Product deleted successfully."
        return response

    } catch (e) {
        response.success = false
        response.message = JSON.stringify(e)
        return response
    }


}

