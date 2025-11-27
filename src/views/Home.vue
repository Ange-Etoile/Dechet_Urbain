<script setup>
import { 
  QuestionMarkCircleIcon, 
  ArrowPathIcon,          
  ArrowUpTrayIcon,        
  ArrowRightIcon,         
  ArrowDownTrayIcon,      
  CameraIcon,             
  TrashIcon               
} from '@heroicons/vue/24/outline';

import router from '@/router';
import Header from '@/components/Header.vue';
const started = () =>{
    router.push('/resultats')
}
</script>

<template>
  <div class="w-full min-h-screen flex flex-col gap-24 p-2">
    <Header/>
    <main class="w-full h-auto flex justify-between">
      <div class="w-full flex flex-col gap-14">
        <div class="w-full flex flex-col gap-5">
          <h1 class="font-bold text-lg">L'IA au Service du Tri : Modèle Multi-Tâche pour la Gestion Intelligente des Déchets</h1>
          <h2 class="font-bold">De l'Image à la Décision : Catégorisation et Recyclabilité en Temps Réel</h2>
        </div>
        <div class="text-lg leading-10">
          Dans l'écosystème complexe de la gestion des déchets urbains,
          l'efficacité du tri est cruciale. Nous avons développé un modèle de Machine Learning multi-tâche conçu pour révolutionner cette étape essentielle,
          en apportant précision et rapidité directement sur le terrain ou en centre de tri.
        </div>
        <div class="flex w-40  gap-1 items-center justify-center p-2 bg-[#1C4E3D]  text-white rounded-full">
          <button @click="started" >Get Started</button>
          <ArrowRightIcon class="h-5 w-5 text-white ml-1" />
        </div>
      </div>
      <div>
        <img src="/src/assets/images/IMG_1157.PNG" alt="">
      </div>
    </main>
  </div>
</template>

<style scoped>

</style>
