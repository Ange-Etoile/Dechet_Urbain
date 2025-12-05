<script setup lang="ts">
import { ref } from 'vue';
import { ArrowUpTrayIcon, PhotoIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);

const acceptedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'video/mp4', 'video/avi'];

const handleClick = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    processFile(target.files[0]);
  }
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = false;
  
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    processFile(event.dataTransfer.files[0]);
  }
};

const processFile = (file: File) => {
  if (!acceptedFormats.includes(file.type)) {
    alert('Format de fichier non accepté. Veuillez choisir une image PNG, JPG ou une vidéo MP4, AVI.');
    return;
  }
  
  selectedFile.value = file;
  
  // Créer une prévisualisation pour les images
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  } else {
    previewUrl.value = null;
  }
};

const removeFile = () => {
  selectedFile.value = null;
  previewUrl.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};
</script>

<template>
  <div class="h-auto max-h-[400px] w-full flex flex-col gap-4 flex-1 rounded-xl shadow-lg bg-white p-4 sm:p-6">
    <h1 class="text-xl sm:text-2xl font-bold text-gray-800">Télécharger un fichier</h1>
    
    <!-- Zone de drop -->
    <div 
      @click="handleClick"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      :class="[
        'w-full min-h-[280px] sm:min-h-[300px] flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200',
        isDragging ? 'border-[#1C4E3D] bg-[#B7D9E4]/20 scale-[0.98]' : 'border-gray-300 hover:border-[#1C4E3D] hover:bg-gray-50',
        selectedFile ? 'bg-gray-50' : ''
      ]"
    >
      <input 
        ref="fileInput"
        type="file" 
        accept=".png,.jpg,.jpeg,.mp4,.avi"
        @change="handleFileSelect"
        class="hidden"
      />
      
      <!-- Affichage si aucun fichier n'est sélectionné -->
      <div v-if="!selectedFile" class="flex flex-col items-center justify-center gap-4 px-4">
        <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#B7D9E4] flex flex-shrink-0 items-center justify-center transition-transform hover:scale-110">
          <ArrowUpTrayIcon class="w-6 h-6 sm:w-7 sm:h-7 text-[#1C4E3D]"/>
        </div>
        <div class="flex flex-col items-center justify-center gap-2 text-center">
          <h2 class="text-lg sm:text-xl font-semibold text-gray-700">
            Glissez et déposez votre fichier ici
          </h2>
          <p class="text-sm sm:text-base text-gray-500">
            Ou cliquez pour parcourir
          </p>
          <p class="text-xs sm:text-sm text-gray-400 mt-2">
            Formats acceptés : PNG, JPG, MP4, AVI
          </p>
        </div>
      </div>
      
      <!-- Affichage si un fichier est sélectionné -->
      <div v-else class="flex flex-col items-center justify-center gap-4 w-full px-4">
        <!-- Prévisualisation image -->
        <div v-if="previewUrl" class="relative w-full max-w-xs">
          <img :src="previewUrl" alt="Prévisualisation" class="w-full h-auto max-h-[200px] object-contain rounded-lg shadow-md"/>
          <button 
            @click.stop="removeFile"
            class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
          >
            <XMarkIcon class="w-5 h-5"/>
          </button>
        </div>
        
        <!-- Info fichier vidéo -->
        <div v-else class="flex items-center gap-3 bg-white rounded-lg p-4 shadow-md w-full max-w-xs">
          <PhotoIcon class="w-10 h-10 text-[#1C4E3D] flex-shrink-0"/>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-700 truncate">{{ selectedFile.name }}</p>
            <p class="text-xs text-gray-500">{{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB</p>
          </div>
          <button 
            @click.stop="removeFile"
            class="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
          >
            <XMarkIcon class="w-5 h-5"/>
          </button>
        </div>
        
        <p class="text-sm text-gray-500 text-center">
          Cliquez pour changer de fichier
        </p>
      </div>
    </div>
  </div>
</template>