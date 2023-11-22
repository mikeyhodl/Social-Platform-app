import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.scss']
})
export class PostFeedComponent {
  loggedInUserId: any | undefined;
postContent: any;
postTitle: any;
  constructor(public dialogRef: MatDialogRef<PostFeedComponent>,private snackBar: MatSnackBar,private http:HttpClient ,private authService:AuthService) {}

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
        this.snackBar.open('Post submitted successfully!', 'Close', {
          duration: 3000, // Duration in milliseconds
          horizontalPosition: 'center', // Positioning the toast message
          verticalPosition: 'bottom',
        });        this.dialogRef.close();
      }, (error: any) => {
        console.error('Error adding post:', error);
      });
  }
  
  closeDialog(): void {
    this.dialogRef.close();
  }
}
