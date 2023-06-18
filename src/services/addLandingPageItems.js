import { updateDoc } from "firebase/firestore"
import { Models } from "../firebase/models"
import { uuidv4 } from "../utils/uuid"


export default async function addLandingPageItems(item) {

    if (!item || !item.productId) {
        return { success: false, message: 'Payload missing some values' }
    }

    const { primaryImageWeb, primaryImageMobile, primaryVideoWeb, primaryVideoMobile, productId, mode } = item

    const itemId = uuidv4()

    const uploadItems = mode === 'IMAGE' ? [primaryImageWeb, primaryImageMobile] : [primaryVideoWeb, primaryVideoMobile]

    const imageUrls = uploadItems.map(async (set, _set_index) => {
        //NOTE: in case of file path is provided, uncomment this and pass data
        // const data = readFileSync(set)

        return imageUploader(set, `${productId}-${_set_index === 0 ? 'primary-image' : 'primary-video'}`, set.extension)
    })

    Promise.all(imageUrls).then(async (data) => {
        const updatedProduct = { ...item, id: itemId, ...(mode === 'IMAGE' ? { primaryImageWeb: data[0], primaryImageMobile: data[1] } : { primaryVideoWeb: data[0], primaryVideoMobile: data[1] }) }
        const landingItemRef = doc(fireDb, Models.LANDING_PAGE_ITEM, itemId);
        const productRef = doc(fireDb, Models.PRODUCTS, item?.productId);
        await setDoc(landingItemRef, updatedProduct);
        await updateDoc(productRef, {
            isFeatured: true
        });



    }).then(() => {
        return { success: true, message: 'Landing page item added successfully. ' }
    }).catch((e) => {
        return { success: false, message: JSON.stringify(e) }

    })
}