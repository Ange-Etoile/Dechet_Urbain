<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue';

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>

<template>
  <header class="w-full rounded-lg bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-20">
        <!-- Logo -->
        <router-link 
          to="/" 
          class="flex items-center gap-3 group"
        >
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-[#1C4E3D] to-[#2a6b56] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div class="flex flex-col">
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1C4E3D] group-hover:text-[#2a6b56] transition-colors">
              Waste Recycling
            </h1>
            <p class="text-xs sm:text-sm text-gray-500 hidden sm:block">
              Gestion intelligente des déchets
            </p>
          </div>
        </router-link>

        <!-- Navigation Desktop -->
        <nav class="hidden md:flex items-center gap-8">
          <router-link 
            to="/" 
            class="text-base lg:text-lg font-medium text-gray-700 hover:text-[#1C4E3D] transition-colors relative group"
          >
            Accueil
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1C4E3D] group-hover:w-full transition-all duration-300"></span>
          </router-link>
          
          <router-link 
            to="/resultats" 
            class="text-base lg:text-lg font-medium text-gray-700 hover:text-[#1C4E3D] transition-colors relative group"
          >
            Analyser
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1C4E3D] group-hover:w-full transition-all duration-300"></span>
          </router-link>
        </nav>

        <!-- Bouton Menu Mobile -->
        <button 
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Bars3Icon v-if="!isMobileMenuOpen" class="w-6 h-6 text-gray-700" />
          <XMarkIcon v-else class="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>

    <!-- Menu Mobile -->
    <div 
      v-if="isMobileMenuOpen"
      class="md:hidden bg-white border-t border-gray-200 shadow-lg"
    >
      <nav class="flex flex-col px-4 py-4 space-y-3">
        <router-link 
          to="/" 
          @click="toggleMobileMenu"
          class="px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Accueil
        </router-link>
        
        <router-link 
          to="/resultats" 
          @click="toggleMobileMenu"
          class="px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Analyser
        </router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.router-link-active {
  color: #1C4E3D;
}
</style>