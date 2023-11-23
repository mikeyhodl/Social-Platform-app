import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../notification.service';
import { BlockService } from '../services/block.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss']
})
export class FollowingComponent implements OnInit {
    isFollowing: boolean = false;
    isUserBlocked: boolean = false;
    isPostBlocked: boolean = false;
    posts:any
    postId: any | undefined;
    userId: any | undefined;
  
    constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<FollowingComponent>,
      private notificationService: NotificationService,
      private snackBar: MatSnackBar,
      private blockService: BlockService,
    ) {}
    ngOnInit(): void {
      
      this.postId = this.data.postId;
      console.log('Post Sent',this.postId)
      this.userId = this.data.userId;
    }
    toggleFollow(): void {
      this.isFollowing = !this.isFollowing;
      const message = this.isFollowing ? 'You followed the user' : 'You unfollowed the user';
      this.notificationService.showSuccess(message);
    }
  
    blockUser(userId: number): void {
      this.blockService.blockUser(userId);
    }
  
    blockPost(postId: number): void {
      this.blockService.blockPost(postId);
      
    }
}
