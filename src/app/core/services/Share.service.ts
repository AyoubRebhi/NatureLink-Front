import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  shareOnFacebook(content: string, url: string, imageUrl?: string): void {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
      + `&quote=${encodeURIComponent(content)}`
      + (imageUrl ? `&picture=${encodeURIComponent(imageUrl)}` : '');
    this.openPopup(shareUrl);
  }

  shareOnTwitter(content: string, url: string): void {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`
      + `&url=${encodeURIComponent(url)}`;
    this.openPopup(shareUrl);
  }

  shareOnLinkedIn(content: string, url: string): void {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    this.openPopup(shareUrl);
  }

  shareOnWhatsApp(content: string, url: string): void {
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(content + '\n' + url)}`;
    this.openPopup(shareUrl);
  }

  private openPopup(url: string): void {
    window.open(url, '_blank', 'width=600,height=500,toolbar=0,menubar=0,location=0');
  }

  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  }
  
  async nativeShare(post: {content: string, imageUrl?: string, url: string}): Promise<void> {
    if (navigator.share) {
      try {
        const shareData: ShareData = {
          title: 'Voir ce post',
          text: post.content,
          url: post.url
        };
  
        // Si une image est disponible, essayez de la convertir en File
        if (post.imageUrl) {
          try {
            const file = await this.urlToFile(post.imageUrl);
            shareData.files = [file];
          } catch (error) {
            console.warn("Couldn't share image:", error);
          }
        }
  
        await navigator.share(shareData);
      } catch (err) {
        console.log('Erreur de partage:', err);
      }
    }
  }
  
  private async urlToFile(imageUrl: string): Promise<File> {
    // Implémentation de la conversion URL -> File
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
    return new File([blob], fileName, { type: blob.type });
  }
}