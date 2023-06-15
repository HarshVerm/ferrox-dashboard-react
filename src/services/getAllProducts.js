

import { collection, getDocs, query } from 'firebase/firestore'

import { fireDb } from '../firebase/client'
import { Models } from '../firebase/models'




export const getAllProducts = async () => {
    const failedResponse = {
        success: false,
        message: '',
        products: undefined
    }

    const queries = query(
        collection(fireDb, `${Models.PRODUCTS}`),
    )

    try {
        const docsSnap = await getDocs(queries)
        if (docsSnap.empty) {
            failedResponse.message = 'products does not exist'
            return failedResponse
        }

        const metaData = docsSnap.docs.map((item) => {
            return item.data()
        })

        const products = metaData
        failedResponse.success = true
        failedResponse.products = products
        return failedResponse
    } catch (error) {
        failedResponse.message = error.toString()
        return failedResponse
    }
}