import { ref, computed } from 'vue';
import axios from 'axios';

interface Prediction {
  category: string;
  confidence: number;
}

interface RecyclingInfo {
  recyclable: boolean; // Gardé pour la logique interne
  binColor: string;
  recommendations: string[];
  specialInstructions?: string;
  generalClass: string; // OBLIGATOIRE MAINTENANT
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

// REMPLACÉ : On expose la classe générale au lieu d'un simple booléen
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

    // Mise à jour des prédictions (on garde les noms exacts du backend)
    predictionResults.value = data.prediction.top3_categories.map((p: any) => ({
      category: p.category,
      confidence: p.confidence
    }));

    // Mise à jour des infos avec la CLASSE GÉNÉRALE
    recyclingInfo.value = {
      recyclable: data.recycling_info.recyclable,
      binColor: data.recycling_info.bin_color,
      recommendations: data.recycling_info.recommendations,
      specialInstructions: data.recycling_info.special_instructions,
      generalClass: data.recycling_info.general_class, // 'recyclable', 'organique', etc.
      iconType: data.recycling_info.icon_type,
      message: data.recycling_info.message
    };

  } catch (err) {
    error.value = "Échec de l'analyse.";
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