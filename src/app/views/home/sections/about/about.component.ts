import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Subject, interval, takeUntil } from 'rxjs';

type Vector2D = {
  x: number;
  y: number;
}

type Size = { width: number, height: number };

class Point {

  constructor(
    public position: Vector2D,
    public size: number,
    public opacity: number,
    public direction: Vector2D) { }

  public move(bounds: Size): void {
    this.position.x += this.direction.x;
    this.position.y += this.direction.y;

    // if it leaves the right bounds send to left
    if (this.position.x > bounds.width + this.size) {
      this.position.x = 0 - this.size;
    }
    // if it leaves the left bounds send to right
    if (this.position.x < 0 - this.size) {
      this.position.x = bounds.width + this.size;
    }
    // if it leavs the bottom send to top
    if (this.position.y > bounds.height + this.size) {
      this.position.y = 0 - this.size;
    }
    // if it leaves the top send to bottom
    if (this.position.y < 0 - this.size) {
      this.position.y = bounds.height + this.size;
    }
  }
}

@Component({
  selector: 'app-about-info-section',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, AfterViewInit {
  @ViewChild('container') public container: ElementRef<HTMLElement>;
  @ViewChild('canvas') public canvas: ElementRef<HTMLCanvasElement>;

  @Input('active') active: boolean = false;

  public experience: { years: number, days: number };
  public stage: number = 0;
  public windowWidth: number;
  public windowHeight: number;

  // canvas variables
  public canvasTransform: Size;
  private canvasContext: CanvasRenderingContext2D | null;
  private pointCount: number = 200;
  private pointMinSize: number = 10;
  private pointMaxSize = 75;
  private points: Point[] = [];

  // scrolling
  private $scrollComplete: Subject<boolean> = new Subject();

  ngOnInit(): void {
    this.experience = this.calculateYearsExperience();
    setInterval(() => {
      if (this.active) {
        if (this.container.nativeElement.classList.contains('active')) {
          this.stage += 1;
        } else {
          this.container.nativeElement.classList.add('active');
        }
      }
    }, 1000);

  }

  ngAfterViewInit(): void {
    // allow for change detection to stabalise
    setTimeout(() => {
      this.resize();
      this.createPoints();
      this.playAnimation();
    });
  }

  @HostListener('window:resize', ['$event'])
  resize() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.canvasTransform = { width: this.windowWidth, height: this.windowHeight };
  }

  public scrollToNextSection(): void {
    interval(10)
      .pipe(
        takeUntil(this.$scrollComplete)
      )
      .subscribe((v) => {
        if (document.body.scrollTop >= this.windowHeight) {
          this.$scrollComplete.next(true);
          return;
        }
        const val = v * 0.5;
        const slow = val > 25 ? 25 : val;
        document.body.scrollTo({ left: 0, top: document.body.scrollTop + (30 - slow) });
      });
  }

  private calculateYearsExperience(): { years: number, days: number } {
    const start = new Date(2015, 9, 1);
    const current = Date.now();

    const dateDiff = Math.abs(current - start.getTime());
    const diffInDays = Math.ceil(dateDiff / (1000 * 60 * 60 * 24));
    const daysRemainder = diffInDays % 365;
    const years = Math.floor((diffInDays / 365));
    return { years, days: daysRemainder };
  }

  private createPoints() {
    const randomInclNegatives = (num: number) => Math.random() * (num * 2) - num;

    for (let i = 0; i < this.pointCount; i++) {
      const position = {
        x: this.randomBetween(0, this.canvasTransform.width),
        y: this.randomBetween(0, this.canvasTransform.height),
      };
      const size = this.randomBetween(this.pointMinSize, this.pointMaxSize);
      const opacity = this.randomBetween(0.1, 0.6);
      const direction = {
        x: randomInclNegatives(0.3),
        y: randomInclNegatives(0.3),
      };

      const point = new Point(position, size, opacity, direction);
      this.points.push(point)
    }
  }

  private randomBetween(min: number, max: number): number {
    const num = Math.random() * max;
    return (num < min) ? min : num;
  }

  private playAnimation() {
    if (!!this.canvasContext) {
      const ctx = this.canvasContext as CanvasRenderingContext2D;
      ctx.imageSmoothingEnabled = true;
      ctx.clearRect(0, 0, this.canvasTransform.width, this.canvasTransform.height);

      this.points.forEach(p => {
        p.move(this.canvasTransform);
        ctx.fillStyle = `rgba(246, 231, 100, ${p.opacity})`;

        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.position.x, p.position.y, p.size / 2, 0, 2 * Math.PI);
        ctx.fill();
      });
    } else {
      this.canvasContext = this.canvas?.nativeElement.getContext('2d');
    }
    window.requestAnimationFrame(() => this.playAnimation());
  }
}
