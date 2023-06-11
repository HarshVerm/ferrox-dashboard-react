import { doc, setDoc } from "firebase/firestore"
import { fireDb } from "../firebase/client"
import { uuidv4 } from "../utils/uuid"




export default async function addNewCategory({ title, description, link }) {
    const catId = uuidv4()
    return new Promise(async (resolve, reject) => {
        try {
            const productRef = doc(fireDb, "categories", catId);
            await setDoc(productRef, { id: catId, enabled: true, title: title, description: description, link: link });
            return resolve({ success: true, message: 'Category added successfully. ' })

        } catch (e) {
            return reject({ success: false, message: JSON.stringify(e) })
        }

    })


}


