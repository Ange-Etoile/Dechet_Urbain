<script setup lang="ts">
import { ArrowPathIcon, CheckCircleIcon, QuestionMarkCircleIcon, WrenchScrewdriverIcon } from '@heroicons/vue/24/outline';

</script>

<template>
    <div class="h-auto rounded-xl shadow-lg w-full p-5 flex flex-col gap-6 items-start  bg-[#1C4E3D]">
        <div class="flex items-start gap-2 w-full">
            <div class="w-10 h-10 rounded-lg bg-[#B7D9E4]  flex flex-shrink-0 items-center justify-center ">
                <CheckCircleIcon class="w-5 h-5 text-white"/>
            </div> 
            <h1 class="text-xl font-bold text-white">Résultat de l'analyse</h1>
        </div>
        <div class="w-full flex flex-col gap-2 rounded-lg p-4 h-auto min-h-[80px] bg-white ">
            <div class="flex items-start justify-between">
                <div class="flex items-start gap-2 ">
                    <div class="w-10 h-10 rounded-lg bg-[#B7D9E4]  flex flex-shrink-0 items-center justify-center ">
                        <ArrowPathIcon class="w-5 h-5 text-white"/>
                    </div> 
                    <div>
                        <h1>Categorie</h1>
                        <h1 class="text-xl font-bold">Recyclable</h1>
                    </div>
                </div>
                <h1 class="text-xl font-bold">90%</h1>
            </div>
            <div class="w-full h-3 rounded-full bg-white">
                <div class="w-[90%] h-full rounded-full bg-blue-700"></div>
            </div>
        </div>
        <div class="w-full flex flex-col gap-2 rounded-lg p-4 h-auto min-h-[80px] bg-white ">
            <div class="flex items-start justify-between">
                <div class="flex items-start gap-2 ">
                    <div class="w-10 h-10 rounded-lg bg-[#B7D9E4]  flex flex-shrink-0 items-center justify-center ">
                        <WrenchScrewdriverIcon class="w-5 h-5 text-white"/>
                    </div> 
                    <div>
                        <h1>Classe</h1>
                        <h1 class="text-xl font-bold">Metal</h1>
                    </div>
                </div>
                <h1 class="text-xl font-bold">90%</h1>
            </div>
            <div class="w-full h-3 rounded-full bg-white">
                <div class="w-[96%] h-full rounded-full bg-[#1C4E3D]"></div>
            </div>
        </div>
        
    </div>
</template>