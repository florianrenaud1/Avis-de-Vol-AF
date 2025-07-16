import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

/**
 * Vérifie si l'utilisateur est authentifié avec un token valide
 */
function isAuthenticated(): boolean {
    try {
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            return false;
        }

        // Décoder le token pour vérifier s'il est valide
        const payload: any = jwtDecode(token);

        // Vérifier que le token n'est pas expiré
        const currentTime = Date.now() / 1000;

        if (payload.exp && payload.exp > currentTime) {
            return true;
        } else {
            // Token expiré, le supprimer
            localStorage.removeItem('jwtToken');
            return false;
        }
    } catch {
        // Token invalide, le supprimer
        localStorage.removeItem('jwtToken');
        return false;
    }
}

/**
 * Guard d'authentification pour protéger les routes
 * Vérifie si l'utilisateur est connecté avec un token JWT valide
 */
export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    if (isAuthenticated()) {
        // Utilisateur connecté et token valide
        return true;
    }

    // Utilisateur non connecté, rediriger vers la page de connexion
    router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
        replaceUrl: true,
    });
    return false;
};

/**
 * Guard pour les utilisateurs non connectés (ex: page de connexion)
 * Redirige vers l'accueil si l'utilisateur est déjà connecté
 */
export const guestGuard: CanActivateFn = () => {
    const router = inject(Router);

    if (isAuthenticated()) {
        // Utilisateur connecté, rediriger vers l'accueil
        router.navigate(['/'], { replaceUrl: true });
        return false;
    }

    // Pas de token ou token expiré, autoriser l'accès
    return true;
};
