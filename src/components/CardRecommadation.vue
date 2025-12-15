<script setup lang="ts">
import { 
    LightBulbIcon, 
    CheckCircleIcon, 
    ExclamationTriangleIcon,
    InformationCircleIcon,
    MapPinIcon,
    XCircleIcon,
    TruckIcon // Ajout de TruckIcon pour l'état initial
} from '@heroicons/vue/24/outline';
import { computed } from 'vue';

interface Props {
    category?: string;
    isRecyclable?: boolean;
    binColor?: string; // AJOUTÉ : Couleur du bac du Store
    recommendations?: string[]; // AJOUTÉ : Liste des recommandations du Store
    nearestLocation?: string;
    // AJOUTÉ : État d'analyse
    isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    category: 'unknown', // Remplacé 'metal' par 'unknown'
    isRecyclable: false, // Remplacé true par false
    binColor: 'gris',
    recommendations: () => [],
    nearestLocation: 'Non disponible',
    isLoading: false
});

// Configuration de secours (fallbacks) pour les instructions statiques
const categoryFallbacks: Record<string, {
    recommendations: string[];
    binColor: string;
    isRecyclable: boolean;
    icon: any;
    specialInstructions?: string;
}> = {
    // NOTE : J'utilise le nom 'trash' pour l'inconnu, mais vous pouvez ajuster
    'unknown': {
        recommendations: ['Lancez une analyse pour obtenir des instructions détaillées.', 'La localisation des points de collecte est essentielle pour un bon tri.'],
        binColor: 'gris',
        isRecyclable: false,
        icon: InformationCircleIcon,
        specialInstructions: 'Aucune analyse effectuée. Instructions par défaut affichées.'
    },
    // ... (Le reste de vos objets 'paper', 'plastic', etc. est conservé tel quel pour les fallbacks)
    'trash': {
        recommendations: [
          'Placez ce déchet dans la poubelle des ordures ménagères',
          'Assurez-vous que le déchet est bien fermé dans un sac',
          'Ne mélangez pas avec les déchets recyclables'
        ],
        binColor: 'gris',
        isRecyclable: false,
        icon: XCircleIcon,
        specialInstructions: 'Déchets destinés à l\'incinération ou à l\'enfouissement'
    },
    'paper': {
        recommendations: [
          'Assurez-vous que le papier est propre et sec',
          'Retirez les agrafes, trombones et autres attaches métalliques',
          'Aplatissez les cartons pour gagner de l\'espace',
          'Placez dans le bac de recyclage papier'
        ],
        binColor: 'bleu',
        isRecyclable: true,
        icon: CheckCircleIcon
    },
    'plastic': {
        recommendations: [
          'Rincez le contenant pour enlever les résidus',
          'Retirez les bouchons et étiquettes si possible',
          'Vérifiez le symbole de recyclage (1, 2, 4, 5 sont recyclables)',
          'Placez dans le bac jaune de recyclage'
        ],
        binColor: 'jaune',
        isRecyclable: true,
        icon: CheckCircleIcon
    },
    'glass': {
        recommendations: [
          'Rincez le verre pour enlever les résidus alimentaires',
          'Retirez les bouchons et couvercles métalliques',
          'Pas besoin de retirer les étiquettes',
          'Déposez dans le conteneur à verre (vert, blanc, brun)'
        ],
        binColor: 'vert',
        isRecyclable: true,
        icon: CheckCircleIcon
    },
    'medical': {
        recommendations: [
          'NE PAS jeter avec les ordures ménagères',
          'Placez les objets pointus dans un conteneur rigide',
          'Apportez à une pharmacie ou point de collecte spécialisé',
          'Suivez les protocoles de sécurité sanitaire'
        ],
        binColor: 'rouge',
        isRecyclable: false,
        icon: ExclamationTriangleIcon,
        specialInstructions: 'DANGER - Déchets médicaux à risque infectieux. Collecte spécialisée obligatoire'
    },
    'metal': {
        recommendations: [
          'Rincez les contenants métalliques',
          'Les boîtes de conserve vides sont recyclables',
          'Séparez l\'aluminium de l\'acier si possible',
          'Placez dans le bac jaune de recyclage'
        ],
        binColor: 'jaune',
        isRecyclable: true,
        icon: CheckCircleIcon
    },
    'e-waste': {
        recommendations: [
          'NE JAMAIS jeter à la poubelle ordinaire',
          'Retirez les piles et batteries si possible',
          'Apportez à un point de collecte DEEE (Déchets d\'Équipements Électriques)',
          'Certains magasins reprennent gratuitement les anciens appareils'
        ],
        binColor: 'rouge',
        isRecyclable: false,
        icon: ExclamationTriangleIcon,
        specialInstructions: 'Déchets électroniques contenant des substances dangereuses. Recyclage spécialisé requis'
    },
    'automobile waste': {
        recommendations: [
          'Apportez à une déchetterie ou garage agréé',
          'Les huiles moteur doivent être collectées séparément',
          'Les pièces métalliques peuvent être valorisées',
          'Ne jamais abandonner sur la voie publique'
        ],
        binColor: 'rouge',
        isRecyclable: false,
        icon: ExclamationTriangleIcon,
        specialInstructions: 'Déchets automobiles : huiles, filtres, pneus. Point de collecte spécialisé obligatoire'
    },
    'battery': {
        recommendations: [
          'NE JAMAIS jeter avec les ordures ménagères',
          'Protégez les bornes avec du ruban adhésif',
          'Déposez dans les bornes de collecte (supermarchés, mairies)',
          'Les batteries au lithium nécessitent une attention particulière'
        ],
        binColor: 'rouge',
        isRecyclable: false,
        icon: ExclamationTriangleIcon,
        specialInstructions: 'DANGER - Risque d\'incendie et de pollution. Collecte spécialisée obligatoire'
    },
    'cardboard': {
        recommendations: [
          'Aplatissez les cartons pour économiser l\'espace',
          'Retirez les rubans adhésifs et agrafes',
          'Le carton doit être propre et sec',
          'Placez dans le bac bleu ou bac à cartons'
        ],
        binColor: 'bleu',
        isRecyclable: true,
        icon: CheckCircleIcon
    },
    'food organic': {
        recommendations: [
          'Idéal pour le compostage domestique',
          'Utilisez un bac à compost ou lombricomposteur',
          'Si compostage indisponible, placez dans le bac marron (déchets organiques)',
          'Évitez viandes et produits laitiers dans le compost domestique'
        ],
        binColor: 'marron',
        isRecyclable: true,
        icon: CheckCircleIcon,
        specialInstructions: 'Déchets compostables qui enrichissent le sol'
    }
};


