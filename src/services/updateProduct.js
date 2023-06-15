import { doc, updateDoc } from "firebase/firestore";
import { fireDb } from "../firebase/client";
import { Models } from "../firebase/models";
import { isUrl } from "../utils/isUrl";
import imageUploader from "./imageUploader";




export default async function updateProduct(product) {

    const response = {
        success: false,
        message: ''
    }

    if (!product || !product.productId) {
        response.message = 'Product id is required to update'
        return response
    }

    const { images: selectedImages } = product

    const filteredPromisesTobe = selectedImages.filter((image) => !isUrl(image))
    const existingUrls = selectedImages.filter((image) => isUrl(image))
    const imageUrls = filteredPromisesTobe.map(async (set, _set_index) => {
        //NOTE: in case of file path is provided, uncomment this and pass data
        // const data = readFileSync(set)

        return imageUploader(set.data, `${product.productId}-${_set_index + 1}`, set.extension)
    })

    return Promise.all([...imageUrls]).then(async (images) => {
        const updatedImages = [...existingUrls, ...images]
        const updatedProduct = { ...product, images: updatedImages }
        const updateProductRef = doc(fireDb, Models.PRODUCTS, product.productId);

        await updateDoc(updateProductRef, {
            ...updatedProduct
        });

        response.success = true
        response.message = 'Image updated successfully.'

        return response
    }).catch((e) => {
        response.success = false
        response.message = JSON.stringify(3)

        return response
    })




}