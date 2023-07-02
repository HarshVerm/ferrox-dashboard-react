import { doc, updateDoc } from "firebase/firestore";
import { fireDb } from "../firebase/client";
import { Models } from "../firebase/models";




export default async function editQna(content) {

    console.log(content)
    const response = {
        success: false,
        message: ''
    }

    if (!content || !content.id) {
        response.message = 'Qna id is required to update'
        return response
    }


    const updateQnaRef = doc(fireDb, Models.QNAS, content.id);

    try {
        await updateDoc(updateQnaRef, {
            ...content,
            updatedAt: Date.now()
        });

        response.success = true
        response.message = 'Qna updated successfully.'

        return response
    } catch (e) {
        response.success = true
        response.message = JSON.stringify(e)
    }




}