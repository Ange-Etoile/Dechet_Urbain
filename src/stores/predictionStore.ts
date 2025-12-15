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
  generalClass?: string;
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

const isRecyclable = computed(() => {
  return recyclingInfo.value?.recyclable === true;
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
  console.log("🚀 uploadAndPredict DÉMARRÉ");

  if (!fileToUpload) {
    error.value = "Aucun fichier sélectionné pour l'analyse.";
    return;
  }

  reset();
  isLoading.value = true;

  const formData = new FormData();
  formData.append('image', fileToUpload);

  try {
    console.log("📤 Envoi de la requête...");
    
    const response = await axios.post(BACKEND_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: AXIOS_TIMEOUT_MS,
    });

    const data = response.data;

    console.log("✅ Réponse API reçue !");
    console.log("📊 Data complète:", data);

    if (!data.prediction || !data.prediction.top3_categories) {
      throw new Error("Structure de réponse invalide");
    }

    // Mise à jour des prédictions
    predictionResults.value = data.prediction.top3_categories.map((p: any) => ({
      category: p.category.toLowerCase().replace(/\s+/g, '_'),
      confidence: p.confidence
    }));

    // Mise à jour des infos de recyclage - CORRIGÉ
    recyclingInfo.value = {
      recyclable: data.recycling_info.recyclable || false,
      binColor: data.recycling_info.bin_color || 'gris',
      recommendations: data.recycling_info.recommendations || [],
      specialInstructions: data.recycling_info.special_instructions || '',
      generalClass: data.recycling_info.general_class || data.prediction.general_class?.name || 'non-recyclable',
      iconType: data.recycling_info.icon_type || 'warning',
      message: data.recycling_info.message || ''
    };

    console.log("📦 predictionResults:", predictionResults.value);
    console.log("♻️ recyclingInfo:", recyclingInfo.value);
    console.log("✅ isRecyclable:", isRecyclable.value);

  } catch (err) {
    console.error("❌ Erreur lors de l'analyse:", err);

    let errorMessage = `Échec de l'analyse.`;

    if (axios.isAxiosError(err)) {
      if (err.code === 'ECONNABORTED') {
        errorMessage = `La connexion a expiré après 2m30s.`;
      } else if (err.response) {
        console.error("📛 Réponse erreur:", err.response.data);
        errorMessage = err.response.data.message || `Erreur serveur HTTP ${err.response.status}`;
      } else {
        errorMessage = `Erreur réseau: ${err.message}`;
      }
    }

    error.value = errorMessage;

  } finally {
    isLoading.value = false;
    console.log("🏁 Terminé - isLoading:", isLoading.value);
  }
};

export const usePredictionStore = () => {
  return {
    predictionResults,
    recyclingInfo,
    isLoading,
    error,
    mainPrediction,
    isRecyclable,
    recyclableProbability,
    uploadAndPredict,
    reset
  };
};
