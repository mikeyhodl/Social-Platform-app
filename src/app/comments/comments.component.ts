import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../notification.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent {

  constructor(public dialogRef: MatDialogRef<CommentsComponent>,private notificationService: NotificationService,private snackBar: MatSnackBar,private http:HttpClient ,private authService:AuthService) {}

  submitComment() {
    this.dialogRef.close();
  
  }
}
