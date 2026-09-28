import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { AppState } from "../../store/app.state";
import { selectUser, selectIsLoggedIn, selectIsAdmin } from "../../store/auth/auth.selectors";
import { selectCartTotalItems } from "../../store/cart/cart.selectors";
import { logout } from "../../store/auth/auth.actions";
import { loadCart } from "../../store/cart/cart.actions";
import { User, NavCategory, NavSubcategory } from "../../core/models/api-response.model";
import { ProductCategoryService } from "../../features/catalog/services/product-category.service";

const TOPS_KEYWORDS = ["t-shirt", "jacket", "sweater", "coat", "top", "hoodie", "shirt", "activewear"];
const BOTTOMS_KEYWORDS = ["jean", "short", "trouser", "pant", "jogger", "skirt"];
const FORMAL_KEYWORDS = ["formal", "suit", "dress", "blazer"];

export interface MegaMenuItem {
  label: string;
  catId: string;
  subId: string;
}

export interface MegaMenuData {
  tops: MegaMenuItem[];
  bottoms: MegaMenuItem[];
  formal: MegaMenuItem[];
}

@Component({
  selector: "app-header",
  standalone: false,
  templateUrl: "./header.html",
  styleUrls: ["./header.scss"],
})
export class Header implements OnInit, OnDestroy {

  user$: Observable<User | null>;
  isLoggedIn$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  cartCount$: Observable<number>;
  isHomePage = true;
  isScrolled = false;
  isSearchOpen = false;
  searchQuery = '';
  isMobileMenuOpen = false;
  isAccountMenuOpen = false;
  activeMegaMenu: "men" | "women" | "kids" | null = null;
  allCategories: NavCategory[] = [];
  menMenu: MegaMenuData = { tops: [], bottoms: [], formal: [] };
  womenMenu: MegaMenuData = { tops: [], bottoms: [], formal: [] };
  kidsMenu: MegaMenuData = { tops: [], bottoms: [], formal: [] };

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private categorySvc: ProductCategoryService,
  ) {
    this.user$ = this.store.select(selectUser);
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.isAdmin$ = this.store.select(selectIsAdmin);
    this.cartCount$ = this.store.select(selectCartTotalItems);
    this.router.events.pipe(filter((event): event is NavigationEnd => event
      instanceof NavigationEnd), takeUntil(this.destroy$)).subscribe((event:
        NavigationEnd) => {
        this.isHomePage = event.urlAfterRedirects === '/' ||
          event.urlAfterRedirects === '';
      })
  }

  @HostListener("window:scroll")
  onScroll(): void {
    this.isScrolled = window.scrollY > 900;
  }

  @HostListener('document:keydown.escape')
  onEscKey(): void {
    this.closeMenus();
  }

  ngOnInit(): void {
    this.categorySvc.getCategoriesWithSubs()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.allCategories = res.data;
          this.buildMenus();
        },
        error: () => { this.allCategories = []; },
      });

    this.isLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loggedIn => {
        if (loggedIn) this.store.dispatch(loadCart());
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getSubsForGender(cat: NavCategory, gender: "men" | "women" | "kids"): NavSubcategory[] {
    return cat.subcategories.filter(sub => {
      const title = sub.title.toLowerCase();

      if (gender === 'women') {
        return title.includes('women');
      }

      if (gender === 'kids') {
        return title.includes('kids') || title.includes('child') || title.includes('boy') || title.includes('girl');
      }

      return title.includes('men') && !title.includes('women') && !title.includes('kids');
    });
  }

  private buildMenus(): void {
    this.menMenu = {
      tops: this.extractItems("men", TOPS_KEYWORDS),
      bottoms: this.extractItems("men", BOTTOMS_KEYWORDS),
      formal: this.extractItems("men", FORMAL_KEYWORDS)
    };

    this.womenMenu = {
      tops: this.extractItems("women", TOPS_KEYWORDS),
      bottoms: this.extractItems("women", BOTTOMS_KEYWORDS),
      formal: this.extractItems("women", FORMAL_KEYWORDS)
    };

    this.kidsMenu = {
      tops: this.extractItems("kids", TOPS_KEYWORDS),
      bottoms: this.extractItems("kids", BOTTOMS_KEYWORDS),
      formal: this.extractItems("kids", FORMAL_KEYWORDS)
    };
  }

  private extractItems(gender: "men" | "women" | "kids", keywords: string[]): MegaMenuItem[] {
    const items: MegaMenuItem[] = [];

    this.allCategories.forEach(cat => {
      const subs = this.getSubsForGender(cat, gender);

      subs.forEach(sub => {
        const subTitle = sub.title.toLowerCase();
        const catTitle = cat.title.toLowerCase();

        const matches = keywords.some(kw => subTitle.includes(kw) || catTitle.includes(kw));
        if (matches) {
          items.push({ label: sub.title, catId: cat._id, subId: sub._id });
        }
      });
    });

    return items;
  }

  openMegaMenu(menu: "men" | "women" | "kids"): void { this.activeMegaMenu = menu; }
  closeMegaMenu(): void { this.activeMegaMenu = null; }

  onLogout(): void {
    this.store.dispatch(logout());
    this.closeMenus();
  }

  toggleMobileMenu(): void { this.isMobileMenuOpen = !this.isMobileMenuOpen; }
  toggleAccountMenu(): void { this.isAccountMenuOpen = !this.isAccountMenuOpen; }

  closeMenus(): void {
    this.isMobileMenuOpen = false;
    this.isAccountMenuOpen = false;
    this.isSearchOpen = false;
    this.activeMegaMenu = null;
  }

  navigateTo(catId?: string, subId?: string, sortBy?: string, genderSearch?: string): void {
    const params: Record<string, string> = {};
    if (catId) params["categoryId"] = catId;
    if (subId) params["subCategoryId"] = subId;
    if (sortBy) params["sortBy"] = sortBy;
    if (genderSearch) params["search"] = genderSearch;
    else if (this.searchQuery.trim()) params["search"] = this.searchQuery.trim();
    this.router.navigate(["/products"], { queryParams: params });
    this.closeMenus();
    this.searchQuery = '';
  }
}