// 1. Obtenir la configuration, en priorisant les données dynamiques du store
const currentConfig = computed(() => {
    // Si nous avons des recommandations du store, on les utilise directement
    if (props.recommendations.length > 0) {
        // Chercher l'icône de la catégorie dans la configuration de secours
        const fallback = categoryFallbacks[props.category.toLowerCase()] || categoryFallbacks['unknown'];

        return {
            recommendations: props.recommendations,
            binColor: props.binColor || fallback.binColor, // Utiliser le binColor du Store
            isRecyclable: props.isRecyclable,
            icon: props.isRecyclable ? CheckCircleIcon : fallback.icon,
            specialInstructions: fallback.specialInstructions // On utilise l'instruction spéciale si elle existe
        };
    }
    
    // Sinon, utiliser les données statiques (fallbacks) basées sur la catégorie
    return categoryFallbacks[props.category.toLowerCase()] || categoryFallbacks['unknown'];
});


// 2. Configuration du style selon recyclabilité (utilise currentConfig)
const recommendationConfig = computed(() => {
    // Utilisez les données de currentConfig pour déterminer le style
    if (currentConfig.value.isRecyclable) {
        return {
            icon: CheckCircleIcon,
            bgColor: 'bg-green-50',
            borderColor: 'border-green-300',
            iconBgColor: 'bg-green-100',
            iconColor: 'text-green-600',
            titleColor: 'text-green-800',
            title: '✓ Déchet recyclable',
            message: `Ce déchet de type "${formatCategoryName(props.category)}" doit être placé dans le bac de recyclage.`
        };
    } else {
        return {
            icon: currentConfig.value.icon,
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-300',
            iconBgColor: 'bg-orange-100',
            iconColor: 'text-orange-600',
            titleColor: 'text-orange-800',
            title: '⚠ Déchet non-recyclable',
            message: `Ce déchet de type "${formatCategoryName(props.category)}" nécessite un traitement spécial.`
        };
    }
});

