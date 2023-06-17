

import { collection, getDocs, query } from 'firebase/firestore'

import { fireDb } from '../firebase/client'
import { Models } from '../firebase/models'




export const getAllLandingItems = async () => {
    const failedResponse = {
        success: false,
        message: '',
        items: undefined
    }

    const queries = query(
        collection(fireDb, `${Models.LANDING_PAGE_ITEM}`),
    )

    try {
        const docsSnap = await getDocs(queries)
        if (docsSnap.empty) {
            failedResponse.message = 'Items does not exist'
            return failedResponse
        }

        const metaData = docsSnap.docs.map((item) => {
            return item.data()
        })

        const products = metaData
        failedResponse.success = true
        failedResponse.items = products
        return failedResponse
    } catch (error) {
        failedResponse.message = error.toString()
        return failedResponse
    }
}