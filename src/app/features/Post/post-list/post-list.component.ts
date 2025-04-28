import { Component, OnInit } from '@angular/core';
import { PostService, Post } from '../../../core/services/post.service';
import { CommentaireService, Comment } from '../../../core/services/commentaire.service';
import { LikeService } from '../../../core/services/Like.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { catchError, switchMap, finalize } from 'rxjs/operators';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

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
  loggedInUserId?: number;
  likeLoading: { [postId: number]: boolean } = {};

  constructor(
    private postService: PostService,
    private commentService: CommentaireService,
    private likeService: LikeService,
    private http: HttpClient,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    // Set userId from AuthService
    this.loggedInUserId = this.authService.getCurrentUserId() || undefined;
    if (!this.loggedInUserId) {
      this.toastr.error('Veuillez vous connecter pour voir les publications.');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    this.loadPosts();
  }

  loadPosts(): void {
    this.isLoading = true;
    this.postService.getAllPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.posts.forEach(post => {
          this.loadLikeStatus(post.id);
          if (post.imageUrl) {
            console.log(post.imageUrl);
          }
        });
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.toastr.error('Erreur lors du chargement des publications');
        this.isLoading = false;
        this.cdRef.detectChanges();
      }
    });
  }

  loadLikeStatus(postId: number): void {
    if (!this.loggedInUserId) return;

    this.likeService.getLikeCount(postId).subscribe(count => {
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        post.likesCount = count;
        this.cdRef.detectChanges();
      }
    });

    this.likeService.hasUserLiked(postId, this.loggedInUserId).subscribe(hasLiked => {
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        post.isLiked = hasLiked;
        this.cdRef.detectChanges();
      }
    });
  }

  toggleLike(postId: number): void {
    if (!this.loggedInUserId) {
      this.toastr.error('Veuillez vous connecter pour liker une publication.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    if (this.likeLoading[postId]) return;

    this.likeLoading[postId] = true;
    const post = this.posts.find(p => p.id === postId);

    if (!post) {
      this.likeLoading[postId] = false;
      this.cdRef.detectChanges();
      return;
    }

    // Sauvegarde de l'état actuel
    const wasLiked = post.isLiked;
    const oldCount = post.likesCount || 0;

    // Mise à jour optimiste
    post.isLiked = !wasLiked;
    post.likesCount = wasLiked ? oldCount - 1 : oldCount + 1;
    this.cdRef.detectChanges();

    this.likeService.toggleLike(postId, this.loggedInUserId).subscribe({
      next: (response) => {
        // Synchronisation avec la réponse serveur
        post.isLiked = response.liked;
        post.likesCount = response.count;
      },
      error: (err) => {
        console.error('Erreur:', err);
        // Rollback
        post.isLiked = wasLiked;
        post.likesCount = oldCount;
        this.toastr.error('Erreur lors du like');
      },
      complete: () => {
        this.likeLoading[postId] = false;
        this.cdRef.detectChanges();
      }
    });
  }

  toggleComments(postId: number): void {
    if (!this.loggedInUserId) {
      this.toastr.error('Veuillez vous connecter pour voir les commentaires.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    if (!this.showComments[postId]) {
      this.loadComments(postId);
    } else {
      this.showComments[postId] = false;
      this.cdRef.detectChanges();
    }
  }

  loadComments(postId: number): void {
    this.isLoadingComments[postId] = true;
    this.commentService.getCommentsByPost(postId).subscribe({
      next: (comments) => {
        this.comments[postId] = comments;
        this.showComments[postId] = true;
        this.isLoadingComments[postId] = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Erreur lors du chargement des commentaires');
        this.isLoadingComments[postId] = false;
        this.cdRef.detectChanges();
      }
    });
  }

  addComment(postId: number): void {
    if (!this.loggedInUserId) {
      this.toastr.error('Veuillez vous connecter pour commenter.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    const content = this.commentInputs[postId]?.trim();
    if (!content) {
      this.toastr.warning('Le commentaire ne peut pas être vide.');
      return;
    }

    this.validateText(content).pipe(
      switchMap(textResult => {
        if (this.isTextInappropriate(textResult)) {
          this.toastr.error('Contenu inapproprié détecté');
          return throwError(() => new Error('Contenu inapproprié'));
        }
        return this.commentService.addComment(content, postId, this.loggedInUserId!);
      }),
      finalize(() => {
        this.commentInputs[postId] = '';
        this.cdRef.detectChanges();
      })
    ).subscribe({
      next: () => {
        this.loadComments(postId);
        this.toastr.success('Commentaire ajouté avec succès');
      },
      error: (err) => {
        if (err.message !== 'Contenu inapproprié') {
          console.error(err);
          this.toastr.error('Échec de l\'ajout du commentaire');
        }
      }
    });
  }

  startEdit(comment: Comment): void {
    if (!this.loggedInUserId) {
      this.toastr.error('Veuillez vous connecter pour modifier un commentaire.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    if (comment.user?.id === this.loggedInUserId) {
      this.editingCommentId = comment.id!;
      this.editedCommentContent = comment.content;
      this.cdRef.detectChanges();
    } else {
      this.toastr.error('Vous ne pouvez modifier que vos propres commentaires.');
    }
  }

  cancelEdit(): void {
    this.editingCommentId = null;
    this.editedCommentContent = '';
    this.cdRef.detectChanges();
  }

  updateComment(postId: number, commentId: number): void {
    if (!this.loggedInUserId) {
      this.toastr.error('Veuillez vous connecter pour modifier un commentaire.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    if (!this.editedCommentContent.trim()) {
      this.toastr.warning('Le commentaire ne peut pas être vide.');
      return;
    }

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
        this.toastr.success('Commentaire modifié avec succès');
      },
      error: (err) => {
        if (err.message !== 'Contenu inapproprié') {
          console.error(err);
          this.toastr.error('Échec de la modification du commentaire');
        }
      }
    });
  }

  deleteComment(postId: number, commentId: number): void {
    if (!this.loggedInUserId) {
      this.toastr.error('Veuillez vous connecter pour supprimer un commentaire.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    const comment = this.comments[postId]?.find(c => c.id === commentId);
    if (!comment || comment.user?.id !== this.loggedInUserId) {
      this.toastr.error('Vous ne pouvez supprimer que vos propres commentaires.');
      return;
    }

    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.loadComments(postId);
        this.toastr.success('Commentaire supprimé avec succès');
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Erreur lors de la suppression du commentaire');
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  canDeletePost(post: Post): boolean {
    return post.user?.id === this.loggedInUserId;
  }

  deletePost(postId: number): void {
    if (!this.loggedInUserId) {
      this.toastr.error('Veuillez vous connecter pour supprimer une publication.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    const post = this.posts.find(p => p.id === postId);
    if (!post || post.user?.id !== this.loggedInUserId) {
      this.toastr.error('Vous ne pouvez supprimer que vos propres publications.');
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      this.postService.deletePost(postId).subscribe({
        next: () => {
          this.posts = this.posts.filter(post => post.id !== postId);
          delete this.comments[postId];
          this.toastr.success('Publication supprimée avec succès');
          this.cdRef.detectChanges();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          this.toastr.error('Erreur lors de la suppression de la publication');
        }
      });
    }
  }

  toggleDropdown(postId: number): void {
    if (!this.loggedInUserId) {
      this.toastr.error('Veuillez vous connecter pour accéder aux options.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    this.showDropdown[postId] = !this.showDropdown[postId];
    Object.keys(this.showDropdown).forEach((id: string) => {
      if (+id !== postId) {
        this.showDropdown[id as unknown as keyof typeof this.showDropdown] = false;
      }
    });
    this.cdRef.detectChanges();
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
      .set('models', 'general');

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