import { AfterViewInit, Component, DoCheck, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { InfoSectionComponent } from './info-section/info-section.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  @ViewChildren(InfoSectionComponent) private sections: QueryList<InfoSectionComponent>;

  private readonly inViewClassName: string = 'in-view';
  private readonly startedinViewClassName: string = 'in-view-static';

  constructor() { }

  ngAfterViewInit(): void {
    this.checkScrolledIntoView(true);
  }

  @HostListener('window:scroll', ['$event'])
  handleScroll(): void {
    this.checkScrolledIntoView(false);
  }

  private checkScrolledIntoView(onStart: boolean): void {
    const classToAdd = onStart ? this.startedinViewClassName : this.inViewClassName
    this.sections.forEach(element => {


      const rect = element.getRect();
      // add the class when the element is 2 thirds from top
      const topShown = rect?.top >= 0 && rect?.top < (window.innerHeight / 3) * 2;
      if (topShown) {
        element.activate(onStart);
      }
    });
  }
}
