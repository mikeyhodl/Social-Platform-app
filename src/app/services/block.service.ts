import { Injectable } from '@angular/core';
import { NotificationService } from '../notification.service';

@Injectable({
  providedIn: 'root'
})
export class BlockService {
  private blockedUsers: Set<number> = new Set<number>();
  private blockedPosts: Set<number> = new Set<number>();
constructor(  private notificationService: NotificationService
  ){}
  blockUser(userId: number): void {
    this.blockedUsers.add(userId);
    this.notificationService.showError('You have Blocked this user So you cannot Post from the User')
  }

  unblockUser(userId: number): void {
    this.blockedUsers.delete(userId);
  }

  blockPost(postId: number): void {
    this.blockedPosts.add(postId);
    this.notificationService.showError('You have Blocked this Post')
  }

  unblockPost(postId: number): void {
    this.blockedPosts.delete(postId);
  }

  isUserBlocked(userId: number): boolean {
    return this.blockedUsers.has(userId);
  }

  isPostBlocked(postId: number): boolean {
    return this.blockedPosts.has(postId);
  }
}
