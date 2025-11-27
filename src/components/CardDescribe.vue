<script setup lang="ts">
import { ArrowDownTrayIcon, ArrowsUpDownIcon, CameraIcon, MagnifyingGlassIcon, QuestionMarkCircleIcon } from '@heroicons/vue/24/outline';
</script>

<template>
    <div class="h-auto rounded-xl shadow-lg w-full p-5 flex items-start gap-4 bg-white">
        <div class="w-10 h-10 rounded-lg bg-[#1C4E3D] flex flex-shrink-0 items-center justify-center ">
            <QuestionMarkCircleIcon class="w-5 h-5 text-white"/>
        </div>
        <div class="flex flex-col gap-4">
            <h2 class="text-xl font-bold">Comment ca marche?</h2>
            <p>Notre application utilise l'Intelligence artificielle pour identifier et classer automatiquement nos dechets.
                Prenez simplement une photo,telechargez une image de votre dechets et notre systeme vous indiquera dans quel categorie il appartient.</p>
            <div class="w-full flex justify-between ">
                <div class="flex flex-col gap-4">
                    <div class="flex items-start gap-4">
                        <div class="flex items-center justify-center">
                            <ArrowDownTrayIcon class="w-5 h-5"/>
                        </div>
                        <div class="flex flex-col">
                            <h1 class="text-lg font-semibold">Télécharger</h1>
                            <p>Glisser deposer une image ou vidéo de votre dechet</p>
                        </div>
                    </div>
                    <div class="flex items-start  gap-4">
                        <div class="flex items-center justify-center">
                            <MagnifyingGlassIcon class="w-5 h-5"/>
                        </div>
                        <div class="flex flex-col">
                            <h1 class="text-lg font-semibold">Analyser</h1>
                            <p>L'IA identifie les categories en quelques secondes</p>
                        </div>
                    </div>
                    
                </div>
                <div class="flex flex-col gap-4">
                    <div class="flex items-start  gap-4">
                        <div class="flex items-center justify-center">
                            <CameraIcon class="w-5 h-5"/>
                        </div>
                        <div class="flex flex-col">
                            <h1 class="text-lg font-semibold">Photographier</h1>
                            <p>Glisser votre camera pour captuere une image</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-4">
                        <div class="flex items-center justify-center">
                            <ArrowsUpDownIcon class="w-5 h-5"/>
                        </div>
                        <div class="flex flex-col">
                            <h1 class="text-lg font-semibold">Trier</h1>
                            <p>Decouvrez comment eliminer correctement votre dechet</p>
                        </div>
                    </div>
                    
                </div>
               
            </div>
        </div>
    </div>
</template>