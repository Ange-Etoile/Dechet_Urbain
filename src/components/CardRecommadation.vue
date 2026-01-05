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
        specialInstructions: 'Analyse en attente.'
    },
    'food organics': {
        recommendations: ['Idéal pour le compostage domestique', 'Ne pas mettre de restes de viande ou de produits laitiers', 'Retirez les éventuels autocollants sur les fruits'],
        binColor: 'marron',
        icon: CheckBadgeIcon,
        specialInstructions: 'VALORISATION - Transformable en engrais naturel pour vos plantes.'
    },
    'textile trash': {
        recommendations: ['Utilisez les bornes de collecte spécialisées (ex: Le Relais)', 'Donnez les vêtements en bon état à des associations', 'Lavez et séchez avant de déposer en borne'],
        binColor: 'gris',
        icon: XCircleIcon,
        specialInstructions: 'RÉEMPLOI - 90% des textiles peuvent être réutilisés ou recyclés en isolant.'
    },
    'automobile wastes': {
        recommendations: ['Dépôt obligatoire en déchèterie ou garage agréé', 'Ne jamais jeter dans les égouts ou canalisations', 'Manipulez avec des gants si possible'],
        binColor: 'rouge',
        icon: ExclamationTriangleIcon,
        specialInstructions: 'DANGER - Les huiles et liquides sont extrêmement toxiques pour l\'eau.'
    },
    'battery waste': {
        recommendations: ['Déposez dans les bornes de collecte en magasin', 'Ne pas jeter dans la poubelle ordinaire', 'Recouvrez les pôles avec du ruban adhésif'],
        binColor: 'rouge',
        icon: ExclamationTriangleIcon,
        specialInstructions: 'RISQUE INCENDIE - Les métaux lourds peuvent contaminer durablement le sol.'
    },
    'cardboard': {
        recommendations: ['Aplatissez les cartons pour optimiser l\'espace', 'Retirez les gros scotchs et agrafes métalliques', 'Le carton doit être sec et sans restes de nourriture'],
        binColor: 'bleu',
        icon: CheckCircleIcon,
        specialInstructions: 'VOLUME - Pensez à plier pour ne pas saturer les bacs de collecte.'
    },
    'e-waste': {
        recommendations: ['Rapportez l\'ancien appareil lors d\'un nouvel achat', 'Déposez en déchèterie dans le bac DEEE', 'Effacez vos données personnelles avant le dépôt'],
        binColor: 'rouge',
        icon: ExclamationTriangleIcon,
        specialInstructions: 'RESSOURCES - Contient des métaux rares récupérables (or, argent, cuivre).'
    },
    'glass': {
        recommendations: ['Retirez les bouchons et capsules en métal', 'Videz bien le contenu, pas besoin de laver', 'Attention : pas de miroirs, ampoules ou vaisselle cassée'],
        binColor: 'vert',
        icon: CheckCircleIcon,
        specialInstructions: 'SÉCURITÉ - Ne mélangez pas le verre culinaire (plats) avec le verre d\'emballage.'
    },
    'medical': {
        recommendations: ['Rapportez les médicaments périmés en pharmacie', 'Utilisez les boîtes jaunes sécurisées pour les aiguilles', 'NE PAS jeter avec les ordures ménagères'],
        binColor: 'rouge',
        icon: ExclamationTriangleIcon,
        specialInstructions: 'DANGER INFECTIEUX - Traitement obligatoire par une filière sécurisée.'
    },
    'metal': {
        recommendations: ['Rincez les boîtes de conserve et canettes', 'Les aérosols vides sont acceptés dans le bac jaune', 'Le métal se recycle à l\'infini sans perte'],
        binColor: 'jaune',
        icon: CheckCircleIcon,
        specialInstructions: 'ÉCONOMIE D\'ÉNERGIE - Recycler l\'aluminium consomme 95% d\'énergie en moins.'
    },
    'paper': {
        recommendations: ['Journaux, magazines et prospectus acceptés', 'Ne pas froisser les feuilles inutilement', 'Retirez les films plastiques des courriers'],
        binColor: 'bleu',
        icon: CheckCircleIcon,
        specialInstructions: 'QUALITÉ - Le papier mouillé ou gras (pizza) ne peut plus être recyclé.'
    },
    'plastic': {
        recommendations: ['Videz bien les bouteilles et flacons', 'Laissez les bouchons vissés sur les bouteilles', 'Inutile de laver, il suffit de bien vider'],
        binColor: 'jaune',
        icon: CheckCircleIcon,
        specialInstructions: 'TRI SIMPLIFIÉ - Désormais, tous les emballages plastiques se trient.'
    },
    'trash': {
        recommendations: ['Utilisez pour les déchets non recyclables souillés', 'Fermez hermétiquement le sac poubelle', 'Évitez de jeter des objets tranchants sans protection'],
        binColor: 'gris',
        icon: XCircleIcon,
        specialInstructions: 'DÉCHET FINAL - Ce qui est jeté ici sera brûlé ou enterré.'
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
                titleColor: 'text-emerald-800', title: 'Déchet organique',
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

            <!-- <div class="w-full flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
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
            </div> -->

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