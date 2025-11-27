<script setup lang="ts">
import { LightBulbIcon } from '@heroicons/vue/24/outline';

</script>

<template>
    <div class="h-auto max-h-[80px] w-full flex flex-col  gap-4 flex-1 rounded-xl shadow-lg bg-white p-4">
        <div class="flex items-start gap-4">
            <div class="flex items-center justify-center">
                <LightBulbIcon class="w-5 h-5"/>
            </div>
            <div class="flex flex-col">
                <h1 class="text-lg font-semibold">Recommandation</h1>
                <p>Ce dechet peut etre recycler. Placez-le dans le bac de nettoyage approprié</p>
            </div>
        </div>
    </div>
</template>