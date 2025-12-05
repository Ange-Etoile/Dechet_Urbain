<script setup lang="ts">
interface Props {
  icone: any;
  title: string;
  content: string;
  color?: string;
  bgColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  color: '#1C4E3D',
  bgColor: '#B7D9E4'
});
</script>

<template>
  <div class="h-auto min-h-[140px] w-full flex flex-col gap-3 sm:gap-4 rounded-xl shadow-lg bg-white p-4 sm:p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div 
      class="w-11 h-11 sm:w-12 sm:h-12 rounded-lg flex flex-shrink-0 items-center justify-center transition-transform hover:scale-110"
      :style="{ backgroundColor: bgColor }"
    >
      <component 
        class="w-5 h-5 sm:w-6 sm:h-6" 
        :is="icone"
        :style="{ color: color }"
      />
    </div> 
    <div class="flex flex-col gap-1.5">
      <h1 
        class="text-lg sm:text-xl font-bold"
        :style="{ color: color }"
      >
        {{ title }}
      </h1>
      <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
        {{ content }}
      </p>
    </div>
  </div>
</template>