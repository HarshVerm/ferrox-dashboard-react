import { Models } from "../firebase/models"
import { uuidv4 } from "../utils/uuid"


export default async function addLandingPageItems(item) {

    if (!item || !item.productId) {
        return { success: false, message: 'Payload missing some values' }
    }

    const { primaryImage, primaryVideo, productId } = item

    const itemId = uuidv4()

    const uploadItems = [primaryImage, primaryVideo]

    const imageUrls = uploadItems.map(async (set, _set_index) => {
        //NOTE: in case of file path is provided, uncomment this and pass data
        // const data = readFileSync(set)

        return imageUploader(set, `${productId}-${_set_index === 0 ? 'primary-image' : 'primary-video'}`, set.extension)
    })

    Promise.all(imageUrls).then(async (data) => {
        const updatedProduct = { ...item, id: itemId, primaryImage: data[0], primaryVideo: data[1] }
        const productRef = doc(fireDb, Models.LANDING_PAGE_ITEM, itemId);
        await setDoc(productRef, updatedProduct);
    }).then(() => {
        return { success: true, message: 'Landing page item added successfully. ' }
    }).catch((e) => {
        return { success: false, message: JSON.stringify(e) }

    })
}