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
  SparklesIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon
} from '@heroicons/vue/24/outline';

interface Props {
  predictions?: {
    category: string;
    confidence: number;
  }[];
  generalClass?: string; 
  classProbability?: number; 
  isLoading?: boolean;
  error?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  predictions: () => [], 
  generalClass: 'non-recyclable',
  classProbability: 0,
  isLoading: false,
  error: null
});

// Configuration visuelle par classe
const classUIConfig = computed(() => {
  const configs: Record<string, any> = {
    'recyclable': {
      title: 'Recyclable',
      icon: CheckCircleIcon,
      colorClass: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      progressColor: 'bg-green-600',
      iconBoxColor: 'bg-green-200'
    },
    'organique': {
      title: 'Organique',
      icon: CheckBadgeIcon,
      colorClass: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-300',
      progressColor: 'bg-emerald-600',
      iconBoxColor: 'bg-emerald-200'
    },
    'dangerous': {
      title: 'Dangereux',
      icon: ExclamationTriangleIcon,
      colorClass: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      progressColor: 'bg-red-600',
      iconBoxColor: 'bg-red-200'
    },
    'non-recyclable': {
      title: 'Non Recyclable',
      icon: XCircleIcon,
      colorClass: 'text-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300',
      progressColor: 'bg-orange-600',
      iconBoxColor: 'bg-orange-200'
    }
  };
  return configs[props.generalClass] || configs['non-recyclable'];
});

const categoryConfig: Record<string, { icon: any; color: string; bgColor: string }> = {
  'trash': { icon: TrashIcon, color: '#6B7280', bgColor: '#F3F4F6' },
  'paper': { icon: DocumentTextIcon, color: '#3B82F6', bgColor: '#DBEAFE' },
  'plastic': { icon: CubeIcon, color: '#F59E0B', bgColor: '#FEF3C7' },
  'glass': { icon: BeakerIcon, color: '#10B981', bgColor: '#D1FAE5' },
  'medical': { icon: ExclamationCircleIcon, color: '#EF4444', bgColor: '#FEE2E2' },
  'metal': { icon: WrenchScrewdriverIcon, color: '#8B5CF6', bgColor: '#EDE9FE' },
  'e-waste': { icon: ComputerDesktopIcon, color: '#EC4899', bgColor: '#FCE7F3' },
  'automobile waste': { icon: TruckIcon, color: '#F97316', bgColor: '#FFEDD5' },
  'battery': { icon: BoltIcon, color: '#14B8A6', bgColor: '#CCFBF1' },
  'cardboard': { icon: ArchiveBoxIcon, color: '#A855F7', bgColor: '#F3E8FF' },
  'food organic': { icon: CakeIcon, color: '#84CC16', bgColor: '#ECFCCB' }
};

const mainCategory = computed(() => {
  if (props.predictions.length === 0) return null;
  return props.predictions.reduce((prev, current) => 
    current.confidence > prev.confidence ? current : prev
  );
});

const sortedPredictions = computed(() => {
  return [...props.predictions].sort((a, b) => b.confidence - a.confidence);
});

const getCategoryConfig = (category: string) => {
  return categoryConfig[category] || { icon: TrashIcon, color: '#6B7280', bgColor: '#F3F4F6' };
};

const formatCategoryName = (category: string) => {
  return (category.charAt(0).toUpperCase() + category.slice(1)).replace(/-/g, ' ');
};
</script>

