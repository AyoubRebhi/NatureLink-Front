import { Component, OnInit } from '@angular/core';
import { PostService, Post } from '../../../services/post.service';
import { CommentaireService, Comment } from '../../../services/commentaire.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts: any[] = [];
  isLoading = true;
  commentInputs: { [postId: number]: string } = {};
  editingCommentId: number | null = null;
  editedCommentContent: string = '';
  comments: { [postId: number]: Comment[] } = {};
  showComments: { [postId: number]: boolean } = {};
  isLoadingComments: { [postId: number]: boolean } = {};
  showDropdown: { [postId: number]: boolean } = {}; // Gestion des menus déroulants

  
  // Simulated logged-in user ID
  loggedInUserId = 1;

  constructor(
    private postService: PostService, 
    private commentService: CommentaireService
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

    this.commentService.addComment(content, postId, userId).subscribe({
      next: (newComment) => {
        this.commentInputs[postId] = '';
        this.loadComments(postId); // Recharger les commentaires
      },
      error: (err) => console.error(err)
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
    this.commentService.updateComment(commentId, { content: this.editedCommentContent }).subscribe({
      next: () => {
        this.cancelEdit();
        this.loadComments(postId);
      },
      error: (err) => console.error(err)
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
  // Méthode pour vérifier si l'utilisateur peut supprimer le post
canDeletePost(post: Post): boolean {
  return post.user?.id === this.loggedInUserId;
}

// Méthode pour supprimer un post
deletePost(postId: number): void {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
    this.postService.deletePost(postId).subscribe({
      next: () => {
        // Retirer le post supprimé du tableau
        this.posts = this.posts.filter(post => post.id !== postId);
        // Supprimer aussi les commentaires associés si nécessaire
        delete this.comments[postId];
      },
      error: (err) => console.error('Erreur lors de la suppression:', err)
    });
  }
}




toggleDropdown(postId: number): void {
  this.showDropdown[postId] = !this.showDropdown[postId];
  
  // Fermer les autres menus déroulants ouverts
  Object.keys(this.showDropdown).forEach((id: string) => {
    if (+id !== postId) {
      this.showDropdown[id as unknown as keyof typeof this.showDropdown] = false;
    }
  });}
}
