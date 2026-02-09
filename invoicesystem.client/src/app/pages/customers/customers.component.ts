import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer'

@Component({
  selector: 'app-customers',
  standalone: false,
  templateUrl: 'customers.component.html'
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  loading = true;

  constructor(private customersService: CustomerService) { }

  ngOnInit(): void {
    this.customersService.getCustomers().subscribe({
      next: data => {
        this.customers = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error fetching customers', err);
        this.loading = false;
      }
    });
  }
}
