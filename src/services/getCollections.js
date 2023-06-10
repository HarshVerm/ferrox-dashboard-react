

import { collection, getDocs, query, Query, where } from 'firebase/firestore'

import { fireDb } from '../firebase/client'
import { Models } from '../firebase/models'




export const getAllCollections = async () => {
    const failedResponse = {
        success: false,
        message: '',
    }

    const queries = query(
        collection(fireDb, `${Models.COLLECTIONS}`),
    )

    try {
        const docsSnap = await getDocs(queries)
        if (docsSnap.empty) {
            failedResponse.message = 'collections does not exist'
            return failedResponse
        }

        const metaData = docsSnap.docs.map((item) => {
            return item.data()
        })

        const collections = metaData
        failedResponse.success = true
        failedResponse.collections = collections
        return failedResponse
    } catch (error) {
        failedResponse.message = error.toString()
        return failedResponse
    }
}