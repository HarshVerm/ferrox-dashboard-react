

import { collection, getDocs, query, Query, where } from 'firebase/firestore'

import { fireDb } from '../firebase/client'
import { Models } from '../firebase/models'




export const getSubCategories = async (categoryId) => {
    const failedResponse = {
        success: false,
        message: '',
    }

    const queries = query(
        collection(fireDb, `${Models.SUB_CATEGORIES}`),
        where("parentCatId", "==", categoryId)

    )

    try {
        const docsSnap = await getDocs(queries)
        if (docsSnap.empty) {
            failedResponse.message = 'categories does not exist'
            return failedResponse
        }

        const metaData = docsSnap.docs.map((item) => {
            return item.data()
        })

        const subCategories = metaData
        failedResponse.success = true
        failedResponse.subCategories = subCategories
        return failedResponse
    } catch (error) {
        failedResponse.message = error.toString()
        return failedResponse
    }
}