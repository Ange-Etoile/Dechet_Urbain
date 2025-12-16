<script setup>
import { usePredictionStore } from '@/stores/predictionStore';
import Header from '@/components/Header.vue';
import CardDescribe from '@/components/CardDescribe.vue';
import CardUpload from '@/components/CardUpload.vue';
import CardAction from '@/components/CardAction.vue';
import CardRecommadation from '@/components/CardRecommadation.vue';
import CardResult from '@/components/CardResult.vue';
import CardCategory from '@/components/CardCategory.vue';

import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  NoSymbolIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline';

// Initialisation du store
const store = usePredictionStore();

// Gestion de l'upload
const handlePhotoTaken = (file) => {
  console.log("📸 Photo taken:", file);
  store.uploadAndPredict(file);
};
</script>

<template>
  <div class="w-full min-h-screen h-auto flex flex-col gap-12 sm:gap-16 lg:gap-24 p-2 sm:p-4 lg:p-6 bg-gray-50">
    <Header />

    <main class="w-full max-w-7xl mx-auto h-auto flex flex-col gap-8 sm:gap-10 lg:gap-12">
      <CardDescribe />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        <div class="flex flex-col gap-4 sm:gap-5">
          <CardUpload />
          
          <CardAction @photoTaken="handlePhotoTaken" />

          <CardRecommadation
            :category="store.mainPrediction.value?.category || 'unknown'"
            :generalClass="store.currentGeneralClass.value" 
            :binColor="store.recyclingInfo.value?.binColor || 'gris'"
            :recommendations="store.recyclingInfo.value?.recommendations || []"
            :isLoading="store.isLoading.value"
            nearestLocation="Point de collecte - 1.2 km"
          />
        </div>

        <div class="flex">
          <CardResult 
            :predictions="store.predictionResults.value"
            :general-class="store.currentGeneralClass.value" 
            :class-probability="store.recyclableProbability.value"
            :is-loading="store.isLoading.value"
            :error="store.error.value"
          />
        </div>
      </div>

      <div class="flex flex-col gap-4 sm:gap-6 items-center justify-center py-6 sm:py-8">
        <div class="text-center space-y-2">
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
            Catégories de déchets
          </h1>
          <p class="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Notre système IA identifie les déchets parmi ces quatre grandes familles :
          </p>
        </div>

        <div class="w-full grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 mt-4">
          <CardCategory
            title="Recyclable"
            :icone="ArrowPathIcon"
            content="Papier, carton, verre, métal et certains plastiques."
            color="#10B981"
            bgColor="#D1FAE5"
          />

          <CardCategory
            title="Organique"
            :icone="SparklesIcon"
            content="Restes de nourriture, épluchures, déchets verts compostables."
            color="#84CC16"
            bgColor="#ECFCCB"
          />

          <CardCategory
            title="Dangereux"
            :icone="ExclamationTriangleIcon"
            content="Batteries, appareils électroniques, produits toxiques."
            color="#EF4444"
            bgColor="#FEE2E2"
          />

          <CardCategory
            title="Non-recyclable"
            :icone="NoSymbolIcon"
            content="Textiles souillés, masques, poussière, couches, céramique."
            color="#6B7280"
            bgColor="#F3F4F6"
          />
        </div>
      </div>
    </main>
  </div>
</template>