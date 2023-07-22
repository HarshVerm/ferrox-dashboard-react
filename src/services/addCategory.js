import { doc, setDoc } from "firebase/firestore";
import { fireDb } from "../firebase/client";




export default async function addNewCategory({ category, subCategories }) {
    return new Promise(async (resolve, reject) => {
        try {
            const productRef = doc(fireDb, "categories", category.id);
            await setDoc(productRef, category);

            const subCatsPromises = subCategories.map((cat) => {
                const subCatRef = doc(fireDb, "subCategories", cat.id);
                return setDoc(subCatRef, cat);
            })

            return Promise.all([...subCatsPromises]).then((done) => {
                return resolve({ success: true, message: 'Category added successfully. ' })
            })

        } catch (e) {
            return reject({ success: false, message: JSON.stringify(e) })
        }

    })


}


