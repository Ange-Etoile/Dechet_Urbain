<script setup lang="ts">
import { 
  ArrowUpTrayIcon, 
  CameraIcon, 
  SparklesIcon, 
  RectangleStackIcon,
  QuestionMarkCircleIcon 
} from '@heroicons/vue/24/outline';
</script>

<template>
  <div class="h-auto rounded-xl shadow-lg w-full p-5 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 bg-white">
    <!-- Icône principale -->
    <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-[#1C4E3D] flex flex-shrink-0 items-center justify-center shadow-md">
      <QuestionMarkCircleIcon class="w-6 h-6 sm:w-7 sm:h-7 text-white" />
    </div>
    
    <!-- Contenu -->
    <div class="flex flex-col gap-5 sm:gap-6 w-full">
      <!-- Titre et description -->
      <div class="space-y-3">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">Comment ça marche ?</h2>
        <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
          Notre application utilise l'intelligence artificielle pour identifier et classer automatiquement vos déchets.
          Prenez simplement une photo ou téléversez une image de votre déchet, et notre système vous indiquera dans quelle catégorie il appartient.
        </p>
      </div>
      
      <!-- Grille des étapes -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        <!-- Étape 1: Télécharger -->
        <div class="flex flex-col gap-3 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-md transition-all duration-300 group">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <ArrowUpTrayIcon class="w-5 h-5 text-white" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-blue-600 bg-blue-200 px-2 py-1 rounded-full">1</span>
              <h3 class="text-base sm:text-lg font-bold text-gray-800">Téléverser ou Photographier </h3>
            </div>
          </div>
          <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Glissez-déposez ou utilisez votre caméra pour capturer  une image  de votre déchet
          </p>
        </div>
        
        <!-- Étape 2: Analyser -->
        <div class="flex flex-col gap-3 p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100/50 hover:shadow-md transition-all duration-300 group">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <SparklesIcon class="w-5 h-5 text-white" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-green-600 bg-green-200 px-2 py-1 rounded-full">2</span>
              <h3 class="text-base sm:text-lg font-bold text-gray-800">Analyser</h3>
            </div>
          </div>
          <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
            L'IA identifie la catégorie en quelques secondes
          </p>
        </div>
        
        <!-- Étape 4: Trier -->
        <div class="flex flex-col gap-3 p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100/50 hover:shadow-md transition-all duration-300 group">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <RectangleStackIcon class="w-5 h-5 text-white" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-orange-600 bg-orange-200 px-2 py-1 rounded-full">3</span>
              <h3 class="text-base sm:text-lg font-bold text-gray-800">Trier</h3>
            </div>
          </div>
          <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Découvrez comment éliminer correctement votre déchet
          </p>
        </div>
      </div>
      
      <!-- Indicateur visuel du processus -->
      <div class="hidden lg:flex items-center justify-between px-8 mt-2">
        <div class="flex-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        <div class="w-3 h-3 rounded-full bg-purple-500 mx-2"></div>
        <div class="flex-1 h-1 bg-gradient-to-r from-purple-500 to-green-500 rounded-full"></div>
        <div class="w-3 h-3 rounded-full bg-green-500 mx-2"></div>
        <div class="flex-1 h-1 bg-gradient-to-r from-green-500 to-orange-500 rounded-full"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animation de pulsation pour les badges numériques */
@keyframes pulse-subtle {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>