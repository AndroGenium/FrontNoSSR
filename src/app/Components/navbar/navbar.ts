import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { LocalUserService } from '../../Services/local-user-service';
import { AuthService } from '../../Services/auth-service';
import { debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';
import { User } from '../../Interfaces/inter';
import { ProductService } from '../../Services/product-service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  
  user$!: Observable<User | null>;
  dropdownOpen = false;

  searchQuery = '';
  searchResults: any[] = [];
  showSearchResults = false;

  private searchInput$ = new Subject<string>();

  constructor(
    private localUserService: LocalUserService,
    private authService: AuthService,
    private productService: ProductService,
    private router: Router
  ) {
    this.user$ = localUserService.user$;

    this.searchInput$
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe(query => this.performSearch(query));
  }

  handleSearch(): void {
    this.searchInput$.next(this.searchQuery.trim());
  }

  performSearch(query: string) {
    if (!query) {
      this.showSearchResults = false;
      this.searchResults = [];
      return;
    }

    this.productService.search(query).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.showSearchResults = true;
      },
      error: () => {
        this.searchResults = [];
        this.showSearchResults = true;
      }
    });
  }

  selectResult(item: any): void {
    this.showSearchResults = false;
    this.searchQuery = '';
    this.router.navigate(['/product', item.id]);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onClick(e: MouseEvent) {
    const t = e.target as HTMLElement;

    if (!t.closest('.profile-wrapper')) this.dropdownOpen = false;
    if (!t.closest('.search-container')) this.showSearchResults = false;
  }

  navigateToProfile(event: Event) {
    event.preventDefault();
    this.dropdownOpen = false;
    this.router.navigate(['/profile']);
  }

  async logout(event: Event) {
    event.preventDefault();
    this.dropdownOpen = false;
    await this.authService.logout();
  }
}