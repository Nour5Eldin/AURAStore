import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: false,
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.scss',
})
export class StarRating implements OnChanges {
  /** The current rating value (1–5). Pass 0 for no rating. */
  @Input() value: number = 0;
  /** When true the user can click/hover to set a rating. */
  @Input() interactive = false;
  /** Size in pixels for the star icons. */
  @Input() size: number = 16;

  @Output() ratingChange = new EventEmitter<number>();

  stars: ('full' | 'half' | 'empty')[] = [];
  hoverValue: number = 0;

  ngOnChanges(): void {
    this.buildStars(this.value);
  }

  buildStars(rating: number): void {
    this.stars = [1, 2, 3, 4, 5].map(i => {
      if (i <= Math.floor(rating)) return 'full';
      if (i - 0.5 <= rating) return 'half';
      return 'empty';
    });
  }

  onHover(index: number): void {
    if (!this.interactive) return;
    this.hoverValue = index;
    this.buildStars(index);
  }

  onLeave(): void {
    if (!this.interactive) return;
    this.hoverValue = 0;
    this.buildStars(this.value);
  }

  onClick(index: number): void {
    if (!this.interactive) return;
    this.ratingChange.emit(index);
  }
}
