import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PostFeedComponent } from '../post-feed/post-feed.component';
import { NotificationService } from '../notification.service';
import { FollowingComponent } from '../following/following.component';
import { BlockService } from '../services/block.service';
import { CommentsComponent } from '../comments/comments.component';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit, OnDestroy {


  posts: any[] = [];
  postsPerPage = 5;
  currentPage = 1;
  totalPages = 0;
  postsSubscription: Subscription | undefined;
  loggedInUser: any | undefined;
  isLogedIn:boolean=false;
  totalComments = 0;
  totalLikes = 5;
  postId=1 
  userId:any 
  startPayment:boolean=false
  is_premium=false;

  constructor(private postService: PostService,
    private notificationService:NotificationService,
    private dialog: MatDialog,
     private authService: AuthService,
     private blockService: BlockService
     ) { }


  
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

    
  }



  fetchPosts(userAccessLevel: 'free' | 'premium' | 'unauthenticated'): void {
    this.postsSubscription = this.postService.getAllPosts().subscribe(data => {
      this.totalPages = Math.ceil(data.length / this.postsPerPage);
  
      if (userAccessLevel === 'free' || userAccessLevel === 'unauthenticated') {
        this.posts = this.getPostsForPage(this.currentPage, data.slice(0, 20));
      } else if (userAccessLevel === 'premium') {
        this.posts = this.getPostsForPage(this.currentPage, data);
        this.is_premium=true;
      }
  
      // Fetch comments for each post
      this.posts.forEach(post => {
        this.postService.getCommentsForPost(post.id).subscribe(comments => {
          post.comments = comments; 
          this.totalComments=post.comments.length
        });
      });
    });
  }
  

  getPostsForPage(page: number, data: any[]): any[] {
    const startIndex = (page - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    return data.slice(startIndex, endIndex);
  }

  searchPosts(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.trim();
    if (searchTerm.length > 0) {
      const filteredPosts = this.posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
      this.posts = filteredPosts;
    } else {
      this.fetchPosts(this.authService.getUserAccessLevel(this.loggedInUser.id));
    }
  }
  
  

  isUserBlocked(userId: number): boolean {
    return this.blockService.isUserBlocked(userId);
  }

  isPostBlocked(postId: number): boolean {
    return this.blockService.isPostBlocked(postId);

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
      const filteredPosts = posts.filter(post => {
        // Check if the post or its user is blocked
        return !this.isPostBlocked(post.id) && !this.isUserBlocked(post.userId);
      });
  
      this.posts = this.getPostsForPage(this.currentPage, filteredPosts);
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
  getPostById(postId: number): any {
    return this.posts.find(post => post.id === postId);
  }
  

  openFollowDialog(postId: number, userId: number): void {
    this.postService.getPostById(postId).subscribe(
      (selectedPost: any) => {
        const selectedUserId = selectedPost?.userId;
  
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '300px';
        dialogConfig.maxWidth = '30vw';
        dialogConfig.height = '60vh';
        dialogConfig.data = { postId: selectedPost?.id, userId: selectedUserId };
        console.log("data", dialogConfig.data)
  
        const dialogRef = this.dialog.open(FollowingComponent, dialogConfig);
  
        dialogRef.afterClosed().subscribe(result => {
          this.updateDisplayedPosts();
        });
      },
      error => {
        console.error('Error fetching post:', error);
      }
    );
  }
  
  
  
  
  

  ngOnDestroy(): void {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }
}
