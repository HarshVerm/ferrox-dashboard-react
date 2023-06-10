import { doc, setDoc } from "firebase/firestore"
import { readFileSync } from "fs"
import { fireDb } from "../firebase/client"
import { uuidv4 } from "../utils/uuid"
import imageUploader from "./imageUploader"




export default async function addNewProducts(product) {
    const { images: selectedImages } = product
    const productId = uuidv4()

    const imageUrls = selectedImages.map(async (set, _set_index) => {
        //NOTE: in case of file path is provided, uncomment this and pass data
        // const data = readFileSync(set)
        
        return imageUploader(set.data, `${productId}-${_set_index + 1}`, set.extension)
    })

    return Promise.all([...imageUrls]).then(async (images) => {
        const updatedProduct = { ...product, images: images, productPrimaryImage: images[0] || '' }
        const productRef = doc(fireDb, "products", updatedProduct.productId);
        await setDoc(productRef, updatedProduct);
    }).finally(() => {
        return { success: true, message: 'Product added successfully. ' }
    }).catch((e) => {
        return { success: false, message: JSON.stringify(e) }

    })
}
