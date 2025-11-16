import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { LocalUserService } from '../../Services/local-user-service';
import { AuthService } from '../../Services/auth-service';
import { Observable } from 'rxjs';
import { User } from '../../Interfaces/inter';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  
  user$!: Observable<User | null>;
  dropdownOpen = false;
  
  // Search
  searchQuery = '';
  searchResults: string[] = [];
  showSearchResults = false;

  constructor(
    private localUserService: LocalUserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.user$ = localUserService.user$;
  }

  ngOnInit(): void {
    this.localUserService.user$.subscribe(user => {
      console.log("✅ Current User From Navbar:", user);
    });
  }

  // Toggle dropdown
  toggleDropdown(): void {
    console.log('🔽 Toggling dropdown, current state:', this.dropdownOpen);
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const profileWrapper = target.closest('.profile-wrapper');
    
    if (!profileWrapper && this.dropdownOpen) {
      this.dropdownOpen = false;
    }

    const searchContainer = target.closest('.search-container');
    if (!searchContainer && this.showSearchResults) {
      this.showSearchResults = false;
    }
  }

  // Navigate to profile
  navigateToProfile(event: Event): void {
    event.preventDefault();
    console.log('📝 Navigating to profile');
    this.dropdownOpen = false;
    this.router.navigate(['/profile']);
  }

  // Logout
  async logout(event: Event): Promise<void> {
    event.preventDefault();
    console.log('👋 Logging out');
    this.dropdownOpen = false;
    await this.authService.logout();
  }

  // Handle search
  handleSearch(): void {
    if (!this.searchQuery.trim()) {
      this.showSearchResults = false;
      this.searchResults = [];
      return;
    }

    // API CALL: Replace with actual search
    // this.toolService.searchTools(this.searchQuery).subscribe(results => {
    //   this.searchResults = results;
    // });

    // Mock results
    this.searchResults = [
      `Hammer - "${this.searchQuery}"`,
      `Drill - "${this.searchQuery}"`,
      `Saw - "${this.searchQuery}"`
    ];
    
    this.showSearchResults = true;
  }

  // Select search result
  selectResult(result: string): void {
    console.log('🔍 Selected:', result);
    this.showSearchResults = false;
    this.searchQuery = '';
    // Navigate to search results or tool details
  }
}