import { ref, computed } from 'vue';
import axios from 'axios';

interface Prediction {
  category: string;
  confidence: number;
}

// L'URL de votre endpoint de prédiction sur Hugging Face
const RENDER_BACKEND_URL = "https://angeetoile-waste-classifier-backend.hf.space/predict";

// Temps d'attente maximum pour la requête (150 secondes)
const AXIOS_TIMEOUT_MS = 150000;

export const usePredictionStore = () => {
  const predictionResults = ref<Prediction[]>([]);
  const recyclingInfo = ref<any>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Propriété calculée pour la catégorie principale (la plus haute confiance)
  const mainPrediction = computed(() => {
    if (predictionResults.value.length === 0) return null;
    return predictionResults.value.reduce((prev, current) =>
      current.confidence > prev.confidence ? current : prev
    );
  });

  // Calcule si le déchet est recyclable ou non, basé sur les infos du backend
  const isRecyclable = computed(() => {
    return recyclingInfo.value?.recyclable === true;
  });

  // Calcule la probabilité pour la barre de progression de recyclage
  const recyclableProbability = computed(() => {
    const mainPred = mainPrediction.value;

    if (!mainPred) return 0;

    // Si c'est recyclable, la probabilité est la confiance de la meilleure catégorie
    if (isRecyclable.value) {
      return mainPred.confidence;
    }
    return mainPred.confidence;
  });

  const reset = () => {
    predictionResults.value = [];
    recyclingInfo.value = null;
    isLoading.value = false;
    error.value = null;
  };

  // Fonction d'appel API pour l'upload (utilise Axios)
  const uploadAndPredict = async (fileToUpload: File) => {
    console.log("--- 1. uploadAndPredict DÉMARRÉ ---");

    if (!fileToUpload) {
      error.value = "Aucun fichier sélectionné pour l'analyse.";
      return;
    }

    reset();
    isLoading.value = true;

    const formData = new FormData();
    formData.append('image', fileToUpload);

    try {
      const response = await axios.post(RENDER_BACKEND_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: AXIOS_TIMEOUT_MS,
      });

      const data = response.data;

      console.log("--- 2. Réponse API reçue ! ---");
      console.log("Structure de la réponse complète :", data);

      // Mise à jour de l'état
      predictionResults.value = data.prediction.top3_categories.map((p: any) => ({
        category: p.category,
        confidence: p.confidence
      }));

      recyclingInfo.value = data.recycling_info;

    } catch (err) {
      console.error("Erreur lors de l'analyse:", err);

      let errorMessage = `Échec de l'analyse. Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`;

      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          errorMessage = `La connexion a expiré après 2m30s. Le modèle est trop lent ou le serveur ne répond pas.`;
        } else if (err.response) {
          errorMessage = err.response.data.message || `Erreur serveur HTTP ${err.response.status}`;
        } else {
          errorMessage = `Erreur réseau ou CORS: Impossible de connecter au serveur. (${err.message})`;
        }
      }

      error.value = errorMessage;

    } finally {
      isLoading.value = false;
    }
  };

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