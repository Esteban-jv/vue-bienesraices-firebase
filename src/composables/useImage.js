/**
 * IMPORTANTE: Se recomienda usar composables cuando quieres tener funciones reutilizables o separar la funcionalidad de los componentes (.vue)
 *  Si vas a utilizar un state al cuál necesitas acceder e interactuar a lo largo de varios componentes se recomienda utilizar storage (Pinia)
 */
import { computed } from "vue"
import { ref as storageRef } from "firebase/storage"
import { useFirebaseStorage, useStorageFile } from 'vuefire'
import { uid } from "uid"

export default function useImage() {

    const storage = useFirebaseStorage()
    const storageRefPath = storageRef(storage, `/properties/${uid()}.png`)

    const {
        url,
        // uploadProgress, //podría ser util con el uso de un progress var
        // uploadError,
        // uploadTask,
        upload
    } = useStorageFile(storageRefPath)

    const imageComputed = computed(() => {
        return url.value ? url.value : null
    })

    function uploadImage(e) {
        const data = e.target.files[0]
        if(data) {
            upload(data)
        }
        url
    }

    return {
        url,
        uploadImage,
        imageComputed
    }
}