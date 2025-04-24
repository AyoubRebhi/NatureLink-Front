export const environment = {
  production: true,
  apiUrl: 'https://votre-api-production.com/api', // URL de production
  imageFallback: 'data:image/svg+xml;base64,PHN2Zy...', // Même SVG ou différent
  apiKey: 'votre_cle_prod_secure' // Doit être injecté via CI/CD
};
