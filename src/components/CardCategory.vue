<script setup>
import { ArrowPathIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';
import { stringify } from 'postcss';
const props = defineProps({
    icone:{
        type:[Object,String],
        required:true
    },
    title:{
        type:String,

    },
    content:{
        type:String,
        required:true
    }
})
</script>

<template>
    <div class="h-auto min-h-[100px] w-full flex flex-col  gap-4 flex-1 rounded-xl shadow-lg bg-white p-4">
        <div class="w-10 h-10 rounded-lg bg-[#B7D9E4]  flex flex-shrink-0 items-center justify-center ">
                <component class="w-5 h-5 text-White " :is="icone"/>
        </div> 
        <div>
            <h1 class="text-lg font-semibold">{{ title }}</h1>
            <p>{{ content }}</p>
        </div>
    </div>
</template>