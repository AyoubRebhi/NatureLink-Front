import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Post {
  id: number;
  content: string;
  imageUrl: string | null | undefined;  // Allow null as well as undefined
  createdAt: Date;
  user: {
    id: number;
    name: string;
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
  private apiUrl = 'http://localhost:9000/api/posts'; // API sur le port 9000
  private imageBaseUrl = 'http://localhost:9000'; // URL des images

  constructor(private http: HttpClient) { }

  createPost(content: string, image: File | null, userId: number): Observable<any> {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('userId', userId.toString());

    if (image) {
      formData.append('image', image, image.name);
    }

    return this.http.post(this.apiUrl, formData);
  }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl).pipe(
      map(posts => posts.map(post => ({
        ...post,
        imageUrl: post.imageUrl ? this.imageBaseUrl + post.imageUrl : null
      })))
    );
  }
}
