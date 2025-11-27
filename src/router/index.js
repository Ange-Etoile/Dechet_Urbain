
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
      component: HomeView
    },
    {
        // L'URL d'accès
      path: '/resultats', 
      // Le nom de la route
      name: 'resultats',  
      component: ResultatsAnalyse 
    }
  ]
})

export default router