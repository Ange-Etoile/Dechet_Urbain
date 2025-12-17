<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { CameraIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';

const emit = defineEmits<{
  (e: 'photoTaken', file: File): void;
}>();

const videoElement = ref<HTMLVideoElement | null>(null);
const canvasElement = ref<HTMLCanvasElement | null>(null);
const stream = ref<MediaStream | null>(null);
const capturedImage = ref<string | null>(null);
const isStreaming = ref(false);
const error = ref<string | null>(null);
const facingMode = ref<'user' | 'environment'>('environment');

// Démarrer la caméra
const startCamera = async () => {
  try {
    error.value = null;
    
    // Contraintes optimisées pour mobile
    const constraints = {
      video: {
        facingMode: facingMode.value,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false // Désactivé car non nécessaire pour la photo
    };
    
    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    stream.value = mediaStream;
    
    if (videoElement.value) {
      videoElement.value.srcObject = mediaStream;
      // Important pour mobile : playsinline est déjà dans le template
      isStreaming.value = true;
    }
  } catch (err) {
    console.error('Erreur accès caméra:', err);
    error.value = "L'accès à la caméra a été refusé ou n'est pas disponible sur ce navigateur (vérifiez que vous êtes en HTTPS).";
  }
};

// Arrêter la caméra
const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
    stream.value = null;
  }
  isStreaming.value = false;
};

// Prendre une photo
const takePhoto = () => {
  if (!videoElement.value || !canvasElement.value) return;
  
  const video = videoElement.value;
  const canvas = canvasElement.value;
  
  // Utiliser les dimensions réelles du flux vidéo
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const context = canvas.getContext('2d');
  if (context) {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `waste-${Date.now()}.jpg`, { type: 'image/jpeg' });
        capturedImage.value = canvas.toDataURL('image/jpeg');
        stopCamera();
        emit('photoTaken', file);
      }
    }, 'image/jpeg', 0.90);
  }
};

// Switch Caméra
const switchCamera = async () => {
  facingMode.value = facingMode.value === 'user' ? 'environment' : 'user';
  if (isStreaming.value) {
    stopCamera();
    await startCamera();
  }
};

const reset = () => {
  stopCamera();
  capturedImage.value = null;
  error.value = null;
};

onUnmounted(() => {
  stopCamera();
});
</script>

<template>
  <div class="h-auto w-full flex flex-col gap-4 rounded-xl shadow-lg bg-white p-4 sm:p-6 border border-gray-100">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <CameraIcon class="w-6 h-6 text-[#1C4E3D]" />
        <h1 class="text-lg font-bold text-gray-800">Appareil photo</h1>
      </div>
      <button 
        v-if="isStreaming"
        @click="switchCamera"
        class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <ArrowPathIcon class="w-5 h-5 text-gray-700" />
      </button>
    </div>
    
    <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
      {{ error }}
    </div>
    
    <div v-if="isStreaming" class="relative w-full aspect-square sm:aspect-video bg-black rounded-xl overflow-hidden shadow-inner">
      <video 
        ref="videoElement" 
        autoplay 
        muted
        playsinline
        class="w-full h-full object-cover"
      ></video>
      
      <div class="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-6">
        <button
          @click="reset"
          class="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/30"
        >
          <XMarkIcon class="w-6 h-6 text-white" />
        </button>

        <button
          @click="takePhoto"
          class="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-[#1C4E3D] shadow-2xl active:scale-90 transition-transform"
        >
          <div class="w-16 h-16 rounded-full border-2 border-white/20"></div>
        </button>
        
        <div class="w-12"></div> </div>
    </div>
    
    <div v-else-if="capturedImage" class="relative w-full aspect-square sm:aspect-video bg-gray-100 rounded-xl overflow-hidden border">
      <img :src="capturedImage" class="w-full h-full object-contain" />
      <button
        @click="reset"
        class="absolute top-4 right-4 p-2 rounded-full bg-red-500 text-white shadow-lg"
      >
        <XMarkIcon class="w-6 h-6" />
      </button>
      <div class="absolute bottom-4 left-0 right-0 text-center">
        <span class="px-4 py-2 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-[#1C4E3D] shadow-md">
          PHOTO ANALYSÉE
        </span>
      </div>
    </div>
    
    <div v-else class="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
      <div class="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
        <CameraIcon class="w-10 h-10 text-[#1C4E3D]" />
      </div>
      <p class="text-gray-500 text-sm mb-6 text-center px-4">
        Prenez une photo claire du déchet pour une meilleure détection
      </p>
      <button
        @click="startCamera"
        class="px-8 py-3 bg-[#1C4E3D] text-white rounded-full font-bold shadow-lg hover:bg-[#256650] transition-all active:scale-95"
      >
        Ouvrir l'appareil photo
      </button>
    </div>

    <canvas ref="canvasElement" class="hidden"></canvas>
  </div>
</template>