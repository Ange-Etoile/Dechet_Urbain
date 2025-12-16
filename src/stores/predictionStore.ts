import { ref, computed } from 'vue';
import axios from 'axios';

const BACKEND_URL = "https://angeetoile-waste-classifier-backend.hf.space/predict";

// ⚠️ CRÉER LES REF EN DEHORS DE LA FONCTION (SINGLETON)
const predictionResults = ref<any[]>([]);
const recyclingInfo = ref<any>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Getters
const mainPrediction = computed(() => predictionResults.value[0] || null);

const currentGeneralClass = computed(() => {
  return recyclingInfo.value?.generalClass || 'non-recyclable';
});

const recyclableProbability = computed(() => {
  return mainPrediction.value?.confidence || 0;
});

// Actions
const reset = () => {
  predictionResults.value = [];
  recyclingInfo.value = null;
  isLoading.value = false;
  error.value = null;
};

const uploadAndPredict = async (fileToUpload: File) => {
  if (!fileToUpload) {
    error.value = "Aucun fichier sélectionné";
    return;
  }

  console.log("🚀 Upload started");
  reset();
  isLoading.value = true;

  const formData = new FormData();
  formData.append('image', fileToUpload);

  try {
    const response = await axios.post(BACKEND_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });

    const data = response.data;
    console.log("✅ Response:", data);

    if (data.success) {
      predictionResults.value = data.predictions;
      recyclingInfo.value = {
        binColor: data.recycling_info.binColor,
        recommendations: data.recycling_info.recommendations,
        generalClass: data.general_class,
      };
      
      console.log("📦 Predictions:", predictionResults.value);
      console.log("♻️ Recycling Info:", recyclingInfo.value);
    } else {
      error.value = "Réponse invalide du serveur";
    }
  } catch (err: any) {
    console.error("❌ Error:", err);
    error.value = err.response?.data?.error || "Échec de l'analyse. Réessayez.";
  } finally {
    isLoading.value = false;
    console.log("🏁 Upload finished, isLoading:", isLoading.value);
  }
};

// Export du store comme singleton
export const usePredictionStore = () => {
  return {
    predictionResults,
    recyclingInfo,
    isLoading,
    error,
    mainPrediction,
    currentGeneralClass,
    recyclableProbability,
    uploadAndPredict,
    reset
  };
};