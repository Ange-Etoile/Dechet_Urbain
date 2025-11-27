<script setup lang="ts">
import CardAction from '@/components/CardAction.vue';
import CardCategory from '@/components/CardCategory.vue';
import CardDescribe from '@/components/CardDescribe.vue';
import CardOrganic from '@/components/CardOrganic.vue';
import CardRecommadation from '@/components/CardRecommadation.vue';
import CardResult from '@/components/CardResult.vue';
import CardUpload from '@/components/CardUpload.vue';
import Header from '@/components/Header.vue';
import { ArrowDownIcon, ArrowPathIcon, ExclamationTriangleIcon, NoSymbolIcon } from '@heroicons/vue/24/outline';

</script>

<template>
  <div class="w-full min-h-screen h-auto flex flex-col gap-24 p-2">
    <Header/>
    <main class="w-full h-auto flex flex-col gap-5">
        <CardDescribe/>
        <div class="grid grid-cols-2 gap-4">
            <div class="grid grid-cols-1 grid-rows-2 gap-4">
                <CardUpload/>
                <CardAction/>
            </div>
            <div class="grid grid-cols-1 grid-rows-2 gap-4">
                <CardResult/>
                <CardRecommadation/>
            </div>
        </div>
        <div class="flex flex-col gap-2 items-center justify-center">
            <h1 class="text-2xl font-bold">Catégories de dechets</h1>
            <div class="grid  gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
                <CardCategory title="Recyclable" :icone=ArrowPathIcon content="Materiaux pouvant etre recycler. Carton,verre,metal,papier,plastique"></CardCategory>
                <CardCategory title="Organique" :icone=ArrowPathIcon content="Dechets organique biodegradables et composable"></CardCategory>
                <CardCategory title="Dangereux" :icone=ExclamationTriangleIcon content="Dechet dangereux. Batterie,e-waste,dechet medicaux "></CardCategory>
                <CardCategory title="Non-recyclable" :icone=NoSymbolIcon content="Dechets non recylcable,automobile,textile,ordures"></CardCategory>
            </div>
        </div>
    </main>
  </div>  
</template>