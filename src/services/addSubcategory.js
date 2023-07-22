import { doc, setDoc } from "firebase/firestore";
import { fireDb } from "../firebase/client";




export default async function addSubCategory(subCategory) {
    return new Promise(async (resolve, reject) => {
        try {
            const productRef = doc(fireDb, "subCategories", subCategory.id);
            await setDoc(productRef, subCategory);


            return resolve({ success: true, message: 'Sub category added successfully. ' })


        } catch (e) {
            return reject({ success: false, message: JSON.stringify(e) })
        }

    })


}


