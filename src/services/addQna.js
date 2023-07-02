import { doc, setDoc } from "firebase/firestore"
import { fireDb } from "../firebase/client"
import { uuidv4 } from "../utils/uuid"




export default async function addQna({ title, content, createdAt, updatedAt }) {
    const qnaId = uuidv4()
    return new Promise(async (resolve, reject) => {
        try {
            const productRef = doc(fireDb, "qnas", qnaId);
            await setDoc(productRef, { id: qnaId, title, content, createdAt, updatedAt });
            return resolve({ success: true, message: 'QNA added successfully. ' })

        } catch (e) {
            return reject({ success: false, message: JSON.stringify(e) })
        }

    })


}


