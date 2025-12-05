<script setup lang="ts">
import CardAction from '@/components/CardAction.vue';
import CardCategory from '@/components/CardCategory.vue';
import CardDescribe from '@/components/CardDescribe.vue';
import CardRecommadation from '@/components/CardRecommadation.vue';
import CardResult from '@/components/CardResult.vue';
import CardUpload from '@/components/CardUpload.vue';
import Header from '@/components/Header.vue';
import { 
  ArrowPathIcon, 
  ExclamationTriangleIcon, 
  NoSymbolIcon,
  SparklesIcon 
} from '@heroicons/vue/24/outline';
</script>

<template>
  <div class="w-full min-h-screen h-auto flex flex-col gap-12 sm:gap-16 lg:gap-24 p-3 sm:p-4 lg:p-6">
    <!-- Header -->
    <Header />
    
    <main class="w-full max-w-7xl mx-auto h-auto flex flex-col gap-8 sm:gap-10 lg:gap-12">
      <!-- Section Description -->
      <CardDescribe />
      
      <!-- Section principale - Upload et Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        <!-- Colonne gauche: Upload et Caméra -->
        <div class="flex flex-col gap-4 sm:gap-5">
          <CardUpload />
          <CardAction />
          <CardRecommadation
            category="trash"  
            :isRecyclable="false"
            nearestLocation="Pharmacie Dupont - 1.2 km"
          />
        </div>
        
        <!-- Colonne droite: Résultats (prend toute la hauteur) -->
        <div class="flex">
          <CardResult />
        </div>
      </div>
      
      <!-- Section Catégories de déchets -->
      <div class="flex flex-col gap-4 sm:gap-6 items-center justify-center py-6 sm:py-8">
        <div class="text-center space-y-2">
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
            Catégories de déchets
          </h1>
          <p class="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Notre système peut identifier et classifier les déchets dans ces quatre catégories principales
          </p>
        </div>
        
        <div class="w-full grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 mt-4">
          <CardCategory 
            title="Recyclable" 
            :icone="ArrowPathIcon" 
            content="Matériaux pouvant être recyclés : carton, verre, métal, papier, plastique"
            color="#10B981"
            bgColor="#D1FAE5"
          />
          
          <CardCategory 
            title="Organique" 
            :icone="SparklesIcon" 
            content="Déchets organiques biodégradables et compostables : restes alimentaires, végétaux"
            color="#84CC16"
            bgColor="#ECFCCB"
          />
          
          <CardCategory 
            title="Dangereux" 
            :icone="ExclamationTriangleIcon" 
            content="Déchets dangereux nécessitant un traitement spécial : batteries, e-waste, déchets médicaux"
            color="#EF4444"
            bgColor="#FEE2E2"
          />
          
          <CardCategory 
            title="Non-recyclable" 
            :icone="NoSymbolIcon" 
            content="Déchets non recyclables : déchets automobiles, textiles usagés, ordures mixtes"
            color="#6B7280"
            bgColor="#F3F4F6"
          />
        </div>
      </div>
    </main>
  </div>  
</template>

<style scoped>
/* Animation au scroll (optionnel) */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>