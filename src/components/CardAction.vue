<script setup lang="ts">
import { ref, onUnmounted, nextTick } from 'vue';
import { CameraIcon, XMarkIcon, ArrowPathIcon, PhotoIcon } from '@heroicons/vue/24/outline';

const emit = defineEmits<{
  (e: 'photoTaken', file: File): void;
}>();

const videoElement = ref<HTMLVideoElement | null>(null);
const canvasElement = ref<HTMLCanvasElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null); // Pour le mode secours
const stream = ref<MediaStream | null>(null);
const capturedImage = ref<string | null>(null);
const isStreaming = ref(false);
const error = ref<string | null>(null);
const facingMode = ref<'user' | 'environment'>('environment');

// FONCTION PRINCIPALE : Démarrer la caméra dans l'application
const startCamera = async () => {
  try {
    error.value = null;
    isStreaming.value = true; // On affiche l'élément vidéo avant de chercher le flux
    
    await nextTick(); // On attend que le DOM affiche le <video>

    const constraints = {
      video: {
        facingMode: facingMode.value, // Retrait de "exact" pour plus de compatibilité
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };

    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    stream.value = mediaStream;
    
    if (videoElement.value) {
      videoElement.value.srcObject = mediaStream;
      
      // FORCE LA LECTURE (crucial pour Chrome Mobile)
      videoElement.value.onloadedmetadata = () => {
        videoElement.value?.play().catch(e => {
            console.error("Erreur autoplay:", e);
            error.value = "Cliquez sur l'écran pour activer la vidéo.";
        });
      };
    }
  } catch (err) {
    console.error('Erreur caméra:', err);
    isStreaming.value = false;
    error.value = "La caméra en direct est bloquée. Utilisez le mode 'Photo Système'.";
  }
};

// MODE SECOURS : Ouvre l'appareil photo natif du téléphone
const openNativeCamera = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      capturedImage.value = e.target?.result as string;
      emit('photoTaken', file);
    };
    reader.readAsDataURL(file);
  }
};

const takePhoto = () => {
  if (!videoElement.value || !canvasElement.value) return;
  
  const video = videoElement.value;
  const canvas = canvasElement.value;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const context = canvas.getContext('2d');
  if (context) {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture.jpg`, { type: 'image/jpeg' });
        capturedImage.value = canvas.toDataURL('image/jpeg');
        stopCamera();
        emit('photoTaken', file);
      }
    }, 'image/jpeg', 0.9);
  }
};

const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
    stream.value = null;
  }
  isStreaming.value = false;
};

const reset = () => {
  stopCamera();
  capturedImage.value = null;
  error.value = null;
};

onUnmounted(() => stopCamera());
</script>

<template>
  <div class="w-full flex flex-col gap-4 rounded-2xl shadow-xl bg-white p-4 border border-gray-100">
    
    <div class="flex items-center justify-between px-2">
      <h2 class="text-lg font-bold text-[#1C4E3D]">Analyseur de déchets</h2>
      <button v-if="isStreaming" @click="reset" class="text-gray-400 hover:text-red-500">
        <XMarkIcon class="w-6 h-6" />
      </button>
    </div>

    <div class="relative w-full aspect-[3/4] bg-gray-900 rounded-2xl overflow-hidden shadow-inner">
      
      <video 
        v-if="isStreaming"
        ref="videoElement" 
        autoplay 
        muted
        playsinline
        class="w-full h-full object-cover"
      ></video>

      <img v-else-if="capturedImage" :src="capturedImage" class="w-full h-full object-cover" />

      <div v-else class="w-full h-full flex flex-col items-center justify-center p-6 text-center">
        <div class="w-20 h-20 bg-[#1C4E3D]/10 rounded-full flex items-center justify-center mb-4">
          <CameraIcon class="w-10 h-10 text-[#1C4E3D]" />
        </div>
        <p v-if="error" class="text-red-400 text-sm mb-4">{{ error }}</p>
        <p v-else class="text-gray-400 text-sm mb-6">Prêt pour l'identification ?</p>
      </div>

      <div v-if="isStreaming" class="absolute bottom-6 left-0 right-0 flex justify-center">
        <button @click="takePhoto" class="w-20 h-20 rounded-full border-4 border-white bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl">
          <div class="w-16 h-16 rounded-full bg-white"></div>
        </button>
      </div>
    </div>

    <div v-if="!isStreaming && !capturedImage" class="grid grid-cols-1 gap-3">
      <button @click="startCamera" class="flex items-center justify-center gap-3 bg-[#1C4E3D] text-white py-4 rounded-xl font-bold shadow-lg">
        <CameraIcon class="w-6 h-6" />
        Scanner en direct
      </button>
      
      <button @click="openNativeCamera" class="flex items-center justify-center gap-3 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold">
        <PhotoIcon class="w-6 h-6" />
        Photo Système / Galerie
      </button>
    </div>

    <button v-if="capturedImage" @click="reset" class="w-full py-3 bg-gray-800 text-white rounded-xl font-bold">
        Reprendre une photo
    </button>

    <input 
      type="file" 
      ref="fileInput" 
      accept="image/*" 
      capture="environment" 
      class="hidden" 
      @change="handleFileUpload" 
    />
    
    <canvas ref="canvasElement" class="hidden"></canvas>
  </div>
</template>