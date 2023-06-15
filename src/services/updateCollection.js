import { doc, updateDoc } from "firebase/firestore";
import { fireDb } from "../firebase/client";
import { Models } from "../firebase/models";




export default async function updateCollection(collection) {

    const response = {
        success: false,
        message: ''
    }

    if (!collection || !collection.id) {
        response.message = 'Collection id is required to update'
        return response
    }


    const updateCollectionRef = doc(fireDb, Models.COLLECTIONS, collection.id);

    try {
        await updateDoc(updateCollectionRef, {
            ...collection
        });

        response.success = true
        response.message = 'Collection updated successfully.'

        return response
    } catch (e) {
        response.success = true
        response.message = JSON.stringify(e)
    }




}