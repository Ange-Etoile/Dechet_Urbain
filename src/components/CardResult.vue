<script setup lang="ts">
import { computed } from 'vue';
import { 
  CheckCircleIcon, 
  TrashIcon,
  DocumentTextIcon,
  CubeIcon,
  BeakerIcon,
  WrenchScrewdriverIcon,
  ComputerDesktopIcon,
  TruckIcon,
  BoltIcon,
  ArchiveBoxIcon,
  CakeIcon,
  XCircleIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline';

// Props pour recevoir les résultats du modèle
interface Props {
  predictions?: {
    category: string;
    probability: number;
  }[];
  isRecyclable?: boolean;
  recyclableProbability?: number;
}

const props = withDefaults(defineProps<Props>(), {
  predictions: () => [
    { category: 'metal', probability: 0.92 },
    { category: 'plastic', probability: 0.75 },
    { category: 'paper', probability: 0.45 },
    { category: 'glass', probability: 0.38 },
    { category: 'cardboard', probability: 0.28 },
    { category: 'e-waste', probability: 0.15 },
    { category: 'battery', probability: 0.12 },
    { category: 'automobile waste', probability: 0.08 },
    { category: 'medical', probability: 0.05 },
    { category: 'food organic', probability: 0.04 },
    { category: 'trash', probability: 0.03 }
  ],
  isRecyclable: true,
  recyclableProbability: 0.88
});

// Configuration des catégories avec icônes et couleurs
const categoryConfig: Record<string, { icon: any; color: string; bgColor: string }> = {
  'trash': { icon: TrashIcon, color: '#6B7280', bgColor: '#F3F4F6' },
  'paper': { icon: DocumentTextIcon, color: '#3B82F6', bgColor: '#DBEAFE' },
  'plastic': { icon: CubeIcon, color: '#F59E0B', bgColor: '#FEF3C7' },
  'glass': { icon: BeakerIcon, color: '#10B981', bgColor: '#D1FAE5' },
  'medical': { icon: CheckCircleIcon, color: '#EF4444', bgColor: '#FEE2E2' },
  'metal': { icon: WrenchScrewdriverIcon, color: '#8B5CF6', bgColor: '#EDE9FE' },
  'e-waste': { icon: ComputerDesktopIcon, color: '#EC4899', bgColor: '#FCE7F3' },
  'automobile waste': { icon: TruckIcon, color: '#F97316', bgColor: '#FFEDD5' },
  'battery': { icon: BoltIcon, color: '#14B8A6', bgColor: '#CCFBF1' },
  'cardboard': { icon: ArchiveBoxIcon, color: '#A855F7', bgColor: '#F3E8FF' },
  'food organic': { icon: CakeIcon, color: '#84CC16', bgColor: '#ECFCCB' }
};

// Trouver la catégorie principale (plus haute probabilité)
const mainCategory = computed(() => {
  if (props.predictions.length === 0) return null;
  return props.predictions.reduce((prev, current) => 
    current.probability > prev.probability ? current : prev
  );
});

// Trier les prédictions par probabilité décroissante
const sortedPredictions = computed(() => {
  return [...props.predictions].sort((a, b) => b.probability - a.probability);
});

// Obtenir la configuration d'une catégorie
const getCategoryConfig = (category: string) => {
  return categoryConfig[category] || { 
    icon: TrashIcon, 
    color: '#6B7280', 
    bgColor: '#F3F4F6' 
  };
};

// Formater le nom de la catégorie
const formatCategoryName = (category: string) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};
</script>

