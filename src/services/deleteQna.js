


import { deleteDoc, doc } from "firebase/firestore";
import { fireDb } from "../firebase/client";
import { Models } from "../firebase/models";



export default async function deleteQna(qnaId) {

    const response = {
        success: false,
        message: ''
    }

    if (!qnaId) {
        response.message = 'Qna id is required to delete.'
        return response
    }

    try {
        await deleteDoc(doc(fireDb, Models.QNAS, qnaId));
        response.success = true
        response.message = "Qna deleted successfully."
        return response

    } catch (e) {
        response.success = false
        response.message = JSON.stringify(e)
        return response
    }


}

