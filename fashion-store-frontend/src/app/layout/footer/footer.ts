import { Component } from "@angular/core";

@Component({
  selector: "app-footer",
  standalone: false,
  templateUrl: "./footer.html",
  styleUrls: ["./footer.scss"],
})
export class Footer {
  currentYear = new Date().getFullYear();

  socialLinks = [
    { name: "Instagram", url: "https://instagram.com", icon: "instagram" },
    { name: "Facebook", url: "https://facebook.com", icon: "facebook" },
    { name: "TikTok", url: "https://tiktok.com", icon: "tiktok" },
  ];

  quickLinks = [
    { label: "Home", route: "/" },
    { label: "New Arrivals", route: "/products" },
    { label: "Best Sellers", route: "/products" },
    { label: "About", route: "/about" },
    { label: "Contact", route: "/contact" },
    { label: "Privacy Policy", route: "/privacy" },
  ];
}