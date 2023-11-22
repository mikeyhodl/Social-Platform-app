import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.scss']
})
export class PostFeedComponent {
  loggedInUserId: any | undefined;
postContent: any;
postTitle: any;
  constructor(public dialogRef: MatDialogRef<PostFeedComponent>,private notificationService: NotificationService,private snackBar: MatSnackBar,private http:HttpClient ,private authService:AuthService) {}

  ngOnInit(): void {
    this.authService.loggedInUser$.subscribe((user: any) => {
      if (user && user.id) {
      this.loggedInUserId=user.id
      } 
    });
  }

  submitPost(postContent: string, postTitle: string): void {
    const newPost = {
      title: postTitle,
      body: postContent,
      userId: this.loggedInUserId, // Replace this with the actual user ID
    };
  
    this.http.post('https://jsonplaceholder.typicode.com/posts', newPost)
      .subscribe((response: any) => {
        this.notificationService.showSuccess('Posted');
         this.dialogRef.close();
      }, (error: any) => {
        this.notificationService.showError('Failed');
      });
  }
  
  closeDialog(): void {
    this.dialogRef.close();
  }
}
