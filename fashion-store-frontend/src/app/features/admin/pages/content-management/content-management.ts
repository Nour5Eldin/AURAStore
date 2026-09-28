import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil, timeout } from "rxjs/operators";
import { AdminContentService } from "../../services/admin-content.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { HomeSlide, SiteConfig } from "../../../../core/models/api-response.model";

@Component({
  selector: "app-content-management",
  standalone: false,
  templateUrl: "./content-management.html",
  styleUrls: ["./content-management.scss"],
})
export class ContentManagement implements OnInit, OnDestroy {
  activeTab: "slides" | "campaign" = "slides";

  // Slides data
  slides: HomeSlide[] = [];
  slidesLoading = true;
  slideForm!: FormGroup;
  showSlideForm = false;
  editingSlide: HomeSlide | null = null;
  selectedFile: File | null = null;
  imageSource: "url" | "file" = "url";

  // Campaign data
  campaign!: SiteConfig;
  campaignLoading = true;
  campaignForm!: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private contentSvc: AdminContentService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadSlides();
    this.loadCampaign();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForms(): void {
    this.slideForm = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(3)]],
      label: ["", [Validators.required]],
      description: ["", [Validators.required]],
      cta: ["SHOP NOW", [Validators.required]],
      link: ["/products", [Validators.required]],
      imageUrl: [""],
      order: [0, [Validators.required, Validators.min(0)]],
      isActive: [true],
    });

    this.campaignForm = this.fb.group({
      campaignTag: ["", [Validators.required]],
      campaignTitle: ["", [Validators.required, Validators.minLength(3)]],
      campaignDescription: ["", [Validators.required]],
      campaignBtnText: ["", [Validators.required]],
      campaignBtnLink: ["", [Validators.required]],
    });
  }

  // ─── Slide Operations ──────────────────────────────────────────────────────

  loadSlides(): void {
    this.slidesLoading = true;
    this.contentSvc
      .getAdminSlides()
      .pipe(timeout(15000), takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.slides = res.data ?? [];
          this.slidesLoading = false;
        },
        error: () => { this.slides = []; this.slidesLoading = false; },
      });
  }

  openAddSlide(): void {
    this.editingSlide = null;
    this.selectedFile = null;
    this.imageSource = "url";
    this.slideForm.reset({
      title: "",
      label: "",
      description: "",
      cta: "SHOP NOW",
      link: "/products",
      imageUrl: "",
      order: 0,
      isActive: true,
    });
    this.showSlideForm = true;
  }

  openEditSlide(slide: HomeSlide): void {
    this.editingSlide = slide;
    this.selectedFile = null;
    this.imageSource = "url";
    this.slideForm.patchValue({
      title: slide.title,
      label: slide.label,
      description: slide.description,
      cta: slide.cta,
      link: slide.link,
      imageUrl: slide.image,
      order: slide.order,
      isActive: slide.isActive,
    });
    this.showSlideForm = true;
  }

  closeSlideForm(): void {
    this.showSlideForm = false;
    this.editingSlide = null;
    this.selectedFile = null;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  setImageSource(source: "url" | "file"): void {
    this.imageSource = source;
  }

  saveSlide(): void {
    if (this.slideForm.invalid) {
      this.notify.error("Please fill in all required slide details.");
      return;
    }

    const val = this.slideForm.value;
    
    // Check image source selection
    if (this.imageSource === "url" && !val.imageUrl && !this.editingSlide) {
      this.notify.error("Please enter a direct image URL.");
      return;
    }
    if (this.imageSource === "file" && !this.selectedFile && !this.editingSlide) {
      this.notify.error("Please upload an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", val.title);
    formData.append("label", val.label);
    formData.append("description", val.description);
    formData.append("cta", val.cta);
    formData.append("link", val.link);
    formData.append("order", String(val.order));
    formData.append("isActive", String(val.isActive));

    if (this.imageSource === "url" && val.imageUrl) {
      formData.append("image", val.imageUrl);
    } else if (this.imageSource === "file" && this.selectedFile) {
      formData.append("image", this.selectedFile, this.selectedFile.name);
    } else if (this.editingSlide) {
      // Retain existing image if no new image is provided
      formData.append("image", this.editingSlide.image);
    }

    const action = this.editingSlide
      ? this.contentSvc.updateSlide(this.editingSlide._id!, formData)
      : this.contentSvc.createSlide(formData);

    action.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.notify.success(
          this.editingSlide ? "Slide updated successfully." : "Slide created successfully."
        );
        this.closeSlideForm();
        this.loadSlides();
      },
      error: (err) => {
        this.notify.error(err.error?.message || "Failed to save slide.");
      },
    });
  }

  deleteSlide(slide: HomeSlide): void {
    if (!confirm(`Are you sure you want to delete the slide "${slide.title}"?`)) {
      return;
    }

    this.contentSvc
      .deleteSlide(slide._id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notify.success("Slide deleted successfully.");
          this.loadSlides();
        },
        error: (err) => {
          this.notify.error("Failed to delete slide.");
        },
      });
  }

  toggleSlideActive(slide: HomeSlide): void {
    const updatedStatus = !slide.isActive;
    
    // We create a temporary form data to send patch update
    const formData = new FormData();
    formData.append("isActive", String(updatedStatus));

    this.contentSvc
      .updateSlide(slide._id!, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          slide.isActive = updatedStatus;
          this.notify.success(
            updatedStatus ? "Slide activated successfully." : "Slide deactivated successfully."
          );
        },
        error: () => {
          this.notify.error("Failed to update slide status.");
        },
      });
  }

  // ─── Campaign Operations ───────────────────────────────────────────────────

  loadCampaign(): void {
    this.campaignLoading = true;
    this.contentSvc
      .getAdminCampaign()
      .pipe(timeout(15000), takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.campaign = res.data;
          this.campaignForm.patchValue({
            campaignTag: this.campaign.campaignTag,
            campaignTitle: this.campaign.campaignTitle,
            campaignDescription: this.campaign.campaignDescription,
            campaignBtnText: this.campaign.campaignBtnText,
            campaignBtnLink: this.campaign.campaignBtnLink,
          });
          this.campaignLoading = false;
        },
        error: () => { this.campaignLoading = false; },
      });
  }

  saveCampaign(): void {
    if (this.campaignForm.invalid) {
      this.notify.error("Please fill in all campaign banner fields correctly.");
      return;
    }

    this.contentSvc
      .updateCampaign(this.campaignForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.campaign = res.data;
          this.notify.success("Campaign configuration saved successfully.");
        },
        error: () => {
          this.notify.error("Failed to save campaign configuration.");
        },
      });
  }
}
