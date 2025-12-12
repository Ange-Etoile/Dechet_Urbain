
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/Home.vue' 
import ResultatsAnalyse from '@/views/Resultat.vue' 

const router = createRouter({
  // Utilisation standard du mode historique
  history: createWebHistory(), 
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Accueil' }
    },
    {
      path: '/resultats', 
      name: 'resultats',  
      component: ResultatsAnalyse,
      meta: {title: 'Resultats'}
    }
  ]
})

export default router