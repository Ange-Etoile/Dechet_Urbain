<script setup lang="ts">
import { computed } from 'vue';
import { 
  CheckCircleIcon, TrashIcon, DocumentTextIcon, CubeIcon, 
  BeakerIcon, WrenchScrewdriverIcon, ComputerDesktopIcon, 
  TruckIcon, BoltIcon, ArchiveBoxIcon, CakeIcon, 
  XCircleIcon, SparklesIcon, ExclamationCircleIcon, 
  ExclamationTriangleIcon, CheckBadgeIcon
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

// 1. FORMATAGE DES NOMS
const formatCategoryName = (name: string) => {
  if (!name) return 'Inconnu';
  return (name.charAt(0).toUpperCase() + name.slice(1)).replace(/-/g, ' ');
};

// 2. CONFIGURATION VISUELLE PAR CLASSE
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

  let key = props.generalClass?.toLowerCase().trim() || 'non-recyclable';
  
  if (key === 'organic') key = 'organique';
  if (key === 'danger' || key === 'hazardous') key = 'dangerous';
  if (key === 'trash' || key === 'garbage') key = 'non-recyclable';

  if (!configs[key]) {
    return {
      title: formatCategoryName(key),
      icon: SparklesIcon,
      colorClass: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      progressColor: 'bg-blue-600',
      iconBoxColor: 'bg-blue-200'
    };
  }
  return configs[key];
});

// 3. CONFIGURATION DES ICONES DE CATÉGORIES
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
  'food organic': { icon: CakeIcon, color: '#84CC16', bgColor: '#ECFCCB' },
  'Food Organics': { icon: CakeIcon, color: '#84CC16', bgColor: '#ECFCCB' }
};

const getCategoryConfig = (category: string) => {
  return categoryConfig[category] || { icon: TrashIcon, color: '#6B7280', bgColor: '#F3F4F6' };
};

const sortedPredictions = computed(() => {
  return props.predictions ? [...props.predictions].sort((a, b) => b.confidence - a.confidence) : [];
});

const mainCategory = computed(() => sortedPredictions.value.length > 0 ? sortedPredictions.value[0] : null);

</script>

<template>
  <div class="h-auto rounded-xl shadow-lg w-full p-4 sm:p-6 flex flex-col gap-4 items-start bg-[#1C4E3D] transition-all duration-500 min-h-[450px]">
    
    <div v-if="props.isLoading" class="w-full flex-1 flex flex-col items-center justify-center gap-4 text-white">
      <div class="relative">
        <div class="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        <SparklesIcon class="w-6 h-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p class="text-lg font-medium animate-pulse">Analyse de l'image...</p>
    </div>
    
    <div v-else-if="props.error" class="w-full flex-1 flex flex-col items-center justify-center gap-4 p-6 bg-red-900/20 rounded-xl border border-red-500/30">
      <ExclamationTriangleIcon class="w-16 h-16 text-red-400" />
      <h3 class="text-xl font-bold text-red-200">Échec de l'analyse</h3>
      <p class="text-sm text-red-300/80 text-center bg-red-950/40 p-3 rounded-lg">{{ props.error }}</p>
    </div>

    <div v-else-if="!mainCategory" class="w-full flex-1 flex flex-col items-center justify-center gap-4 text-white/40 border-2 border-dashed border-white/10 rounded-xl">
      <div class="p-4 bg-white/5 rounded-full">
        <DocumentTextIcon class="w-12 h-12"/>
      </div>
      <p class="text-lg">Prêt pour la classification</p>
    </div>
    
    <template v-else>
      <div class="flex items-center gap-3 mb-2">
        <div class="w-10 h-10 rounded-lg bg-[#B7D9E4] flex items-center justify-center shadow-lg shadow-black/20">
          <SparklesIcon class="w-6 h-6 text-[#1C4E3D]" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-white leading-tight">Résultat d'analyse</h1>
          <p class="text-xs text-[#B7D9E4]/70">Identifié via AI Vision</p>
        </div>
      </div>

      <div class="w-full bg-white rounded-xl p-4 shadow-xl border-b-4 border-[#B7D9E4]">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-xl flex items-center justify-center transition-transform hover:scale-110" 
                 :style="{ backgroundColor: getCategoryConfig(mainCategory.category).bgColor }">
              <component :is="getCategoryConfig(mainCategory.category).icon" 
                         class="w-8 h-8" 
                         :style="{ color: getCategoryConfig(mainCategory.category).color }" />
            </div>
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Objet Détecté</p>
              <h2 class="text-2xl font-black leading-none" :style="{ color: getCategoryConfig(mainCategory.category).color }">
                {{ formatCategoryName(mainCategory.category) }}
              </h2>
            </div>
          </div>
          <div class="text-right">
            <p class="text-[10px] font-black text-gray-400 uppercase">Confiance</p>
            <p class="text-2xl font-black text-[#1C4E3D]">{{ Math.round(mainCategory.confidence * 100) }}%</p>
          </div>
        </div>
        <div class="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
          <div class="h-full transition-all duration-1000 ease-out" 
               :style="{ width: `${mainCategory.confidence * 100}%`, backgroundColor: getCategoryConfig(mainCategory.category).color }"></div>
        </div>
      </div>

      <div class="w-full border-2 rounded-xl p-4 shadow-xl transition-all duration-500" 
           :class="[classUIConfig.bgColor, classUIConfig.borderColor]">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner" :class="classUIConfig.iconBoxColor">
              <component :is="classUIConfig.icon" class="w-7 h-7" :class="classUIConfig.colorClass" />
            </div>
            <div>
              <p class="text-[10px] font-black uppercase opacity-60" :class="classUIConfig.colorClass">Consigne de tri</p>
              <h3 class="text-xl font-black" :class="classUIConfig.colorClass">{{ classUIConfig.title }}</h3>
            </div>
          </div>
          <div class="text-right">
            <p class="text-2xl font-black" :class="classUIConfig.colorClass">
              {{ Math.round(props.classProbability * 100) }}%
            </p>
          </div>
        </div>
        <div class="w-full h-2.5 rounded-full bg-white/40 overflow-hidden">
          <div class="h-full transition-all duration-1000 delay-300 ease-out" 
               :class="classUIConfig.progressColor"
               :style="{ width: `${props.classProbability * 100}%` }"></div>
        </div>
      </div>

      <div class="w-full mt-2" v-if="sortedPredictions.length > 1">
        <h3 class="text-xs font-black text-[#B7D9E4] uppercase tracking-widest mb-3 flex items-center gap-2">
          <ArchiveBoxIcon class="w-4 h-4" />
          Analyses alternatives
        </h3>
        <div class="grid grid-cols-1 gap-2">
          <div v-for="(prediction, index) in sortedPredictions.slice(1, 3)" :key="index" 
               class="flex items-center justify-between bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors border border-white/5">
            <div class="flex items-center gap-3">
              <component :is="getCategoryConfig(prediction.category).icon" 
                         class="w-4 h-4 text-[#B7D9E4]" />
              <span class="text-sm font-bold text-white">{{ formatCategoryName(prediction.category) }}</span>
            </div>
            <span class="text-sm font-mono text-[#B7D9E4]">{{ Math.round(prediction.confidence * 100) }}%</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>