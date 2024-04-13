import { ref, computed, onMounted } from 'vue'
import { defineStore } from "pinia";
import { useFirebaseAuth } from 'vuefire'
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {

    // DATA
    const auth = useFirebaseAuth()

    const errorMsg = ref('')
    const authUser = ref(null)
    const errorCodes = {
        'auth/invalid-credential' : 'Usuario o contraseña incorrectos'
    }
    const router = useRouter()

    console.log(authUser.value)

    //On Mounted
    onMounted(() => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                authUser.value = user
            }
        })
    })

    // METHODS
    const login = ({email, password}) => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const { user } = userCredentials
                authUser.value = user
                
                router.push({name: 'admin-properties'})
            })
            .catch(e => {
                console.log(e)
                errorMsg.value = errorCodes[e.code]
            })
    }
    const logout = () => {
        signOut (auth).then(()=> {
            authUser.value = null;
            router.push({name: 'login'})
        })
        .then((e) => {
            console.error(e)
        })
    }

    // COMPUTED
    const hasError = computed(() => {
        return errorMsg.value
    })
    const isAuth = computed(() => {
        return authUser.value
    })

    return {
        isAuth,
        errorMsg,
        hasError,

        login,
        logout
    }
})