<template>
  <div class="h-auto rounded-xl shadow-lg w-full p-4 sm:p-6 flex flex-col gap-6 items-start bg-[#1C4E3D]">
    
    <div v-if="props.isLoading" class="w-full h-[500px] flex flex-col items-center justify-center gap-4 text-white">
        <svg class="animate-spin h-10 w-10 text-white" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-lg font-medium">Analyse en cours...</p>
    </div>
    
    <div v-else-if="props.error" class="w-full h-[500px] flex flex-col items-center justify-center gap-4 p-6 bg-red-800/20 rounded-lg">
        <ExclamationCircleIcon class="w-12 h-12 text-red-400" />
        <p class="text-xl font-bold text-red-300">Erreur d'analyse</p>
        <p class="text-sm text-red-200 text-center">{{ props.error }}</p>
    </div>

    <div v-else-if="!mainCategory" class="w-full h-[500px] flex flex-col items-center justify-center gap-4 text-white">
        <DocumentTextIcon class="w-12 h-12 text-[#B7D9E4]"/>
        <p class="text-lg font-medium">Prêt pour l'analyse !</p>
    </div>
    
    <template v-else>
      <div class="flex items-start gap-3 w-full">
        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#B7D9E4] flex flex-shrink-0 items-center justify-center">
          <SparklesIcon class="w-5 h-5 sm:w-6 sm:h-6 text-[#1C4E3D]" />
        </div>
        <div class="flex-1">
          <h1 class="text-xl sm:text-2xl font-bold text-white">Résultat de l'analyse</h1>
          <p class="text-sm text-[#B7D9E4] mt-1">Classification précise par intelligence artificielle</p>
        </div>
      </div>

      <div class="w-full">
        <div class="bg-white rounded-lg p-4 sm:p-5 shadow-md border-2 border-[#B7D9E4]">
          <div class="flex items-center gap-2 mb-3">
            <CheckCircleIcon class="w-5 h-5 text-[#1C4E3D]" />
            <span class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Nature de l'objet</span>
          </div>
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-lg flex items-center justify-center" :style="{ backgroundColor: getCategoryConfig(mainCategory.category).bgColor }">
                <component :is="getCategoryConfig(mainCategory.category).icon" class="w-6 h-6" :style="{ color: getCategoryConfig(mainCategory.category).color }" />
              </div>
              <div>
                <p class="text-sm text-gray-500">Objet détecté</p>
                <h2 class="text-xl sm:text-3xl font-bold" :style="{ color: getCategoryConfig(mainCategory.category).color }">
                  {{ formatCategoryName(mainCategory.category) }}
                </h2>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500">Indice</p>
              <p class="text-xl sm:text-3xl font-bold text-[#1C4E3D]">{{ Math.round(mainCategory.confidence * 100) }}%</p>
            </div>
          </div>
          <div class="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
            <div class="h-full transition-all duration-500" :style="{ width: `${mainCategory.confidence * 100}%`, backgroundColor: getCategoryConfig(mainCategory.category).color }"></div>
          </div>
        </div>
      </div>

      <div class="w-full">
        <div 
          class="rounded-lg p-4 sm:p-5 shadow-md transition-colors duration-300"
          :class="[classUIConfig.bgColor, classUIConfig.borderColor, 'border-2']"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-lg flex items-center justify-center shadow-inner" :class="classUIConfig.iconBoxColor">
                <component :is="classUIConfig.icon" class="w-6 h-6" :class="classUIConfig.colorClass" />
              </div>
              <div>
                <p class="text-sm text-gray-600">Statut de tri</p>
                <h3 class="text-xl sm:text-2xl font-bold" :class="classUIConfig.colorClass">
                  {{ classUIConfig.title }}
                </h3>
              </div>
            </div>
            <p class="text-xl sm:text-3xl font-bold" :class="classUIConfig.colorClass">
              {{ Math.round(props.classProbability * 100) }}%
            </p>
          </div>
          <div class="w-full h-3 rounded-full bg-white/50 overflow-hidden">
            <div 
              class="h-full transition-all duration-700"
              :class="classUIConfig.progressColor"
              :style="{ width: `${props.classProbability * 100}%` }"
            ></div>
          </div>
        </div>
      </div>

      <div class="w-full">
        <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>Détails techniques</span>
          <span class="text-sm text-[#B7D9E4] font-normal">({{ sortedPredictions.length }} classes)</span>
        </h3>
        <div class="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          <div v-for="(prediction, index) in sortedPredictions" :key="index" class="w-full bg-white/95 rounded-lg p-3 shadow-sm hover:scale-[1.01] transition-transform">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center" :style="{ backgroundColor: getCategoryConfig(prediction.category).bgColor }">
                  <component :is="getCategoryConfig(prediction.category).icon" class="w-4 h-4" :style="{ color: getCategoryConfig(prediction.category).color }" />
                </div>
                <h4 class="text-sm font-bold text-gray-700">{{ formatCategoryName(prediction.category) }}</h4>
              </div>
              <p class="text-sm font-bold text-gray-500">{{ Math.round(prediction.confidence * 100) }}%</p>
            </div>
            <div class="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div class="h-full transition-all duration-300" :style="{ width: `${prediction.confidence * 100}%`, backgroundColor: getCategoryConfig(prediction.category).color }"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #B7D9E4; border-radius: 10px; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin { animation: spin 1s linear infinite; }
</style>