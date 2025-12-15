// src/stores/predictionStore.ts
import { ref, computed } from 'vue';

interface Prediction {
    category: string;
    confidence: number;
}

// L'URL de votre endpoint de prédiction sur Render
const RENDER_BACKEND_URL = "https://waste-classification-backend-xcwr.onrender.com/predict"; 

export const usePredictionStore = () => {
    const predictionResults = ref<Prediction[]>([]);
    const recyclingInfo = ref<any>(null); // Pour stocker les détails de recyclage
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

    // Nouvelle fonction d'appel API pour l'upload
    const uploadAndPredict = async (fileToUpload: File) => {
        if (!fileToUpload) {
            error.value = "Aucun fichier sélectionné pour l'analyse.";
            return;
        }

        reset(); // Réinitialiser avant de commencer
        isLoading.value = true;
        
        const formData = new FormData();
        // IMPORTANT : Le nom 'image' doit correspondre à ce que Flask attend (request.files['image'])
        formData.append('image', fileToUpload); 

        try {
            const response = await fetch(RENDER_BACKEND_URL, {
                method: 'POST',
                body: formData, 
            });
            
            // Gérer les erreurs HTTP (4xx ou 5xx)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erreur serveur HTTP ${response.status}`);
            }

            const data = await response.json();

            // Structure de la réponse de votre backend (basée sur votre code Python) :
            // data.prediction.top3_categories est un tableau {category, confidence}
            // data.recycling_info est un objet {recyclable, general_class, message, ...}
            
            // Mise à jour de l'état
            predictionResults.value = data.prediction.top3_categories.map((p: any) => ({
                category: p.category,
                confidence: p.confidence
            }));
            
            // Stocker toutes les infos de recyclage
            recyclingInfo.value = data.recycling_info;

        } catch (err) {
            console.error("Erreur lors de l'analyse:", err);
            error.value = `Échec de l'analyse. Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`;
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