<template>
  <div class="h-auto rounded-xl shadow-lg w-full p-4 sm:p-6 flex flex-col gap-6 items-start bg-[#1C4E3D]">
    <!-- En-tête -->
    <div class="flex items-start gap-3 w-full">
      <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#B7D9E4] flex flex-shrink-0 items-center justify-center">
        <SparklesIcon class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
      <div class="flex-1">
        <h1 class="text-xl sm:text-2xl font-bold text-white">Résultat de l'analyse</h1>
        <p class="text-sm text-[#B7D9E4] mt-1">Classification multi-classes avec probabilités</p>
      </div>
    </div>

    <!-- Catégorie Principale -->
    <div v-if="mainCategory" class="w-full">
      <div class="bg-white rounded-lg p-4 sm:p-5 shadow-md border-2 border-[#B7D9E4]">
        <div class="flex items-center gap-2 mb-3">
          <CheckCircleIcon class="w-5 h-5 text-[#1C4E3D]" />
          <span class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Catégorie détectée</span>
        </div>
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <div 
              class="w-12 h-12 rounded-lg flex items-center justify-center"
              :style="{ backgroundColor: getCategoryConfig(mainCategory.category).bgColor }"
            >
              <component 
                :is="getCategoryConfig(mainCategory.category).icon" 
                class="w-6 h-6"
                :style="{ color: getCategoryConfig(mainCategory.category).color }"
              />
            </div>
            <div>
              <p class="text-sm text-gray-500">Classification</p>
              <h2 class="text-2xl sm:text-3xl font-bold" :style="{ color: getCategoryConfig(mainCategory.category).color }">
                {{ formatCategoryName(mainCategory.category) }}
              </h2>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">Confiance</p>
            <p class="text-2xl sm:text-3xl font-bold text-[#1C4E3D]">
              {{ Math.round(mainCategory.probability * 100) }}%
            </p>
          </div>
        </div>
        <div class="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-500"
            :style="{ 
              width: `${mainCategory.probability * 100}%`,
              backgroundColor: getCategoryConfig(mainCategory.category).color
            }"
          ></div>
        </div>
      </div>
    </div>

    <!-- État de recyclabilité -->
    <div class="w-full">
      <div 
        class="rounded-lg p-4 sm:p-5 shadow-md"
        :class="isRecyclable ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <div 
              class="w-12 h-12 rounded-lg flex items-center justify-center"
              :class="isRecyclable ? 'bg-green-200' : 'bg-red-200'"
            >
              <CheckCircleIcon v-if="isRecyclable" class="w-6 h-6 text-green-700" />
              <XCircleIcon v-else class="w-6 h-6 text-red-700" />
            </div>
            <div>
              <p class="text-sm text-gray-600">Recyclabilité</p>
              <h3 
                class="text-xl sm:text-2xl font-bold"
                :class="isRecyclable ? 'text-green-700' : 'text-red-700'"
              >
                {{ isRecyclable ? 'Recyclable' : 'Non recyclable' }}
              </h3>
            </div>
          </div>
          <p 
            class="text-2xl sm:text-3xl font-bold"
            :class="isRecyclable ? 'text-green-700' : 'text-red-700'"
          >
            {{ Math.round(recyclableProbability * 100) }}%
          </p>
        </div>
        <div class="w-full h-3 rounded-full bg-white overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-500"
            :class="isRecyclable ? 'bg-green-600' : 'bg-red-600'"
            :style="{ width: `${recyclableProbability * 100}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Toutes les prédictions -->
    <div class="w-full">
      <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <span>Toutes les classifications</span>
        <span class="text-sm text-[#B7D9E4] font-normal">({{ sortedPredictions.length }})</span>
      </h3>
      <div class="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <div 
          v-for="(prediction, index) in sortedPredictions" 
          :key="index"
          class="w-full bg-white rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div 
                class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex flex-shrink-0 items-center justify-center"
                :style="{ backgroundColor: getCategoryConfig(prediction.category).bgColor }"
              >
                <component 
                  :is="getCategoryConfig(prediction.category).icon" 
                  class="w-4 h-4 sm:w-5 sm:h-5"
                  :style="{ color: getCategoryConfig(prediction.category).color }"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs text-gray-500">Classe</p>
                <h4 class="text-sm sm:text-base font-bold truncate" :style="{ color: getCategoryConfig(prediction.category).color }">
                  {{ formatCategoryName(prediction.category) }}
                </h4>
              </div>
            </div>
            <p class="text-base sm:text-lg font-bold text-gray-700 flex-shrink-0 ml-2">
              {{ Math.round(prediction.probability * 100) }}%
            </p>
          </div>
          <div class="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
            <div 
              class="h-full rounded-full transition-all duration-300"
              :style="{ 
                width: `${prediction.probability * 100}%`,
                backgroundColor: getCategoryConfig(prediction.category).color
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #B7D9E4;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9BC5D4;
}
</style>