


import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { fireDb } from "../firebase/client";
import { Models } from "../firebase/models";



export default async function deleteLandingItem(itemId, productId) {

    const response = {
        success: false,
        message: ''
    }

    if (!productId || !itemId) {
        response.message = 'productId and itemId is required to delete.'
        return response
    }

    try {
        await deleteDoc(doc(fireDb, Models.LANDING_PAGE_ITEM, itemId));
        const updateProductRef = doc(fireDb, Models.PRODUCTS, productId)
        await updateDoc(updateProductRef, {
            isFeatured: false
        });
        response.success = true
        response.message = "Item deleted successfully."
        return response

    } catch (e) {
        response.success = false
        response.message = JSON.stringify(e)
        return response
    }


}

