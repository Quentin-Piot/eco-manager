import {Alert} from "react-native";
import {authService} from "~/lib/services/auth.service";
import {cloudStorageService} from "~/lib/services/cloud-storage.service";

interface DataConflictResolverOptions {
  restoreDataFromCloud: () => Promise<void>;
  forceSave: () => Promise<void>;
  refreshData: () => Promise<void>;
  onComplete?: () => void;
  maxRetries?: number;
  retryDelay?: number;
}

export class DataConflictResolver {
  static async handleDataConflictResolution({
    restoreDataFromCloud,
    forceSave,
    refreshData,
    onComplete,
    maxRetries = 10,
    retryDelay = 500,
  }: DataConflictResolverOptions): Promise<void> {
    try {
      // Wait for authentication with retry logic
      const isAuthenticated = await this.waitForAuthentication(
        maxRetries,
        retryDelay,
      );

      if (!isAuthenticated) {
        console.log(
          "Délai d'authentification dépassé, proposition de nouvelle tentative",
        );

        // Show alert to retry or continue without sync
        Alert.alert(
          "Problème d'authentification",
          "L'authentification prend plus de temps que prévu. Que souhaitez-vous faire ?",
          [
            {
              text: "Réessayer",
              onPress: async () => {
                // Retry with extended timeout
                await this.handleDataConflictResolution({
                  restoreDataFromCloud,
                  forceSave,
                  refreshData,
                  onComplete,
                  maxRetries: 20,
                  retryDelay: 1000,
                });
              },
            },
            {
              text: "Continuer sans synchronisation",
              onPress: () => {
                console.log(
                  "L'utilisateur a choisi de continuer sans synchronisation",
                );
                onComplete?.();
              },
            },
          ],
        );
        return;
      }

      // Check if there's data in the cloud
      const cloudData = await cloudStorageService.getFinancialData();

      if (
        cloudData &&
        (cloudData.transactions?.length > 0 ||
          cloudData.monthlyBudget ||
          cloudData.spendingCategories?.length > 0)
      ) {
        Alert.alert(
          "Données trouvées dans le cloud",
          "Nous avons trouvé des données existantes dans votre stockage cloud. Que souhaitez-vous faire ?",
          [
            {
              text: "Restaurer depuis le cloud",
              onPress: async () => {
                try {
                  await restoreDataFromCloud();
                  await refreshData();
                  Alert.alert(
                    "Succès",
                    "Vos données ont été restaurées depuis le cloud.",
                  );
                  onComplete?.();
                } catch (error) {
                  console.error("Erreur lors de la restauration:", error);
                  Alert.alert(
                    "Erreur",
                    "Échec de la restauration des données depuis le cloud.",
                  );
                  onComplete?.();
                }
              },
            },
            {
              text: "Écraser le cloud",
              style: "destructive",
              onPress: async () => {
                try {
                  await forceSave();
                  Alert.alert(
                    "Succès",
                    "Vos données locales ont été synchronisées vers le cloud.",
                  );
                  onComplete?.();
                } catch (error) {
                  console.error("Erreur lors de la synchronisation:", error);
                  Alert.alert(
                    "Erreur",
                    "Échec de la synchronisation des données vers le cloud.",
                  );
                  onComplete?.();
                }
              },
            },
            {
              text: "Annuler",
              style: "cancel",
              onPress: () => onComplete?.(),
            },
          ],
        );
      } else {
        // No cloud data, just sync local data
        try {
          await forceSave();
          console.log(
            "Données locales synchronisées vers le cloud avec succès",
          );
        } catch (error) {
          console.error(
            "Erreur lors de la synchronisation des données locales:",
            error,
          );
        }
        onComplete?.();
      }
    } catch (error) {
      console.error(
        "Erreur lors de la résolution du conflit de données:",
        error,
      );
      onComplete?.(); // Continue anyway
    }
  }

  private static async waitForAuthentication(
      maxRetries: number = 10,
      retryDelay: number = 500,
  ): Promise<boolean> {
    for (let i = 0; i < maxRetries; i++) {
      if (authService.isAuthenticated()) {
        return true;
      }
      console.log(
          `En attente d'authentification... tentative ${i + 1}/${maxRetries}`,
      );
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
    return false;
  }
}