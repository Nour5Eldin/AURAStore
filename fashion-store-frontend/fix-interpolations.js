const fs = require('fs');
const path = require('path');

const fixProfile = () => {
  let content = fs.readFileSync('src/app/features/account/pages/profile-page/profile-page.html', 'utf8');
  content = content.replace(
    /\{\{\s*showCurrent\s*\?\s*'<span[^>]+>visibility_off<\/span>'\s*:\s*'<span[^>]+>visibility<\/span>'\s*\}\}/g,
    '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">{{ showCurrent ? "visibility_off" : "visibility" }}</span>'
  );
  content = content.replace(
    /\{\{\s*showNew\s*\?\s*'<span[^>]+>visibility_off<\/span>'\s*:\s*'<span[^>]+>visibility<\/span>'\s*\}\}/g,
    '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">{{ showNew ? "visibility_off" : "visibility" }}</span>'
  );
  content = content.replace(
    /\{\{\s*showConfirm\s*\?\s*'<span[^>]+>visibility_off<\/span>'\s*:\s*'<span[^>]+>visibility<\/span>'\s*\}\}/g,
    '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">{{ showConfirm ? "visibility_off" : "visibility" }}</span>'
  );
  content = content.replace(
    /\{\{\s*user\?.emailConsent\s*\?\s*'Subscribed[^>]+>check<\/span>'\s*:\s*'Not subscribed'\s*\}\}/g,
    '<ng-container *ngIf="user?.emailConsent">Subscribed <span class="material-icons" style="font-size:inherit;vertical-align:middle;">check</span></ng-container><ng-container *ngIf="!user?.emailConsent">Not subscribed</ng-container>'
  );
  fs.writeFileSync('src/app/features/account/pages/profile-page/profile-page.html', content);
};

const fixForgot = () => {
  let content = fs.readFileSync('src/app/features/auth/pages/forgot-password-page/forgot-password-page.html', 'utf8');
  content = content.replace(
    /\{\{\s*showPassword\s*\?\s*'<span[^>]+>visibility_off<\/span>'\s*:\s*'<span[^>]+>visibility<\/span>'\s*\}\}/g,
    '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">{{ showPassword ? "visibility_off" : "visibility" }}</span>'
  );
  content = content.replace(
    /\{\{\s*showConfirm\s*\?\s*'<span[^>]+>visibility_off<\/span>'\s*:\s*'<span[^>]+>visibility<\/span>'\s*\}\}/g,
    '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">{{ showConfirm ? "visibility_off" : "visibility" }}</span>'
  );
  fs.writeFileSync('src/app/features/auth/pages/forgot-password-page/forgot-password-page.html', content);
};

const fixProductCard = () => {
  let content = fs.readFileSync('src/app/shared/components/product-card/product-card.html', 'utf8');
  content = content.replace(
    /\{\{\s*isAdding\s*\?\s*'<span[^>]+>check<\/span>\s*Added'\s*:\s*'Quick Add'\s*\}\}/g,
    '<ng-container *ngIf="isAdding"><span class="material-icons" style="font-size:inherit;vertical-align:middle;">check</span> Added</ng-container><ng-container *ngIf="!isAdding">Quick Add</ng-container>'
  );
  fs.writeFileSync('src/app/shared/components/product-card/product-card.html', content);
};

const fixContentMgmt = () => {
  let content = fs.readFileSync('src/app/features/admin/pages/content-management/content-management.html', 'utf8');
  content = content.replace(
    /\{\{\s*editingSlide\s*\?\s*'<span[^>]+>edit<\/span>\s*Edit Carousel Slide'\s*:\s*'<span[^>]+>add<\/span>\s*Add Carousel Slide'\s*\}\}/g,
    '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">{{ editingSlide ? "edit" : "add" }}</span> {{ editingSlide ? "Edit Carousel Slide" : "Add Carousel Slide" }}'
  );
  fs.writeFileSync('src/app/features/admin/pages/content-management/content-management.html', content);
};

fixProfile();
fixForgot();
fixProductCard();
fixContentMgmt();

