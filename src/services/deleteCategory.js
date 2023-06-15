


import { deleteDoc, doc } from "firebase/firestore";
import { fireDb } from "../firebase/client";
import { Models } from "../firebase/models";



export default async function deleteCategory(catId) {

    const response = {
        success: false,
        message: ''
    }

    if (!catId) {
        response.message = 'Category id is required to delete.'
        return response
    }

    try {
        await deleteDoc(doc(fireDb, Models.CATEGORIES, catId));
        response.success = true
        response.message = "Category deleted successfully."
        return response

    } catch (e) {
        response.success = false
        response.message = JSON.stringify(e)
        return response
    }


}

