
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comment {
  id?: number;
  content: string;
  createdAt?: Date;
  user?: any;
  post?: any;
}

@Injectable({
  providedIn: 'root'
})
export class CommentaireService {
  private apiUrl = 'http://localhost:9000/api/comments';

  constructor(private http: HttpClient) {}

  addComment(content: string, postId: number, userId: number): Observable<Comment> {
    const comment: Partial<Comment> = { content };
    return this.http.post<Comment>(`${this.apiUrl}?postId=${postId}&userId=${userId}`, comment);
  }

  getCommentsByPost(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/post/${postId}`);
  }
  updateComment(commentId: number, updatedComment: { content: string }): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${commentId}`, updatedComment);
  }
  
  
  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}
