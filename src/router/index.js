import { createRouter, createWebHistory } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { useFirebaseAuth } from 'vuefire'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/properties/:id',
      name: 'property',
      component: () => import('../views/PropertyView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      meta: { requireAuth: true },
      children: [
        {
          path: 'properties',// path: '/admin/properties',
          name: 'admin-properties',
          component: () => import('../views/admin/AdminView.vue'),
        },
        {
          path: 'new',// path: '/admin/new',
          name: 'new-porperty',
          component: () => import('../views/admin/NuevaPropiedadView.vue'),
        },
        {
          path: 'edit/:id',// path: '/admin/edit/:id',
          name: 'edit-property',
          component: () => import('../views/admin/EditarPropiedadView.vue'),
        },
      ]
    }
  ]
})

// Guard de navegación
router.beforeEach(async (to, from, next) => {
  // checando el middleware de auth
  const requireAuth = to.matched.some(url => url.meta.requireAuth)

  if(requireAuth) {
    // Comprueba que el usuario está autenticado
    try {
      await authenticateUser()
      next()
    } catch(e) {
      console.error(e)
      next({name: 'login'})
    }
  } else {
    // Pasar al siguiente middleware
    next()
  }
})
function authenticateUser() {
  const auth = useFirebaseAuth() // from firebase

  return new Promise((resolve, reject) => {
    const unsuscribe = onAuthStateChanged(auth, user => {

      unsuscribe()
      if(user) {
        resolve(user)
      } else {
        reject()
      }
    })
  })
}
export default router
