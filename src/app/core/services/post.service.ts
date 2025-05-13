import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

export interface Post {
  id: number;
  content: string;
  imageUrl: string | null | undefined;
  dateCreated: Date;
  user: {
    id: number;
    username: string;
    avatarUrl?: string;
  };
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
   private apiUrl = `${environment.apiBaseUrl}/posts`;
  //private apiUrl = 'http://localhost:9000/api/posts';
  private imageBaseUrl = 'http://localhost:9000';

  constructor(private http: HttpClient) { }

  // Créer un nouveau post
  createPost(content: string, image: File | null, userId: number): Observable<Post> {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('userId', userId.toString());

    if (image) {
      formData.append('image', image, image.name);
    }

    return this.http.post<Post>(this.apiUrl, formData).pipe(
      map(post => this.processPostImage(post))
    );
  }

  // Récupérer tous les posts
  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl).pipe(
      map(posts => posts.map(post => this.processPostImage(post)))
    );
  }

  // Supprimer un post
  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${postId}`);
  }

  // Méthode privée pour traiter les URLs d'images
  private processPostImage(post: Post): Post {
    return {
      ...post,
      imageUrl: post.imageUrl ? `${this.imageBaseUrl}${post.imageUrl}` : null
    };
  }
}