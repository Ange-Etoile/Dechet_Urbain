<script setup lang="ts">
import { computed } from 'vue';
import { 
  CheckCircleIcon, TrashIcon, DocumentTextIcon, CubeIcon, 
  BeakerIcon, WrenchScrewdriverIcon, ComputerDesktopIcon, 
  TruckIcon, BoltIcon, ArchiveBoxIcon, CakeIcon, 
  XCircleIcon, SparklesIcon, ExclamationTriangleIcon
} from '@heroicons/vue/24/outline';

interface Props {
  predictions?: { category: string; confidence: number; }[];
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
  error: null // ✅ Par défaut à null
});

// Formatage simple des noms
const formatCategoryName = (name: string) => 
  name ? (name.charAt(0).toUpperCase() + name.slice(1)).replace(/-/g, ' ') : 'Inconnu';

// UI Config pour les consignes
const classUI = computed(() => {
  const configs: Record<string, any> = {
    'recyclable': { title: 'Recyclable', icon: CheckCircleIcon, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-300', iconBg: 'bg-green-200' },
    'organique': { title: 'Organique', icon: CheckCircleIcon, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-300', iconBg: 'bg-emerald-200' },
    'dangerous': { title: 'Dangereux', icon: ExclamationTriangleIcon, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-300', iconBg: 'bg-red-200' },
    'non-recyclable': { title: 'Non Recyclable', icon: XCircleIcon, color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-300', iconBg: 'bg-orange-200' }
  };
  return configs[props.generalClass] || configs['non-recyclable'];
});

const categoryConfig: Record<string, any> = {
  'trash': { icon: TrashIcon, color: '#6B7280', bgColor: '#F3F4F6' },
  'paper': { icon: DocumentTextIcon, color: '#3B82F6', bgColor: '#DBEAFE' },
  'plastic': { icon: CubeIcon, color: '#F59E0B', bgColor: '#FEF3C7' },
  'glass': { icon: BeakerIcon, color: '#10B981', bgColor: '#D1FAE5' },
  'metal': { icon: WrenchScrewdriverIcon, color: '#8B5CF6', bgColor: '#EDE9FE' },
  'cardboard': { icon: ArchiveBoxIcon, color: '#A855F7', bgColor: '#F3E8FF' }
};

const getCatCfg = (cat: string) => categoryConfig[cat] || { icon: TrashIcon, color: '#6B7280', bgColor: '#F3F4F6' };
const mainCat = computed(() => props.predictions && props.predictions.length > 0 ? props.predictions[0] : null);
</script>

<template>
  <div class="h-auto rounded-xl shadow-lg w-full p-6 flex flex-col gap-4 bg-[#1C4E3D] min-h-[420px] transition-all">
    
    <div v-if="props.isLoading" class="flex-1 flex flex-col items-center justify-center text-white gap-4">
      <div class="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      <p class="animate-pulse text-sm">Analyse en cours...</p>
    </div>

    <div v-else-if="props.error && props.error.length > 0" 
         class="flex-1 flex flex-col items-center justify-center bg-red-900/20 rounded-xl p-6 border border-red-500/30">
      <ExclamationTriangleIcon class="w-12 h-12 text-red-400 mb-2" />
      <p class="text-red-200 text-center text-sm font-bold">Erreur d'analyse</p>
      <p class="text-red-300/70 text-center text-xs mt-1">{{ props.error }}</p>
    </div>

    <div v-else-if="!mainCat" 
         class="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl text-white/40 gap-3">
      <DocumentTextIcon class="w-12 h-12 opacity-20" />
      <p class="text-lg font-medium text-white/60">Prêt pour l'analyse</p>
      <p class="text-xs opacity-50">Sélectionnez un déchet à scanner</p>
    </div>

    <template v-else>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded bg-[#B7D9E4] flex items-center justify-center shadow-lg">
          <SparklesIcon class="w-6 h-6 text-[#1C4E3D]" />
        </div>
        <h2 class="text-xl font-bold text-white">Résultat de l'IA</h2>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-xl">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-xl flex items-center justify-center" :style="{ backgroundColor: getCatCfg(mainCat.category).bgColor }">
              <component :is="getCatCfg(mainCat.category).icon" class="w-8 h-8" :style="{ color: getCatCfg(mainCat.category).color }" />
            </div>
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase">Détection</p>
              <h3 class="text-2xl font-black" :style="{ color: getCatCfg(mainCat.category).color }">{{ formatCategoryName(mainCat.category) }}</h3>
            </div>
          </div>
          <p class="text-2xl font-black text-[#1C4E3D]">{{ Math.round(mainCat.confidence * 100) }}%</p>
        </div>
      </div>

      <div class="border-2 rounded-xl p-4" :class="[classUI.bg, classUI.border]">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center" :class="classUI.iconBg">
              <component :is="classUI.icon" class="w-7 h-7" :class="classUI.color" />
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase opacity-60" :class="classUI.color">Consigne de tri</p>
              <h3 class="text-xl font-black" :class="classUI.color">{{ classUI.title }}</h3>
            </div>
          </div>
          <p class="text-2xl font-black" :class="classUI.color">{{ Math.round(props.classProbability * 100) }}%</p>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.animate-spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>