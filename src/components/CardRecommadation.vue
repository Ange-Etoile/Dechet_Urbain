<script setup lang="ts">
import { 
    LightBulbIcon, 
    CheckCircleIcon, 
    ExclamationTriangleIcon,
    InformationCircleIcon,
    MapPinIcon,
    XCircleIcon,
    TruckIcon,
   CheckBadgeIcon
} from '@heroicons/vue/24/outline';
import { computed } from 'vue';

interface Props {
    category?: string;
    generalClass?: string; // CHANGÉ : remplace isRecyclable
    binColor?: string;
    recommendations?: string[];
    nearestLocation?: string;
    isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    category: 'unknown', 
    generalClass: 'non-recyclable', 
    binColor: 'gris',
    recommendations: () => [],
    nearestLocation: 'Non disponible',
    isLoading: false
});

// Configuration de secours (fallbacks)
const categoryFallbacks: Record<string, any> = {
    'unknown': {
        recommendations: ['Lancez une analyse pour obtenir des instructions détaillées.'],
        binColor: 'gris',
        icon: InformationCircleIcon,
        specialInstructions: 'Aucune analyse effectuée.'
    },
    'trash': {
        recommendations: ['Placez dans la poubelle des ordures ménagères', 'Fermez bien le sac'],
        binColor: 'gris',
        icon: XCircleIcon,
        specialInstructions: 'Déchets destinés à l\'incinération'
    },
    'paper': {
        recommendations: ['Propre et sec', 'Aplatissez les cartons'],
        binColor: 'bleu',
        icon: CheckCircleIcon
    },
    'plastic': {
        recommendations: ['Rincez le contenant', 'Vérifiez le symbole'],
        binColor: 'jaune',
        icon: CheckCircleIcon
    },
    'glass': {
        recommendations: ['Rincez le verre', 'Retirez les bouchons'],
        binColor: 'vert',
        icon: CheckCircleIcon
    },
    'medical': {
        recommendations: ['NE PAS jeter avec les ordures', 'Pharmacie uniquement'],
        binColor: 'rouge',
        icon: ExclamationTriangleIcon,
        specialInstructions: 'DANGER - Risque infectieux'
    },
    'metal': {
        recommendations: ['Rincez les boîtes', 'Bac jaune'],
        binColor: 'jaune',
        icon: CheckCircleIcon
    },
    'e-waste': {
        recommendations: ['Point de collecte DEEE', 'Ne pas jeter'],
        binColor: 'rouge',
        icon: ExclamationTriangleIcon,
        specialInstructions: 'Substances dangereuses présentes'
    },
    'battery waste': {
        recommendations: ['Bornes de collecte spéciales', 'Protégez les bornes'],
        binColor: 'rouge',
        icon: ExclamationTriangleIcon,
        specialInstructions: 'Risque d\'incendie'
    },
    'food organic': {
        recommendations: ['Idéal pour compost', 'Bac marron'],
        binColor: 'marron',
        icon: CheckBadgeIcon
    }
};

const currentConfig = computed(() => {
    const fallback = categoryFallbacks[props.category.toLowerCase()] || categoryFallbacks['unknown'];
    
    return {
        recommendations: props.recommendations.length > 0 ? props.recommendations : fallback.recommendations,
        binColor: props.binColor || fallback.binColor,
        // On choisit l'icône selon la classe reçue
        icon: props.generalClass === 'recyclable' ? CheckCircleIcon : 
              props.generalClass === 'organique' ? CheckBadgeIcon : 
              props.generalClass === 'dangerous' ? ExclamationTriangleIcon : XCircleIcon,
        specialInstructions: fallback.specialInstructions
    };
});

// Gère les couleurs et titres selon la CLASSE
const recommendationConfig = computed(() => {
    switch (props.generalClass) {
        case 'recyclable':
            return {
                icon: CheckCircleIcon,
                bgColor: 'bg-green-50', borderColor: 'border-green-300',
                iconBgColor: 'bg-green-100', iconColor: 'text-green-600',
                titleColor: 'text-green-800', title: '✓ Déchet recyclable',
                message: `Ce déchet (${formatCategoryName(props.category)}) va au recyclage.`
            };
        case 'organique':
            return {
                icon: CheckBadgeIcon,
                bgColor: 'bg-emerald-50', borderColor: 'border-emerald-300',
                iconBgColor: 'bg-emerald-100', iconColor: 'text-emerald-600',
                titleColor: 'text-emerald-800', title: '🍃 Déchet organique',
                message: `Ce déchet (${formatCategoryName(props.category)}) est compostable.`
            };
        case 'dangerous':
            return {
                icon: ExclamationTriangleIcon,
                bgColor: 'bg-red-50', borderColor: 'border-red-300',
                iconBgColor: 'bg-red-100', iconColor: 'text-red-600',
                titleColor: 'text-red-800', title: '⚠ Déchet dangereux',
                message: `Attention, traitement spécial requis pour ce type de déchet.`
            };
        default: // non-recyclable
            return {
                icon: XCircleIcon,
                bgColor: 'bg-orange-50', borderColor: 'border-orange-300',
                iconBgColor: 'bg-orange-100', iconColor: 'text-orange-600',
                titleColor: 'text-orange-800', title: '✖ Non recyclable',
                message: `Ce déchet (${formatCategoryName(props.category)}) n'est pas recyclable.`
            };
    }
});