// Formater le nom de la catégorie (inchangé)
const formatCategoryName = (category: string) => {
    const names: Record<string, string> = {
        'unknown': 'À analyser',
        'trash': 'Ordures ménagères',
        'paper': 'Papier',
        'plastic': 'Plastique',
        'glass': 'Verre',
        'medical': 'Déchets médicaux',
        'metal': 'Métal',
        'e-waste': 'Déchets électroniques',
        'automobile waste': 'Déchets automobiles',
        'battery': 'Piles et batteries',
        'cardboard': 'Carton',
        'food organic': 'Déchets organiques'
    };
    return names[category.toLowerCase()] || category;
};

// Obtenir la classe Tailwind pour la couleur du bac (inchangé)
const getBinColorClass = (color: string) => {
    const colors: Record<string, string> = {
        'jaune': 'bg-yellow-400',
        'vert': 'bg-green-500',
        'bleu': 'bg-blue-500',
        'gris': 'bg-gray-500',
        'rouge': 'bg-red-500',
        'marron': 'bg-amber-700'
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
            <p class="text-center text-sm mt-2 max-w-xs">
                Téléchargez une image ou prenez une photo pour obtenir des instructions de tri personnalisées.
            </p>
        </div>
        
        <template v-else>
            <div class="flex items-start gap-3 sm:gap-4">
                <div 
                    class="w-11 h-11 sm:w-12 sm:h-12 rounded-lg flex flex-shrink-0 items-center justify-center"
                    :class="recommendationConfig.iconBgColor"
                >
                    <component 
                        :is="recommendationConfig.icon" 
                        class="w-6 h-6 sm:w-7 sm:h-7"
                        :class="recommendationConfig.iconColor"
                    />
                </div>
                <div class="flex-1 min-w-0">
                    <h1 
                        class="text-lg sm:text-xl font-bold mb-1"
                        :class="recommendationConfig.titleColor"
                    >
                        {{ recommendationConfig.title }}
                    </h1>
                    <p class="text-sm sm:text-base text-gray-700 leading-relaxed">
                        {{ recommendationConfig.message }}
                    </p>
                </div>
            </div>

            <div class="w-full flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
                <div class="flex items-center gap-3">
                    <div 
                        class="w-8 h-8 rounded-full flex-shrink-0" 
                        :class="getBinColorClass(currentConfig.binColor)"
                    ></div>
                    <div>
                        <p class="text-sm text-gray-500">Bac de tri recommandé</p>
                        <p class="text-base font-bold text-gray-800">Bac {{ currentConfig.binColor.toUpperCase() }}</p>
                    </div>
                </div>
                <div class="text-right">
                    <MapPinIcon class="w-5 h-5 text-gray-500 mb-1" />
                    <p class="text-xs text-gray-500 font-semibold">{{ nearestLocation }}</p>
                </div>
            </div>

            <div 
                v-if="currentConfig.specialInstructions && !currentConfig.isRecyclable"
                class="flex items-start gap-2 p-3 bg-red-50 border-2 border-red-300 rounded-lg"
            >
                <ExclamationTriangleIcon class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p class="text-xs sm:text-sm font-medium text-red-800">
                    {{ currentConfig.specialInstructions }}
                </p>
            </div>

            <div class="flex flex-col gap-3 pl-0 sm:pl-16">
                <div class="flex items-center gap-2">
                    <LightBulbIcon class="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <h2 class="text-base sm:text-lg font-semibold text-gray-800">
                        Recommandations :
                    </h2>
                </div>
                
                <ul class="space-y-2">
                    <li 
                        v-for="(recommendation, index) in currentConfig.recommendations" 
                        :key="index"
                        class="flex items-start gap-2.5 text-sm sm:text-base text-gray-700"
                    >
                        <span 
                            class="flex-shrink-0 w-5 h-5 rounded-full bg-white flex items-center justify-center text-xs font-bold" 
                            :class="recommendationConfig.iconColor"
                        >
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
/* Animation pour les puces numérotées */
li span:first-child {
    transition: transform 0.2s ease;
}

li:hover span:first-child {
    transform: scale(1.15);
}

/* Animation de chargement */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>