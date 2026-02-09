import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,          // <-- this is required
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css']
})
export class NavbarComponent {
  navbarCollapsed = true;

  constructor(private router: Router) { }

  toggleNavbar() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.navbarCollapsed = true; // close menu after click (for mobile)
  }
}
