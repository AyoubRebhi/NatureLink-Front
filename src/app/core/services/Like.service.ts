import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private readonly BASE_URL = `${environment.apiBaseUrl}/api/likes`

  // Système de cache pour optimiser les requêtes
  private likeCountCache = new Map<number, Observable<number>>();
  private userLikeStatusCache = new Map<string, Observable<boolean>>();

  constructor(private http: HttpClient) { }

  /**
   * Ajoute ou retire un like sur un post
   * @param postId Identifiant du post
   * @param userId Identifiant de l'utilisateur
   * @returns Observable avec le nouveau nombre de likes et le statut
   */
  toggleLike(postId: number, userId: number): Observable<{ liked: boolean, count: number }> {
    return this.http.post<{ liked: boolean, count: number }>(
      `${this.BASE_URL}/toggle/${postId}`,
      null,
      { params: { userId: userId.toString() } }
    );
  }

  /**
   * Récupère le nombre de likes d'un post
   * @param postId Identifiant du post
   * @param useCache Utiliser le cache (true par défaut)
   * @returns Observable avec le nombre de likes
   */
  getLikeCount(postId: number, useCache: boolean = true): Observable<number> {
    if (useCache && this.likeCountCache.has(postId)) {
      return this.likeCountCache.get(postId)!;
    }

    const request = this.http.get<number>(`${this.BASE_URL}/count/${postId}`).pipe(
      shareReplay(1), // Cache la dernière valeur
      catchError(this.handleError<number>('getLikeCount', 0))
    );

    if (useCache) {
      this.likeCountCache.set(postId, request);
    }

    return request;
  }

  /**
   * Vérifie si un utilisateur a liké un post
   * @param postId Identifiant du post
   * @param userId Identifiant de l'utilisateur
   * @param useCache Utiliser le cache (true par défaut)
   * @returns Observable avec le statut du like
   */
  hasUserLiked(postId: number, userId: number, useCache: boolean = true): Observable<boolean> {
    const cacheKey = this.getUserLikeCacheKey(postId, userId);

    if (useCache && this.userLikeStatusCache.has(cacheKey)) {
      return this.userLikeStatusCache.get(cacheKey)!;
    }

    const params = {
      postId: postId.toString(),
      userId: userId.toString()
    };

    const request = this.http.get<boolean>(`${this.BASE_URL}/check-like`, { params }).pipe(
      catchError(this.handleError<boolean>('hasUserLiked', false))
    );

    if (useCache) {
      this.userLikeStatusCache.set(cacheKey, request);
    }

    return request;
  }

  /**
   * Met à jour le cache après une action
   */
  private updateCache(postId: number, userId: number, count: number, liked: boolean): void {
    this.likeCountCache.set(postId, of(count));
    this.userLikeStatusCache.set(this.getUserLikeCacheKey(postId, userId), of(liked));
  }

  /**
   * Génère une clé unique pour le cache des likes utilisateur
   */
  private getUserLikeCacheKey(postId: number, userId: number): string {
    return `${postId}_${userId}`;
  }

  /**
   * Gestion centralisée des erreurs
   */
  private handleError<T>(operation: string, result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      // Ici vous pouvez ajouter un service de notification
      return of(result as T);
    };
  }

  /**
   * Vide le cache (optionnel)
   */
  clearCache(): void {
    this.likeCountCache.clear();
    this.userLikeStatusCache.clear();
  }


  /**
 * Vide le cache pour un post spécifique
 */
clearCacheForPost(postId: number, userId: number): void {
    // Supprime le cache du compteur
    this.likeCountCache.delete(postId);
    
    // Supprime le cache du statut utilisateur
    const userCacheKey = this.getUserLikeCacheKey(postId, userId);
    this.userLikeStatusCache.delete(userCacheKey);
  }
}