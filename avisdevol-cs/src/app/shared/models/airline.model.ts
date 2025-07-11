export interface Airline {
    id: number; // Identifiant unique de la compagnie aérienne
    name: string; // Nom de la compagnie aérienne
    iataCode: string; // Code IATA (ex: AF pour Air France)
    icaoCode: string; // Code ICAO (ex: AFR pour Air France)
    country: string; // Pays d'origine de la compagnie
    active: boolean; // Statut actif/inactif
}
