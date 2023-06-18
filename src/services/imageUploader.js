const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");


function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}


export default async function imageUploader(file, uuid, extension, mode) {
    try {
        const fileLocation = `products/${uuid}.${extension}`
        const storage = getStorage();
        const imagesRef = ref(storage, fileLocation);

        const uploadableFile = mode === 'VIDEO' ? file : dataURLtoFile(file, `${uuid}.${extension}`)
        const contentType = mode === 'VIDEO' ? 'video/mp4' : 'image/jpeg'

        return new Promise((resolve, reject) => {
            uploadBytes(imagesRef, uploadableFile, { contentType: contentType }).then(snapshot => {
                return getDownloadURL(snapshot.ref)
            }).then(downloadURL => {
                resolve(downloadURL)
            })
        })





    } catch (e) {
        console.error(e)
    }
}

