import { Component, OnInit } from '@angular/core';
import { PostService, Post } from '../services/post.service';
import { CommentaireService, Comment } from '../services/commentaire.service';


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
  
  // Simulated logged-in user ID (replace with actual logged-in user ID logic)
  loggedInUserId = 1;



  
  constructor(private postService: PostService, private commentService: CommentaireService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.isLoading = true;
    this.postService.getAllPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.isLoading = false;
        // Afficher les chemins d'URL de chaque image dans la console
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

  loadComments(postId: number): void {
    this.commentService.getCommentsByPost(postId).subscribe({
      next: (comments) => this.comments[postId] = comments,
      error: (err) => console.error(err)
    });
  }

  addComment(postId: number): void {
    const content = this.commentInputs[postId]?.trim();
    const userId = this.loggedInUserId; // Assume the logged-in user is the one commenting

    if (!content) return;

    this.commentService.addComment(content, postId, userId).subscribe({
      next: (newComment) => {
        this.commentInputs[postId] = '';
        this.loadComments(postId);
      },
      error: (err) => console.error(err)
    });
  }

  startEdit(comment: Comment): void {
    // Allow editing only if the logged-in user created the comment
    if (comment.user?.id === this.loggedInUserId) {
      this.editingCommentId = comment.id!;
      this.editedCommentContent = comment.content;
    } else {
      console.error('You cannot edit someone else\'s comment.');
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

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }
  deleteComment(postId: number, commentId: number): void {
    const comment = this.comments[postId].find(c => c.id === commentId);
    
    if (!comment) return;

    // Only allow deletion if the logged-in user created the comment
    if (comment.user?.id === this.loggedInUserId) {
      this.commentService.deleteComment(commentId).subscribe({
        next: () => this.loadComments(postId),
        error: (err) => console.error(err)
      });
    } else {
      console.error('You cannot delete someone else\'s comment.');
    }
  }
}