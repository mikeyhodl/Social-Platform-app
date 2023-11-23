import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  userProfile: any = {};
  userPosts: any[] = [];
  totalComments = 0;
  postId:any
  profileBackgroundColor: string = '';
  users:any[]=[];




  constructor(private authService:AuthService,private postService:PostService,private userService: UserService) { }

  ngOnInit(): void {
    this.authService.loggedInUser$.subscribe((user: any) => {
      if (user && user.id) {
        this.userProfile = {
          name: user.name,
          email: user.email,
          phone: user.phone,
          company: user.company.name,
          website: user.website,
          profilePicture:this.generateProfilePicture(user.name)
        };
      }
      if (user && user.id) {
        this.postService.getAllPosts().subscribe((posts: any[]) => {
          this.userPosts = posts.filter(post => post.userId === user.id);
        });
        this.postService.getCommentsForPost(user.id).subscribe(comments => {
          this.totalComments = comments.length; 
        });
      } 
    });
    this.userService.getAllUsers().subscribe((users: any[]) => {
      this.users=users;
    });
  }
  
  generateProfilePicture(name: string): string {
    this.profileBackgroundColor = this.generateRandomColor(name);
    const initials = name.split(' ').map(word => word.charAt(0)).join('');
    return `https://ui-avatars.com/api/?name=${initials}&background=${this.profileBackgroundColor}&color=fff`;
  }

  generateRandomColor(seed: string): string {
    const hashCode = seed.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const color = (hashCode & 0x00FFFFFF).toString(16).toUpperCase();
    return '00000'.substring(0, 6 - color.length) + color;
  }

}
