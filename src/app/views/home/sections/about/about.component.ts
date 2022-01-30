import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

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
  @ViewChild('container') public container: ElementRef;
  @ViewChild('canvas') public canvas: ElementRef<HTMLCanvasElement>;

  public yearsExperience: string;
  public stage: number = 0;

  // canvas variables
  public canvasTransform: Size;
  private canvasContext: CanvasRenderingContext2D | null;
  private pointCount: number = 200;
  private pointMinSize: number = 10;
  private pointMaxSize = 75;
  private points: Point[] = [];

  ngOnInit(): void {
    this.yearsExperience = this.calculateYearsExperience();
    setInterval(() => {
      this.stage += 1;
    }, 1000);

  }

  ngAfterViewInit(): void {
    const { width, height } = this.container.nativeElement.getBoundingClientRect();
    setTimeout(() => {
      this.canvasTransform = { width, height };
      this.createPoints();
      this.playAnimation();
    });
  }

  private calculateYearsExperience(): string {
    const start = new Date(2015, 9, 1);
    const current = Date.now();

    const dateDiff = Math.abs(current - start.getTime());
    const diffInDays = Math.ceil(dateDiff / (1000 * 60 * 60 * 24));
    const daysRemainder = diffInDays % 365;
    const years = (diffInDays / 365).toFixed(0);
    return `${years} years and ${daysRemainder} days`;
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
