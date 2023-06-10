const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");

export default async function imageUploader(file, uuid, extension) {
    try {
        const fileLocation = `products/${uuid}.${extension}`
        const storage = getStorage();
        const imagesRef = ref(storage, fileLocation);

        return new Promise((resolve,reject)=>{
            uploadBytes(imagesRef, file, { contentType: 'image/jpeg', }).then(snapshot => {
                return getDownloadURL(snapshot.ref)
            }).then(downloadURL => {
                resolve(downloadURL)
            })
        })
       
       

       

    } catch (e) {
        console.error(JSON.stringify(e))
    }
}

