import { Component, OnInit } from '@angular/core';
import { PostService, Post } from '../../../core/services/post.service';
import { CommentaireService, Comment } from '../../../core/services/commentaire.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { catchError, switchMap, finalize } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  private readonly SIGHTENGINE_CONFIG = {
    API_USER: '1700834085',
    API_SECRET: 'VTZQVtFnApBD3R6atXbr4AoYqb6dPczf',
    TEXT_API_URL: 'https://api.sightengine.com/1.0/text/check.json',
    MODELS: 'nudity-2.0,wad,offensive'
  };

  posts: any[] = [];
  isLoading = true;
  commentInputs: { [postId: number]: string } = {};
  editingCommentId: number | null = null;
  editedCommentContent: string = '';
  comments: { [postId: number]: Comment[] } = {};
  showComments: { [postId: number]: boolean } = {};
  isLoadingComments: { [postId: number]: boolean } = {};
  showDropdown: { [postId: number]: boolean } = {};
  loggedInUserId = 1;

  constructor(
    private postService: PostService,
    private commentService: CommentaireService,
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.isLoading = true;
    this.postService.getAllPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.isLoading = false;
        this.posts.forEach(post => {
          if (post.imageUrl) {
            console.log(post.imageUrl);
          }
        });
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.isLoading = false;
      }
    });
  }

  toggleComments(postId: number): void {
    if (!this.showComments[postId]) {
      this.loadComments(postId);
    } else {
      this.showComments[postId] = false;
    }
  }

  loadComments(postId: number): void {
    this.isLoadingComments[postId] = true;
    this.commentService.getCommentsByPost(postId).subscribe({
      next: (comments) => {
        this.comments[postId] = comments;
        this.showComments[postId] = true;
        this.isLoadingComments[postId] = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoadingComments[postId] = false;
      }
    });
  }

  addComment(postId: number): void {
    const content = this.commentInputs[postId]?.trim();
    const userId = this.loggedInUserId;

    if (!content) return;

    this.validateText(content).pipe(
      switchMap(textResult => {
        if (this.isTextInappropriate(textResult)) {
          this.toastr.error('Contenu inapproprié détecté');
          return throwError(() => new Error('Contenu inapproprié'));
        }
        return this.commentService.addComment(content, postId, userId);
      }),
      finalize(() => {
        this.commentInputs[postId] = '';
      })
    ).subscribe({
      next: () => this.loadComments(postId),
      error: (err) => {
        if (err.message !== 'Contenu inapproprié') {
          console.error(err);
          this.toastr.error('Échec de l\'ajout du commentaire');
        }
      }
    });
  }

  startEdit(comment: Comment): void {
    if (comment.user?.id === this.loggedInUserId) {
      this.editingCommentId = comment.id!;
      this.editedCommentContent = comment.content;
    }
  }

  cancelEdit(): void {
    this.editingCommentId = null;
    this.editedCommentContent = '';
  }

  updateComment(postId: number, commentId: number): void {
    this.validateText(this.editedCommentContent).pipe(
      switchMap(textResult => {
        if (this.isTextInappropriate(textResult)) {
          this.toastr.error('Contenu inapproprié détecté');
          return throwError(() => new Error('Contenu inapproprié'));
        }
        return this.commentService.updateComment(commentId, { content: this.editedCommentContent });
      })
    ).subscribe({
      next: () => {
        this.cancelEdit();
        this.loadComments(postId);
      },
      error: (err) => {
        if (err.message !== 'Contenu inapproprié') {
          console.error(err);
        }
      }
    });
  }

  deleteComment(postId: number, commentId: number): void {
    const comment = this.comments[postId]?.find(c => c.id === commentId);
    
    if (!comment || comment.user?.id !== this.loggedInUserId) return;

    this.commentService.deleteComment(commentId).subscribe({
      next: () => this.loadComments(postId),
      error: (err) => console.error(err)
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  canDeletePost(post: Post): boolean {
    return post.user?.id === this.loggedInUserId;
  }

  deletePost(postId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      this.postService.deletePost(postId).subscribe({
        next: () => {
          this.posts = this.posts.filter(post => post.id !== postId);
          delete this.comments[postId];
        },
        error: (err) => console.error('Erreur lors de la suppression:', err)
      });
    }
  }

  toggleDropdown(postId: number): void {
    this.showDropdown[postId] = !this.showDropdown[postId];
    
    Object.keys(this.showDropdown).forEach((id: string) => {
      if (+id !== postId) {
        this.showDropdown[id as unknown as keyof typeof this.showDropdown] = false;
      }
    });
  }

  private validateText(text: string): Observable<any> {
    if (!text?.trim()) {
      return of({ status: 'success' });
    }

    const params = new HttpParams()
      .set('api_user', this.SIGHTENGINE_CONFIG.API_USER)
      .set('api_secret', this.SIGHTENGINE_CONFIG.API_SECRET)
      .set('text', encodeURIComponent(text))
      .set('mode', 'standard')
      .set('lang', 'en')
      .set('models','general');

    return this.http.get(this.SIGHTENGINE_CONFIG.TEXT_API_URL, { params }).pipe(
      catchError(err => {
        console.error('API Error:', err);
        this.analyzeSightengineError(err);
        return of({ status: 'failure', error: err });
      })
    );
  }

  private isTextInappropriate(result: any): boolean {
    if (!result || result.status !== 'success') {
      return false;
    }

    if (result.profanity?.matches?.length > 0) {
      return true;
    }

    const thresholds = {
      profanity: 0.5,
      sexual: 0.5,
      drugs: 0.5,
      insult: 0.7,
      discrimination: 0.7,
      violent: 0.2
    };

    return (
      (result.profanity?.score > thresholds.profanity) ||
      (result.sexual?.score > thresholds.sexual) ||
      (result.drugs?.score > thresholds.drugs) ||
      (result.insult?.score > thresholds.insult) ||
      (result.discrimination?.score > thresholds.discrimination) ||
      (result.violent?.score > thresholds.violent)
    );
  }

  private analyzeSightengineError(err: any): void {
    try {
      const errorDetails = err.error;
      console.group('Analyse erreur Sightengine');
      console.log('Status:', err.status);
      console.log('Message:', errorDetails?.message || 'Pas de message');
      console.log('Code erreur:', errorDetails?.code || 'Inconnu');
      console.groupEnd();
    } catch (e) {
      console.error('Erreur analyse:', e);
    }
  }
}