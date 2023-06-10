import { doc, setDoc } from "firebase/firestore"
import { fireDb } from "../firebase/client"
import { uuidv4 } from "../utils/uuid"




export default async function addNewCollection(title) {
    const collectionId = uuidv4()
    return new Promise(async (resolve, reject) => {
        try {
            const productRef = doc(fireDb, "collections", collectionId);
            await setDoc(productRef, { id: collectionId, enabled: true, title: title });
            return resolve({ success: true, message: 'Category added successfully. ' })

        } catch (e) {
            return reject({ success: false, message: JSON.stringify(e) })
        }

    })


}


