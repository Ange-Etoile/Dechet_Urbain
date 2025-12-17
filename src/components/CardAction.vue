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

// 'environment' force la caméra arrière sur smartphone
const facingMode = ref<'user' | 'environment'>('environment');

const startCamera = async () => {
  try {
    error.value = null;
    
    // Contraintes strictes pour la caméra arrière
    const constraints = {
      video: {
        facingMode: { exact: facingMode.value }, // 'exact' force le choix si disponible
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      },
      audio: false
    };

    // Tentative avec 'exact', sinon repli sur mode simple si échec (certains navigateurs PC)
    let mediaStream;
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (e) {
      mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: facingMode.value } 
      });
    }

    stream.value = mediaStream;
    
    if (videoElement.value) {
      videoElement.value.srcObject = mediaStream;
      isStreaming.value = true;
    }
  } catch (err) {
    console.error('Erreur caméra:', err);
    error.value = "Impossible d'accéder à la caméra arrière. Vérifiez les permissions ou le protocole HTTPS.";
  }
};

const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
    stream.value = null;
  }
  isStreaming.value = false;
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
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        capturedImage.value = canvas.toDataURL('image/jpeg');
        stopCamera();
        emit('photoTaken', file);
      }
    }, 'image/jpeg', 0.90);
  }
};

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

onUnmounted(() => stopCamera());
</script>

<template>
  <div class="h-auto w-full flex flex-col gap-4 rounded-xl shadow-lg bg-white p-4 sm:p-6 border border-gray-100">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <CameraIcon class="w-6 h-6 text-[#1C4E3D]" />
        <h1 class="text-lg font-bold text-gray-800">Scanner un déchet</h1>
      </div>
      <button v-if="isStreaming" @click="switchCamera" class="p-2 rounded-full bg-gray-100">
        <ArrowPathIcon class="w-5 h-5 text-gray-700" />
      </button>
    </div>
    
    <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
      {{ error }}
    </div>
    
    <div v-if="isStreaming" class="relative w-full aspect-square bg-black rounded-xl overflow-hidden">
      <video 
        ref="videoElement" 
        autoplay 
        muted
        playsinline
        class="w-full h-full object-cover"
      ></video>
      
      <div class="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-8">
        <button @click="reset" class="p-3 rounded-full bg-black/40 border border-white/30 text-white">
          <XMarkIcon class="w-6 h-6" />
        </button>

        <button @click="takePhoto" class="w-20 h-20 rounded-full border-4 border-white bg-[#1C4E3D] shadow-2xl flex items-center justify-center">
          <div class="w-14 h-14 rounded-full border-2 border-white/30"></div>
        </button>
        
        <div class="w-12"></div>
      </div>
    </div>
    
    <div v-else-if="capturedImage" class="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden">
      <img :src="capturedImage" class="w-full h-full object-contain" />
      <button @click="reset" class="absolute top-4 right-4 p-2 rounded-full bg-red-500 text-white shadow-lg">
        <XMarkIcon class="w-6 h-6" />
      </button>
    </div>
    
    <div v-else class="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
      <div class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
        <CameraIcon class="w-8 h-8 text-[#1C4E3D]" />
      </div>
      <button
        @click="startCamera"
        class="px-10 py-3 bg-[#1C4E3D] text-white rounded-full font-bold shadow-lg active:scale-95 transition-transform"
      >
        Ouvrir la caméra
      </button>
      <p class="mt-4 text-xs text-gray-400">La caméra arrière sera activée par défaut</p>
    </div>

    <canvas ref="canvasElement" class="hidden"></canvas>
  </div>
</template>