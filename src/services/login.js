

import { collection, getDocs, query, Query, where } from 'firebase/firestore'

import { fireDb } from '../firebase/client'
import { Models } from '../firebase/models'




export const adminLogin = async (username, password) => {
    const failedResponse = {
        success: false,
        message: '',
    }
    if (username === '' || !username) {
        failedResponse.message = 'email must not be empty'
        return failedResponse
    }

    const queries = query(
        collection(fireDb, `${Models.ADMIN}`),
        where('username', '==', username)
    )

    try {
        const docsSnap = await getDocs(queries)
        if (docsSnap.empty) {
            failedResponse.message = 'user does not exist'
            return failedResponse
        }

        if (docsSnap.size === 0) {
            failedResponse.message = 'user does not exist'
            return failedResponse
        }

        const metaData = docsSnap.docs.map((item) => {
            return item.data()
        })

        const user = metaData[0]
        failedResponse.success = user.password === password
        failedResponse.user = user
        return failedResponse
    } catch (error) {
        failedResponse.message = error.toString()
        return failedResponse
    }
}