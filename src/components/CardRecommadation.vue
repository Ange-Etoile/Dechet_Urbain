<script setup lang="ts">
import { 
  LightBulbIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  MapPinIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline';
import { computed } from 'vue';

interface Props {
  category?: string;
  isRecyclable?: boolean;
  nearestLocation?: string;
}

const props = withDefaults(defineProps<Props>(), {
  category: 'metal',
  isRecyclable: true,
  nearestLocation: 'Centre de tri - 2.5 km'
});

// Configuration complète pour les 12 catégories
const categoryRecommendations: Record<string, {
  recommendations: string[];
  binColor: string;
  isRecyclable: boolean;
  icon: any;
  specialInstructions?: string;
}> = {
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

// Obtenir la configuration pour la catégorie actuelle
const currentConfig = computed(() => {
  const config = categoryRecommendations[props.category.toLowerCase()] || categoryRecommendations['trash'];
  return config;
});

// Configuration du style selon recyclabilité
const recommendationConfig = computed(() => {
  if (currentConfig.value.isRecyclable) {
    return {
      icon: CheckCircleIcon,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      titleColor: 'text-green-800',
      title: '✓ Déchet recyclable',
      message: `Ce déchet de type "${formatCategoryName(props.category)}" peut être recyclé.`
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

// Formater le nom de la catégorie
const formatCategoryName = (category: string) => {
  const names: Record<string, string> = {
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

// Obtenir la couleur du bac
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
    <!-- En-tête avec statut -->
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

    <!-- Alerte spéciale pour déchets dangereux -->
    <div 
      v-if="currentConfig.specialInstructions && !currentConfig.isRecyclable"
      class="flex items-start gap-2 p-3 bg-red-50 border-2 border-red-300 rounded-lg"
    >
      <ExclamationTriangleIcon class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <p class="text-xs sm:text-sm font-medium text-red-800">
        {{ currentConfig.specialInstructions }}
      </p>
    </div>

    <!-- Instructions détaillées -->
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
</style>