


import { collection, getDocs, query } from 'firebase/firestore'

import { fireDb } from '../firebase/client'
import { Models } from '../firebase/models'




export const getAllOrders = async () => {
    const failedResponse = {
        success: false,
        message: '',
        orders: undefined
    }

    const queries = query(
        collection(fireDb, `${Models.ORDERS}`),
    )

    try {
        const docsSnap = await getDocs(queries)
        if (docsSnap.empty) {
            failedResponse.message = 'orders does not exist'
            return failedResponse
        }

        const metaData = docsSnap.docs.map((item) => {
            return item.data()
        })

        const orders = metaData
        failedResponse.success = true
        failedResponse.orders = orders
        return failedResponse
    } catch (error) {
        failedResponse.message = error.toString()
        return failedResponse
    }
}