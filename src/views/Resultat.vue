<script setup>
import CardAction from '@/components/CardAction.vue';
import CardCategory from '@/components/CardCategory.vue';
import CardDescribe from '@/components/CardDescribe.vue';
import CardRecommadation from '@/components/CardRecommadation.vue';
import CardResult from '@/components/CardResult.vue';
import CardUpload from '@/components/CardUpload.vue';
import Header from '@/components/Header.vue';

import { usePredictionStore } from '@/stores/predictionStore';
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  NoSymbolIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline';
import { toRefs } from 'vue';

const store = usePredictionStore();

const {
  predictionResults,
  isLoading,
  error,
  mainPrediction,
  recyclingInfo,
  isRecyclable,
  recyclableProbability
} = toRefs(store);

const handlePhotoTaken = (file) => {
  store.uploadAndPredict(file);
};
</script>

<template>
  <div class="w-full min-h-screen h-auto flex flex-col gap-12 sm:gap-16 lg:gap-24 p-2 sm:p-4 lg:p-6">
    <Header />

    <main class="w-full max-w-7xl mx-auto h-auto flex flex-col gap-8 sm:gap-10 lg:gap-12">
      <CardDescribe />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        <div class="flex flex-col gap-4 sm:gap-5">
          <CardUpload />
          <CardAction @photoTaken="handlePhotoTaken($event)" />

          <CardRecommadation
            :category="mainPrediction?.category || 'unknown'"
            :isRecyclable="isRecyclable"
            :binColor="recyclingInfo?.binColor || 'gris'"
            :recommendations="recyclingInfo?.recommendations || []"
            :isLoading="isLoading"
            nearestLocation="Pharmacie Dupont - 1.2 km"
          />
        </div>

        <div class="flex">
          <CardResult
            :predictions="predictionResults"
            :isLoading="isLoading"
            :error="error"
            :isRecyclable="isRecyclable"
            :recyclableProbability="recyclableProbability"
          />
        </div>
      </div>

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