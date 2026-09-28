import { Directive, ElementRef, Input, OnInit } from "@angular/core";

@Directive({ selector: "[appLazyImage]", standalone: false })
export class LazyImage implements OnInit {

  @Input() src = "";

  constructor(private el: ElementRef<HTMLImageElement>) { }

  ngOnInit(): void {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.el.nativeElement.src = this.src;
          observer.disconnect();
        }
      });
    });

    observer.observe(this.el.nativeElement);
  }
}