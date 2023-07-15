import { doc, setDoc } from "firebase/firestore"
import { fireDb } from "../firebase/client"
import { uuidv4 } from "../utils/uuid"
import imageUploader from "./imageUploader"




export default async function addNewProducts(product) {
    const { variations } = product
    const productId = uuidv4()

    let variants = []

    try {
        for (let i = 0; i < variations.length; i++) {

            const variation = variations[i]
            const showcaseUrls = variation.showcase.map(async (set, _set_index) => {
                //NOTE: in case of file path is provided, uncomment this and pass data
                // const data = readFileSync(set)

                return imageUploader(set.data, `${productId}-showcase-${variation.color.label.toLowerCase()}-${_set_index + 1}`, set.extension, 'IMAGE')
            })

            const productUrls = variation.product.map(async (set, _set_index) => {
                //NOTE: in case of file path is provided, uncomment this and pass data
                // const data = readFileSync(set)

                return imageUploader(set.data, `${productId}-product-${variation.color.label.toLowerCase()}-${_set_index + 1}`, set.extension, 'IMAGE')
            })

            const showcaseImages = await Promise.all([...showcaseUrls]).then((data) => {
                return data
            })

            const productImages = await Promise.all([...productUrls]).then((data) => {
                return data
            })

            console.log(showcaseImages, productImages)

            variants.push({
                color: variation.color,
                showcase: showcaseImages,
                product: productImages
            })
        }


        const updatedProduct = { ...product, isFeaturedId: null, productId: productId, variations: variants, productPrimaryImage: variants[0].product[0] || '', isFeatured: false }
        const productRef = doc(fireDb, "products", productId);
        await setDoc(productRef, updatedProduct);
        return { success: true, message: 'Product added successfully. ' }
    } catch (e) {
        return { success: false, message: JSON.stringify(e) }

    }


}
