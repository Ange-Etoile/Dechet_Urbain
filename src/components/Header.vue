<script setup lang="ts">
import { RouterLink } from 'vue-router';

</script>

<template>
   <header class="w-full h-10 flex gap-20 items-baseline">
        <h1 class="text-4xl font-bold text-[#333333] ">Waste Recycling</h1>
        <nav class="text-lg hover:text-lg">
           <router-link class="group-hover:text-white" to="/">Home</router-link>
        </nav>
    </header> 
</template>