const formatCategoryName = (cat: string) => cat.charAt(0).toUpperCase() + cat.slice(1);

const getBinColorClass = (color: string) => {
    const colors: Record<string, string> = {
        'jaune': 'bg-yellow-400', 'vert': 'bg-green-500', 'bleu': 'bg-blue-500',
        'gris': 'bg-gray-500', 'rouge': 'bg-red-500', 'marron': 'bg-amber-700'
    };
    return colors[color.toLowerCase()] || 'bg-gray-400';
};
</script>

<template>
    <div 
        class="h-auto w-full flex flex-col gap-4 rounded-xl shadow-lg p-4 sm:p-5 transition-all duration-300 hover:shadow-xl border-2"
        :class="[recommendationConfig.bgColor, recommendationConfig.borderColor]"
    >
        <div v-if="props.isLoading" class="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-700">
            <svg class="animate-spin h-8 w-8 text-[#1C4E3D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="mt-4 font-semibold">Analyse en cours...</p>
        </div>

        <div v-else-if="props.category === 'unknown'" class="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-700">
            <TruckIcon class="w-12 h-12 text-[#1C4E3D]"/>
            <h1 class="text-xl font-bold mt-4">Commencez l'analyse</h1>
            <p class="text-center text-sm mt-2 max-w-xs">Téléchargez une image pour obtenir des instructions.</p>
        </div>
        
        <template v-else>
            <div class="flex items-start gap-3 sm:gap-4">
                <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-lg flex flex-shrink-0 items-center justify-center" :class="recommendationConfig.iconBgColor">
                    <component :is="recommendationConfig.icon" class="w-6 h-6 sm:w-7 sm:h-7" :class="recommendationConfig.iconColor" />
                </div>
                <div class="flex-1 min-w-0">
                    <h1 class="text-lg sm:text-xl font-bold mb-1" :class="recommendationConfig.titleColor">{{ recommendationConfig.title }}</h1>
                    <p class="text-sm sm:text-base text-gray-700 leading-relaxed">{{ recommendationConfig.message }}</p>
                </div>
            </div>

            <div class="w-full flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full flex-shrink-0" :class="getBinColorClass(currentConfig.binColor)"></div>
                    <div>
                        <p class="text-sm text-gray-500">Bac recommandé</p>
                        <p class="text-base font-bold text-gray-800">Bac {{ currentConfig.binColor.toUpperCase() }}</p>
                    </div>
                </div>
                <div class="text-right">
                    <MapPinIcon class="w-5 h-5 text-gray-500 mb-1 ml-auto" />
                    <p class="text-xs text-gray-500 font-semibold">{{ nearestLocation }}</p>
                </div>
            </div>

            <div v-if="currentConfig.specialInstructions && props.generalClass !== 'recyclable'" class="flex items-start gap-2 p-3 bg-red-50 border-2 border-red-300 rounded-lg">
                <ExclamationTriangleIcon class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p class="text-xs sm:text-sm font-medium text-red-800">{{ currentConfig.specialInstructions }}</p>
            </div>

            <div class="flex flex-col gap-3 pl-0 sm:pl-16">
                <div class="flex items-center gap-2">
                    <LightBulbIcon class="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <h2 class="text-base sm:text-lg font-semibold text-gray-800">Recommandations :</h2>
                </div>
                <ul class="space-y-2">
                    <li v-for="(recommendation, index) in currentConfig.recommendations" :key="index" class="flex items-start gap-2.5 text-sm sm:text-base text-gray-700">
                        <span class="flex-shrink-0 w-5 h-5 rounded-full bg-white flex items-center justify-center text-xs font-bold shadow-sm" :class="recommendationConfig.iconColor">
                            {{ index + 1 }}
                        </span>
                        <span class="leading-relaxed">{{ recommendation }}</span>
                    </li>
                </ul>
            </div>
        </template>
    </div>
</template>

<style scoped>
li span:first-child { transition: transform 0.2s ease; }
li:hover span:first-child { transform: scale(1.15); }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin { animation: spin 1s linear infinite; }
</style>