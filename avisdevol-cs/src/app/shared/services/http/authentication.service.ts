import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AbstractHttpService } from "./abstract-http.service";
import { User } from "../../models/user.model";
import { JwtPayload } from "../../models";

@Injectable({ providedIn: 'root' })
  export class AuthenticationService extends AbstractHttpService<User, number> {
        
    public constructor() {
        super('/api/rest/auth');
    }
  
  public login(account: any): Observable<any> {
    const url = `${this.servicePath}/login`;
      return this.httpClient.post(url, account)
    }
 
    public register(account: any): Observable<any> {
      const url = `${this.servicePath}/register`;
      return this.httpClient.post(url, account)
    }

    isLoggedIn(): boolean {
      const token = localStorage.getItem('jwtToken');
      return !!token;
    }    getUserFromToken(): string {
      const token = localStorage.getItem('jwtToken');
      if (!token) return '';
    
      const payload: JwtPayload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    }

    getUserPseudoFromToken(): string {
      const token = localStorage.getItem('jwtToken');
      if (!token) return '';
    
      try {
        const payload: JwtPayload = JSON.parse(atob(token.split('.')[1]));
        // Si le pseudo est disponible dans le token, l'utiliser
        if (payload.email) {
          return payload.email;
        }
        // Sinon, extraire le nom de l'email (partie avant @)
        const email = payload.sub;
        return email.split('@')[0];
      } catch (error) {
        console.error('Erreur lors de la récupération du pseudo:', error);
        return 'Utilisateur';
      }
    }

    isAdmin(): boolean {
      const token = localStorage.getItem('jwtToken');
      if (!token) return false;
    
      try {
        const decoded = this.decodeJwt(token);
        return decoded?.role.toUpperCase() === 'ADMIN' || decoded?.roles?.toUpperCase().includes('ADMIN') || decoded?.isAdmin === true;
      } catch (error) {
        console.error('Erreur lors de la vérification des droits admin:', error);
        return false;
      }
    }

    isAdminOrModerator(): boolean {
      const token = localStorage.getItem('jwtToken');
      if (!token) return false;
    
      try {
        const decoded = this.decodeJwt(token);
        const role = decoded?.role?.toUpperCase();
        const roles = decoded?.roles?.toUpperCase();
        return role === 'ADMIN' || 
               role === 'MODERATOR' || 
               roles?.includes('ADMIN') || 
               roles?.includes('MODERATOR') || 
               decoded?.isAdmin === true || 
               decoded?.isModerator === true;
      } catch (error) {
        console.error('Erreur lors de la vérification des droits admin/modérateur:', error);
        return false;
      }
    }

    logout(): void {
      localStorage.removeItem('jwtToken');
    }


    public decodeJwt(token: string): any | null {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
            .join('')
        );
        return JSON.parse(jsonPayload);
      } catch (e) {
        console.error('Erreur dans decodeJwt', e);
        return null;
      }
    }
  }