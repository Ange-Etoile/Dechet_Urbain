<script setup lang="ts">
import { CameraIcon, VideoCameraIcon } from '@heroicons/vue/24/outline';

</script>

<template>
  <div class="h-auto max-h-[200px] w-full flex flex-col  gap-4 flex-1 rounded-xl shadow-lg bg-white p-4">
    <h1 class="text-lg font-bold">Utilisez votre caméra</h1>
    <div class="flex items-center w-full justify-center gap-2  p-2.5 cursor-pointer rounded-lg bg-[#1C4E3D]">
        <CameraIcon class="w-5 h-5 text-white"/>
        <button class="text-white">Prendre une photo</button>  
    </div>
    <div class="flex items-center w-full justify-center gap-2  p-2.5 cursor-pointer rounded-lg bg-[#1C4E3D]">
        <VideoCameraIcon class="w-5 h-5 text-white"/>
        <button class="text-white">Detecter en video</button>  
    </div>
    
  </div>  
</template>