<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { CameraIcon, VideoCameraIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';

const emit = defineEmits<{
  (e: 'photoTaken', file: File): void;
  (e: 'videoStarted'): void;
  (e: 'videoStopped'): void;
}>();

const videoElement = ref<HTMLVideoElement | null>(null);
const canvasElement = ref<HTMLCanvasElement | null>(null);
const stream = ref<MediaStream | null>(null);
const capturedImage = ref<string | null>(null);
const isStreaming = ref(false);
const isVideoMode = ref(false);
const error = ref<string | null>(null);
const facingMode = ref<'user' | 'environment'>('environment'); // 'environment' pour caméra arrière

// Démarrer la caméra
const startCamera = async (videoMode = false) => {
  try {
    error.value = null;
    isVideoMode.value = videoMode;
    
    // Demander l'accès à la caméra
    const constraints = {
      video: {
        facingMode: facingMode.value,
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      },
      audio: videoMode // Audio seulement pour le mode vidéo
    };
    
    stream.value = await navigator.mediaDevices.getUserMedia(constraints);
    
    if (videoElement.value) {
      videoElement.value.srcObject = stream.value;
      await videoElement.value.play();
      isStreaming.value = true;
      
      if (videoMode) {
        emit('videoStarted');
      }
    }
  } catch (err) {
    console.error('Erreur accès caméra:', err);
    error.value = 'Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.';
  }
};

// Arrêter la caméra
const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
    stream.value = null;
  }
  isStreaming.value = false;
  isVideoMode.value = false;
  emit('videoStopped');
};

// Prendre une photo
const takePhoto = () => {
  if (!videoElement.value || !canvasElement.value) return;
  
  const video = videoElement.value;
  const canvas = canvasElement.value;
  
  // Définir les dimensions du canvas
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  // Dessiner l'image actuelle de la vidéo sur le canvas
  const context = canvas.getContext('2d');
  if (context) {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convertir en blob puis en file
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
        capturedImage.value = canvas.toDataURL('image/jpeg');
        stopCamera();
        emit('photoTaken', file);
      }
    }, 'image/jpeg', 0.95);
  }
};

// Changer de caméra (avant/arrière)
const switchCamera = async () => {
  facingMode.value = facingMode.value === 'user' ? 'environment' : 'user';
  if (isStreaming.value) {
    stopCamera();
    await startCamera(isVideoMode.value);
  }
};

// Retourner en arrière
const goBack = () => {
  stopCamera();
  capturedImage.value = null;
  error.value = null;
};

// Nettoyer au démontage du composant
onUnmounted(() => {
  stopCamera();
});
</script>

<template>
  <div class="h-auto w-full flex flex-col gap-4 rounded-xl shadow-lg bg-white p-4 sm:p-6">
    <div class="flex items-center justify-between">
      <h1 class="text-lg sm:text-xl font-bold text-gray-800">Utilisez votre caméra</h1>
      <button 
        v-if="isStreaming"
        @click="switchCamera"
        class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        title="Changer de caméra"
      >
        <ArrowPathIcon class="w-5 h-5 text-gray-700" />
      </button>
    </div>
    
    <!-- Message d'erreur -->
    <div v-if="error" class="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-600">{{ error }}</p>
    </div>
    
    <!-- Zone de prévisualisation caméra -->
    <div 
      v-if="isStreaming" 
      class="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
    >
      <video 
        ref="videoElement" 
        autoplay 
        playsinline
        class="w-full h-full object-cover"
      ></video>
      
      <!-- Overlay pour mode vidéo -->
      <div v-if="isVideoMode" class="absolute top-4 left-4 px-3 py-1 bg-red-600 rounded-full flex items-center gap-2">
        <span class="w-2 h-2 bg-white rounded-full animate-pulse"></span>
        <span class="text-white text-sm font-semibold">EN DIRECT</span>
      </div>
      
      <!-- Boutons de contrôle -->
      <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-4">
        <button
          v-if="!isVideoMode"
          @click="takePhoto"
          class="w-16 h-16 rounded-full bg-white hover:bg-gray-100 border-4 border-[#1C4E3D] transition-all hover:scale-110 flex items-center justify-center shadow-lg"
        >
          <CameraIcon class="w-7 h-7 text-[#1C4E3D]" />
        </button>
        
        <button
          @click="goBack"
          class="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center shadow-lg"
        >
          <XMarkIcon class="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
    
    <!-- Image capturée -->
    <div v-else-if="capturedImage" class="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
      <img :src="capturedImage" alt="Photo capturée" class="w-full h-full object-contain" />
      
      <button
        @click="goBack"
        class="absolute top-4 right-4 w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center shadow-lg"
      >
        <XMarkIcon class="w-5 h-5 text-white" />
      </button>
      
      <div class="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
        <p class="text-sm font-medium text-gray-800">Photo capturée avec succès !</p>
      </div>
    </div>
    
    <!-- Boutons d'action initiaux -->
    <div v-else class="flex flex-col sm:flex-row items-center w-full gap-3">
      <button
        @click="startCamera(false)"
        class="flex items-center w-full justify-center gap-2 p-3 sm:p-3.5 rounded-lg bg-[#1C4E3D] hover:bg-[#2a6b56] transition-all duration-200 hover:shadow-md active:scale-95"
      >
        <CameraIcon class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        <span class="text-white font-medium text-sm sm:text-base">Prendre une photo</span>
      </button>
      
      <button
        @click="startCamera(true)"
        class="flex items-center w-full justify-center gap-2 p-3 sm:p-3.5 rounded-lg bg-[#1C4E3D] hover:bg-[#2a6b56] transition-all duration-200 hover:shadow-md active:scale-95"
      >
        <VideoCameraIcon class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        <span class="text-white font-medium text-sm sm:text-base">Détecter en vidéo</span>
      </button>
    </div>
    
    <!-- Canvas caché pour la capture -->
    <canvas ref="canvasElement" class="hidden"></canvas>
    
    <!-- Info supplémentaire -->
    <div v-if="!isStreaming && !capturedImage" class="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <p class="text-xs sm:text-sm text-blue-700">
        <span class="font-semibold">Astuce :</span> Assurez-vous d'autoriser l'accès à la caméra dans votre navigateur.
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>