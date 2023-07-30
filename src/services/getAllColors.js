

import { collection, getDocs, query } from 'firebase/firestore'

import { fireDb } from '../firebase/client'
import { Models } from '../firebase/models'




const getAllColors = async () => {
    const failedResponse = {
        success: false,
        message: '',
        qnas: undefined
    }

    const queries = query(
        collection(fireDb, `${Models.COLORS}`),
    )

    try {
        const docsSnap = await getDocs(queries)
        if (docsSnap.empty) {
            failedResponse.message = 'Colors does not exist'
            return failedResponse
        }

        const metaData = docsSnap.docs.map((item) => {
            return item.data()
        })

        const colors = metaData
        failedResponse.success = true
        failedResponse.colors = colors
        return failedResponse
    } catch (error) {
        failedResponse.message = error.toString()
        return failedResponse
    }
}

export default getAllColors