

import { collection, getDocs, query } from 'firebase/firestore'

import { fireDb } from '../firebase/client'
import { Models } from '../firebase/models'




export const getAllUsers = async () => {
    const failedResponse = {
        success: false,
        message: '',
        users: undefined
    }

    const queries = query(
        collection(fireDb, `${Models.USERS}`),
    )

    try {
        const docsSnap = await getDocs(queries)
        if (docsSnap.empty) {
            failedResponse.message = 'Users does not exist'
            return failedResponse
        }

        const metaData = docsSnap.docs.map((item) => {
            return item.data()
        })

        const users = metaData
        failedResponse.success = true
        failedResponse.users = users
        return failedResponse
    } catch (error) {
        failedResponse.message = error.toString()
        return failedResponse
    }
}