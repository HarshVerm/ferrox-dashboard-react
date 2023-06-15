


import { deleteDoc, doc } from "firebase/firestore";
import { fireDb } from "../firebase/client";
import { Models } from "../firebase/models";



export default async function deleteCollection(collectionId) {

    const response = {
        success: false,
        message: ''
    }

    if (!collectionId) {
        response.message = 'Collection id is required to delete.'
        return response
    }

    try {
        await deleteDoc(doc(fireDb, Models.COLLECTIONS, collectionId));
        response.success = true
        response.message = "Collection deleted successfully."
        return response

    } catch (e) {
        response.success = false
        response.message = JSON.stringify(e)
        return response
    }


}

