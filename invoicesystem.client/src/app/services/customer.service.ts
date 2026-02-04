import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly apiUrl = '/api/customer';

  // ✅ Dummy data (used for now)
  private readonly dummyCustomers: Customer[] = [
    {
      id: 1,
      name: 'Acme Corp',
      billingAddress: '123 Main St',
      email: 'billing@acme.com',
      isActive: true,
      created: Date.now()
    },
    {
      id: 2,
      name: 'Globex Inc',
      billingAddress: '456 Oak Ave',
      email: 'accounts@globex.com',
      isActive: true,
      created: Date.now()
    }
  ];

  constructor(private http: HttpClient) { }

  /**
   * Toggle between dummy data and API here
   */
  getCustomers(): Observable<Customer[]> {
    // dummy data
    return of(this.dummyCustomers);

    // API data (enable later)
    // return this.http.get<Customer[]>(this.apiUrl); //this will be the data we pull from the ASP.NET web API that pulls SQL data 
  }

  getCustomerById(id: number): Observable<Customer | undefined> {
    return of(this.dummyCustomers.find(c => c.id === id));
  }
}
