import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PostFeedComponent } from '../post-feed/post-feed.component';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit, OnDestroy {

  posts: any[] = [];
  postsPerPage = 4;
  currentPage = 1;
  totalPages = 0;
  postsSubscription: Subscription | undefined;
  loggedInUser: any | undefined;
  isLogedIn:boolean=false;
  totalComments = 0;
  totalLikes = 0;
  postId = 1; 
  startPayment:boolean=false

  constructor(private postService: PostService,private notificationService:NotificationService,private dialog: MatDialog, private authService: AuthService,) { }


  
  ngOnInit(): void {
    this.authService.loggedInUser$.subscribe((user: any) => {
      if (user && user.id) {
        this.loggedInUser = user;
        this.isLogedIn=true
        // console.log('User logged in', this.loggedInUser);
        const userAccessLevel = this.authService.getUserAccessLevel(user.id);
        // console.log(`User access level: ${userAccessLevel}`);
        this.fetchPosts(userAccessLevel);
      } else {
        // console.log('User not logged in.');
        this.fetchPosts('unauthenticated');
      }
    });

    this.postService.getCommentsForPost(this.postId).subscribe(comments => {
      this.totalComments = comments.length; 
      this.totalLikes=5;
    });
  }



  fetchPosts(userAccessLevel: 'free' | 'premium' | 'unauthenticated'): void {
    this.postsSubscription = this.postService.getAllPosts().subscribe(data => {
      this.totalPages = Math.ceil(data.length / this.postsPerPage);
  
      if (userAccessLevel === 'free' || userAccessLevel === 'unauthenticated') {
        this.posts = this.getPostsForPage(this.currentPage, data.slice(0, 20));
      } else if (userAccessLevel === 'premium') {
        this.posts = this.getPostsForPage(this.currentPage, data);
      }
    });
  }

  getPostsForPage(page: number, data: any[]): any[] {
    const startIndex = (page - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    return data.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      let userAccessLevel = 'unauthenticated'; 
  
      if (this.loggedInUser) {
        userAccessLevel = this.authService.getUserAccessLevel(this.loggedInUser.id);
      }
      if (userAccessLevel === 'unauthenticated') {
        if (this.currentPage * this.postsPerPage < 20) {
          this.currentPage++;
          this.updateDisplayedPosts();
        } else {
          this.notificationService.showError('Login To see More Posts');
        }
      } else if (userAccessLevel === 'free') {
        if (this.currentPage * this.postsPerPage < 20) {
          this.currentPage++;
          this.updateDisplayedPosts();
        } else {
          this.startPayment=true
          this.notificationService.showError('Upgrade To see More Post');
          // console.log('Payment needed for more posts.');
          // alert('Payment needed for more posts.')

        }
      } else if (userAccessLevel === 'premium') {
        this.currentPage++;
        this.updateDisplayedPosts();
      }
    }
  }
  
  
  

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedPosts();
    }
  }

  updateDisplayedPosts(): void {
    this.postService.getAllPosts().subscribe(posts => {
      this.posts = this.getPostsForPage(this.currentPage, posts);
    });
  }
  likePost(postId: any) {
    this.totalLikes+=1;
  }
  commentOnPost(arg0: any) {
  throw new Error('Method not implemented.');
  }
  cancelUpgrade(): void {
    // Set startPayment to false to close the modal
    this.startPayment = false;
  }
  logut(){
    this.isLogedIn=false
  }
  openPostDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '700px'; // Adjust the width of the modal
    dialogConfig.maxWidth = '90vw'; // Maximum width
    dialogConfig.height='60vh';
    dialogConfig.data = { /* If passing data */ };

    const dialogRef = this.dialog.open(PostFeedComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      // Do something on modal close if needed
    });
  }

  ngOnDestroy(): void {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }
}
