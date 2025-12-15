import { ref, computed } from 'vue';
import axios from 'axios'; 

interface Prediction {
    category: string;
    confidence: number;
}

// L'URL de votre endpoint de prédiction sur Render
const RENDER_BACKEND_URL = "https://angeetoile-waste-classifier-backend.hf.space/predict"; 

// Temps d'attente maximum pour la requête (150 secondes pour laisser une marge après les 120s de Gunicorn)
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

    // Fonction pour réinitialiser l'état
    const reset = () => {
        predictionResults.value = [];
        recyclingInfo.value = null;
        isLoading.value = false;
        error.value = null;
    };

    // Nouvelle fonction d'appel API pour l'upload (utilise Axios)
    const uploadAndPredict = async (fileToUpload: File) => {
        console.log("--- 1. uploadAndPredict DÉMARRÉ ---")
        if (!fileToUpload) {
            error.value = "Aucun fichier sélectionné pour l'analyse.";
            return;
        }

        reset();
        isLoading.value = true;
        
        const formData = new FormData();
        // IMPORTANT : Le nom 'image' correspond à ce que Flask attend (request.files['image'])
        formData.append('image', fileToUpload); 

        try {
            // APPEL AXIOS
            const response = await axios.post(RENDER_BACKEND_URL, formData, {
                headers: {
                    // Pas besoin de définir Content-Type, Axios le fait pour FormData
                },
                timeout: AXIOS_TIMEOUT_MS, // Applique le long timeout
            });
            
            // Axios renvoie les données JSON dans response.data
            const data = response.data;
            
            console.log("--- 2. Réponse API reçue ! ---")

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
                    errorMessage = `La connexion a expiré après 2m30s. Le modèle est trop lent ou Render a crashé.`;
                } else if (err.response) {
                    // Erreur de type 4xx/5xx (le backend a répondu)
                    errorMessage = err.response.data.message || `Erreur serveur HTTP ${err.response.status}`;
                } else {
                    // Erreur réseau pure (CORS, 502, etc.)
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
        uploadAndPredict,
        reset
    };
};