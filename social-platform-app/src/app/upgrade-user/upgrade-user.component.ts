import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-upgrade-user',
  templateUrl: './upgrade-user.component.html',
  styleUrls: ['./upgrade-user.component.scss']
})
export class UpgradeUserComponent implements OnInit {
  @ViewChild('paymentRef', { static: true }) paymentRef!: ElementRef;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.loggedInUser$.subscribe((user: any) => {
      window.paypal
        .Buttons({
          style: {
            layout: 'horizontal',
            color: 'blue',
            shape: 'rect',
            label: 'paypal'
          },
          createOrder: (data: any, actions: any) => {
            const amount = 20; 

            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount.toString(),
                    currency_code: 'USD' 
                  }
                }
              ]
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
            // If payment was successful, add user to premium users
            if (order.status === 'COMPLETED' && user && user.id) {
              this.authService.addToPremiumUsers(user.id);
            }
          },
        })
        .render(this.paymentRef.nativeElement);
    });
  }
}
