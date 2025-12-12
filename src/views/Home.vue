<script setup lang="ts">
import { 
  ArrowRightIcon,
  SparklesIcon,
  CameraIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  GlobeAltIcon
} from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';

const router = useRouter();

const started = () => {
  router.push('/resultats');
};

const features = [
  {
    icon: SparklesIcon,
    title: 'Intelligence Artificielle',
    description: 'Modèle multi-tâche avancé pour une classification précise',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: CameraIcon,
    title: 'Analyse en Temps Réel',
    description: 'Capturez une image et obtenez des résultats instantanés',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: ChartBarIcon,
    title: '12 Catégories',
    description: 'Classification détaillée de tous types de déchets',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: CheckCircleIcon,
    title: 'Recyclabilité',
    description: 'Détection automatique du potentiel de recyclage',
    color: 'from-orange-500 to-orange-600'
  }
];

const stats = [
  { value: '95%', label: 'Précision' },
  { value: '12', label: 'Catégories' },
  { value: '<2s', label: 'Temps réel' }
];
</script>

<template>
  <div class="w-full min-h-screen flex flex-col">
    <Header />
    
    <main class="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex-1">
      <!-- Hero Section -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 py-12 sm:py-16 lg:py-24 items-center">
        <!-- Contenu Texte -->
        <div class="flex flex-col gap-6 sm:gap-8 order-2 lg:order-1">
          <div class="flex flex-col gap-4 sm:gap-5">
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-[#B7D9E4]/30 rounded-full w-fit">
              <SparklesIcon class="w-5 h-5 text-[#1C4E3D]" />
              <span class="text-sm font-medium text-[#1C4E3D]">Intelligence Artificielle</span>
            </div>
            
            <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
              L'IA au Service du
              <span class="text-[#1C4E3D] block mt-2">Tri Intelligent</span>
            </h1>
            
            <h2 class="text-lg sm:text-xl lg:text-2xl text-gray-600 font-medium">
              Modèle Multi-Tâche pour la Gestion des Déchets
            </h2>
            
            <p class="text-base sm:text-lg text-gray-600 leading-relaxed">
              Dans l'écosystème complexe de la gestion des déchets urbains, l'efficacité du tri est cruciale. 
              Notre modèle de Machine Learning révolutionne cette étape essentielle en apportant 
              <span class="font-semibold text-[#1C4E3D]">précision et rapidité</span> directement sur le terrain.
            </p>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              @click="started"
              class="group flex items-center justify-center gap-2 px-8 py-4 bg-[#1C4E3D] text-white rounded-full font-semibold text-base sm:text-lg hover:bg-[#2a6b56] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Commencer l'analyse
              <ArrowRightIcon class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div v-for="stat in stats" :key="stat.label" class="text-center">
              <p class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C4E3D]">{{ stat.value }}</p>
              <p class="text-sm sm:text-base text-gray-600 mt-1">{{ stat.label }}</p>
            </div>
          </div>
        </div>

        <!-- Image -->
        <div class="order-1 lg:order-2">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-br from-[#1C4E3D]/10 to-[#B7D9E4]/30 rounded-3xl blur-3xl"></div>
            <img 
              src="/src/assets/images/waste_dataset.png" 
              alt="Analyse de déchets"
              class="relative w-full h-auto rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500"
            />
            
            <!-- Badge flottant -->
            <div class="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 hidden sm:block">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircleIcon class="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <p class="text-sm text-gray-500">Analyse réussie</p>
                  <p class="text-lg font-bold text-gray-900">Recyclable</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-16 sm:py-20 lg:py-24">
        <div class="text-center mb-12 sm:mb-16">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Pourquoi choisir notre solution ?
          </h2>
          <p class="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Une technologie de pointe pour une gestion optimale des déchets
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div 
            v-for="feature in features" 
            :key="feature.title"
            class="group bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
          >
            <div 
              class="w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
              :class="feature.color"
            >
              <component :is="feature.icon" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ feature.title }}</h3>
            <p class="text-gray-600 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-16 sm:py-20 lg:py-24">
        <div class="bg-gradient-to-br from-[#1C4E3D] to-[#2a6b56] rounded-3xl p-8 sm:p-12 lg:p-16 text-center shadow-2xl">
          <div class="max-w-3xl mx-auto">
            <GlobeAltIcon class="w-16 h-16 text-white/80 mx-auto mb-6" />
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Prêt à révolutionner votre tri ?
            </h2>
            <p class="text-lg sm:text-xl text-white/90 mb-8">
              Rejoignez les centaines d'utilisateurs qui optimisent déjà leur gestion des déchets avec notre IA
            </p>
            <button
              @click="started"
              class="group inline-flex items-center gap-3 px-1 py-2 sm:px-10 sm:py-5 bg-white text-[#1C4E3D] rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Commencer maintenant
              <ArrowRightIcon class="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="w-auto bg-white rounded-lg border-2 border-[#1C4E3D] py-8 mt-16">
      <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 text-center">
        <p class="text-[#2a6b56]">© 2025 Waste Recycling. Tous droits réservés.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Animations personnalisées */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.hover\:scale-105:hover {
  animation: float 3s ease-in-out infinite;
}
</style>