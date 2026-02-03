import { HttpClient } from '@angular/common/http';
import { Component, signal, OnInit } from '@angular/core'
import { Customer } from './models/customer';
import { CustomerService } from './services/customer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  public customers: Customer[] = [];
  constructor(private http: HttpClient, private customerService: CustomerService) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
    });
  }

  protected readonly title = signal('invoicesystem.client');
}
