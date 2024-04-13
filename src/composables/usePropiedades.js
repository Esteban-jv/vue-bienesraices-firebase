import { computed, ref } from "vue"
import { collection, doc, deleteDoc } from "firebase/firestore"
import { ref as storageRef, deleteObject } from "firebase/storage";
import { useFirestore, useCollection, useFirebaseApp, useFirebaseStorage } from 'vuefire'

export default function usePropiedades() {
    const pool = ref(false)
    
    const storage = useFirebaseStorage()
    const db = useFirestore()
    const propertiesCollection = useCollection(collection(db, 'properties'))

    async function deleteItem (id, urlImage) {
        if(confirm('¿Deseas eliminar esta propiedad?')) {
            const docRef = doc(db, 'properties', id)
            const imageRef = storageRef(storage, urlImage)

            await Promise.all([ //Promise All hace que se ejecute todo al mismo tiempo
                deleteDoc(docRef),
                deleteObject(imageRef)
            ])
        }
    }

    const filteredItems = computed(() => {
        return pool.value ?
            propertiesCollection.value.filter(p => p.pool) :
            propertiesCollection.value
    })

    return {
        // data
        propertiesCollection,
        pool,
        // methods
        deleteItem,
        // computed
        filteredItems
    }
}