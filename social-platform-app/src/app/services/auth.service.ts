import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators'; // Import map operator

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';
  private freeUserIds: number[] = [1, 3, 5, 7, 9];
  private premiumUserIds: number[] = [2, 4, 6, 8, 10];
  loggedInUser: any | undefined; // Store logged-in user information
  private loggedInUserSubject: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  loggedInUser$: Observable<any | null> = this.loggedInUserSubject.asObservable();



  constructor(private http: HttpClient) { }


  login(usernameOrEmail: string, password: string) {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((users: any[]) => {
        const userFound = users.find((user: any) =>
          (user.username === usernameOrEmail || user.email === usernameOrEmail) && user.address.zipcode === password
        );

        if (userFound) {
          this.loggedInUserSubject.next(userFound); // Emit the logged-in user's information
          return true;
        }

        return false;
      })
    );
  }
  

  getUserAccessLevel(id: number): 'free' | 'premium' {
    const freeUserIds: number[] = [1, 3, 5, 7, 9];
    const premiumUserIds: number[] = [2, 4, 6, 8, 10];
  
    if (freeUserIds.includes(id)) {
      return 'free';
    } else if (premiumUserIds.includes(id)) {
      return 'premium';
    } else {
      return 'free';
    }
  }
  

  // Methods to modify user access levels (if required in the future)
  addToFreeUsers(userId: number): void {
    if (!this.freeUserIds.includes(userId)) {
      this.freeUserIds.push(userId);
    }
  }

  removeFromFreeUsers(userId: number): void {
    const index = this.freeUserIds.indexOf(userId);
    if (index !== -1) {
      this.freeUserIds.splice(index, 1);
    }
  }

  addToPremiumUsers(userId: number): void {
    if (!this.premiumUserIds.includes(userId)) {
      this.premiumUserIds.push(userId);
    }
  }

  removeFromPremiumUsers(userId: number): void {
    const index = this.premiumUserIds.indexOf(userId);
    if (index !== -1) {
      this.premiumUserIds.splice(index, 1);
    }
  }
  
}
