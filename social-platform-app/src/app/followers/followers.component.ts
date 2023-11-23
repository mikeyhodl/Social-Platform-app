import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CommentsComponent } from '../comments/comments.component';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss']
})
export class FollowersComponent implements OnInit {

  users: any[] = [];
  userPosts: any[] = [];
  totalComments = 5;

  constructor(private userService: UserService, private postService: PostService,    private dialog: MatDialog,
    ) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((users: any[]) => {
      this.users = users;
    });
  }

  viewUserPosts(userId: number) {
    this.postService.getUserPostsByUserId(userId).subscribe((posts: any[]) => {
      this.userPosts = posts;
    });
  }

  openCommentsDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '700px'; // Adjust the width of the modal
    dialogConfig.maxWidth = '90vw'; // Maximum width
    dialogConfig.height='50vh';
    dialogConfig.data = { /* If passing data */ };

    const dialogRef = this.dialog.open(CommentsComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      // Do something on modal close if needed
    });
  }
}
