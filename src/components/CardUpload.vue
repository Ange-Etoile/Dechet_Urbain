<script setup lg="ts">
    import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/vue/24/outline';

</script>
<template>
    <div class="h-auto min-h-[400px] w-full flex flex-col  gap-4 flex-1 rounded-xl shadow-lg bg-white p-4">
        <h1>Télécharger un fichier</h1>
        <div class="w-full h-[300px] flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-400 rounded-xl">
            <div class="w-14 h-14 rounded-full bg-[#B7D9E4] flex flex-shrink-0 items-center justify-center ">
                <ArrowUpTrayIcon class="w-5 h-5 text-[#1C4E3D]"/>
            </div>
            <div class="flex flex-col items-center justify-center gap-4">
                <h1 class="text-xl font-bold">Glisser et déposez votre fichier ici</h1>
                <h2 class="text-lg">Ou cliquez pour parcourir</h2>
                <h3 class="text-md">Format acceptés : .PNG, .JPG, .MP4, .AVI</h3>
            </div>
        </div>
    </div>
</template>