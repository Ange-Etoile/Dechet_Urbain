import { ref, computed } from 'vue';
import axios from 'axios';

interface Prediction {
  category: string;
  confidence: number;
}

interface RecyclingInfo {
  recyclable: boolean;
  binColor: string;
  recommendations: string[];
  specialInstructions?: string;
  generalClass: string;
  iconType?: string;
  message?: string;
}

const BACKEND_URL = "https://angeetoile-waste-classifier-backend.hf.space/predict";
const AXIOS_TIMEOUT_MS = 150000;

const predictionResults = ref<Prediction[]>([]);
const recyclingInfo = ref<RecyclingInfo | null>(null);
const isLoading = ref<boolean>(false);
const error = ref<string | null>(null);

const mainPrediction = computed(() => {
  if (predictionResults.value.length === 0) return null;
  return predictionResults.value.reduce((prev, current) =>
    current.confidence > prev.confidence ? current : prev
  );
});


const currentGeneralClass = computed(() => {
  return recyclingInfo.value?.generalClass || 'non-recyclable';
});

const recyclableProbability = computed(() => {
  const mainPred = mainPrediction.value;
  if (!mainPred) return 0;
  return mainPred.confidence;
});

const reset = () => {
  predictionResults.value = [];
  recyclingInfo.value = null;
  isLoading.value = false;
  error.value = null;
};

const uploadAndPredict = async (fileToUpload: File) => {
  if (!fileToUpload) {
    error.value = "Aucun fichier sélectionné.";
    return;
  }

  reset();
  isLoading.value = true;

  const formData = new FormData();
  formData.append('image', fileToUpload);

  try {
    const response = await axios.post(BACKEND_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: AXIOS_TIMEOUT_MS,
    });

    const data = response.data;

    if (data.success && data.predictions) {
      predictionResults.value = data.predictions.map((p: any) => ({
        category: p.category,
        confidence: p.confidence
      }));
      recyclingInfo.value = {
        recyclable: data.recycling_info.binColor !== 'gris', 
        binColor: data.recycling_info.binColor, 
        recommendations: data.recycling_info.recommendations,
        generalClass: data.general_class, 
        message: data.main_prediction.category 
      };
    }

  } catch (err: any) {
    // Affiche l'erreur réelle dans la console pour débugger
    console.error("Détails de l'erreur axios:", err.response?.data || err.message);
    error.value = err.response?.data?.message || "Échec de l'analyse.";
  } finally {
    isLoading.value = false;
  }
};

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