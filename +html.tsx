import { ScrollViewStyleReset } from "expo-router/html";
import { type PropsWithChildren } from "react";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {/* Balises SEO de base */}
        <title>Eco-Manager - Suivi de Dépenses et Revenus</title>
        <meta
          name="description"
          content="Gérez facilement vos dépenses et revenus mensuels avec Eco-Manager. Suivez votre budget, visualisez vos habitudes de dépenses et atteignez vos objectifs financiers."
        />
        <meta
          name="keywords"
          content="gestion budget, suivi dépenses, suivi revenus, application finance personnelle, budget mensuel, économiser argent"
        />

        {/* Open Graph Meta Tags (pour le partage social) */}
        <meta
          property="og:title"
          content="Eco-Manager - Suivi de Dépenses et Revenus"
        />
        <meta
          property="og:description"
          content="Gérez facilement vos dépenses et revenus mensuels avec Eco-Manager. Suivez votre budget, visualisez vos habitudes de dépenses et atteignez vos objectifs financiers."
        />
        <meta property="og:type" content="website" />
        {/* <meta property="og:url" content="[URL de votre application]" /> */}
        {/* <meta property="og:image" content="[URL de l'image de prévisualisation]" /> */}

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        {/* <meta name="twitter:site" content="@[VotreNomTwitter]" /> */}
        <meta
          name="twitter:title"
          content="Eco-Manager - Suivi de Dépenses et Revenus"
        />
        <meta
          name="twitter:description"
          content="Gérez facilement vos dépenses et revenus mensuels avec Eco-Manager. Suivez votre budget, visualisez vos habitudes de dépenses et atteignez vos objectifs financiers."
        />
        {/* <meta name="twitter:image" content="[URL de l'image de prévisualisation]" /> */}

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
