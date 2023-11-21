import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

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


  constructor(private postService: PostService, private authService: AuthService) { }


  
  ngOnInit(): void {
    this.authService.loggedInUser$.subscribe((user: any) => {
      if (user && user.id) {
        this.loggedInUser = user;
        this.isLogedIn=true
        console.log('User logged in', this.loggedInUser);
        const userAccessLevel = this.authService.getUserAccessLevel(user.id);
        console.log(`User access level: ${userAccessLevel}`);
        this.fetchPosts(userAccessLevel);
      } else {
        // console.log('User not logged in.');
        // For unauthenticated users, fetch the first 20 posts
        this.fetchPosts('unauthenticated');
      }
    });
  }
  
  
  
  

  // loginAndFetchPosts(usernameOrEmail: string, password: string): void {
  //   this.authService.login(usernameOrEmail, password).subscribe((loggedIn: boolean) => {
  //     if (loggedIn) {
  //       this.loggedInUser = this.authService.loggedInUser;
  //       const userAccessLevel = this.authService.getUserAccessLevel();
  //       console.log(`User access level: ${userAccessLevel}`); 
  //       this.fetchPosts(userAccessLevel);
  //     } else {
  //       console.log('Invalid credentials');
  //     }
  //   });
  // }


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
      let userAccessLevel = 'unauthenticated'; // Default for unauthenticated users
  
      if (this.loggedInUser) {
        userAccessLevel = this.authService.getUserAccessLevel(this.loggedInUser.id);
      }
  
      // Check for unauthenticated or free users to view up to 20 posts
      if (userAccessLevel === 'unauthenticated') {
        if (this.currentPage * this.postsPerPage < 20) {
          this.currentPage++;
          this.updateDisplayedPosts();
        } else {
          alert('Please log in to see more posts.')
        }
      } else if (userAccessLevel === 'free') {
        if (this.currentPage * this.postsPerPage < 20) {
          this.currentPage++;
          this.updateDisplayedPosts();
        } else {
          console.log('Payment needed for more posts.');
          alert('Payment needed for more posts.')

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

  ngOnDestroy(): void {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }
}
