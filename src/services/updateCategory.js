import { doc, updateDoc } from "firebase/firestore";
import { fireDb } from "../firebase/client";
import { Models } from "../firebase/models";




export default async function updateCategory(category) {

    const response = {
        success: false,
        message: ''
    }

    if (!category || !category.id) {
        response.message = 'Category id is required to update'
        return response
    }


    const updateCategoryRef = doc(fireDb, Models.CATEGORIES, category.id);

    try {
        await updateDoc(updateCategoryRef, {
            ...category
        });

        response.success = true
        response.message = 'Category updated successfully.'

        return response
    } catch (e) {
        response.success = true
        response.message = JSON.stringify(e)
    }




}