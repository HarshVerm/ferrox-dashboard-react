import { doc, setDoc } from "firebase/firestore"
import { fireDb } from "../firebase/client"
import { uuidv4 } from "../utils/uuid"




export default async function addNewColor({ label, color }) {
    const id = uuidv4()
    return new Promise(async (resolve, reject) => {
        try {
            const productRef = doc(fireDb, "colors", id);
            await setDoc(productRef, { id: id, label, color });
            return resolve({ success: true, message: 'Color added successfully. ' })

        } catch (e) {
            return reject({ success: false, message: JSON.stringify(e) })
        }

    })


}


