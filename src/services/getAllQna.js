

import { collection, getDocs, query } from 'firebase/firestore'

import { fireDb } from '../firebase/client'
import { Models } from '../firebase/models'




const getAllQna = async () => {
    const failedResponse = {
        success: false,
        message: '',
        qnas: undefined
    }

    const queries = query(
        collection(fireDb, `${Models.QNAS}`),
    )

    try {
        const docsSnap = await getDocs(queries)
        if (docsSnap.empty) {
            failedResponse.message = 'QNAs does not exist'
            return failedResponse
        }

        const metaData = docsSnap.docs.map((item) => {
            return item.data()
        })

        const qnas = metaData
        failedResponse.success = true
        failedResponse.qnas = qnas
        return failedResponse
    } catch (error) {
        failedResponse.message = error.toString()
        return failedResponse
    }
}

export default getAllQna