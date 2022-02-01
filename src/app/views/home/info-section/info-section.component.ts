import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-section',
  templateUrl: './info-section.component.html',
  styleUrls: ['./info-section.component.scss']
})
export class InfoSectionComponent {

  constructor(private ref: ElementRef) { }

  public activated: boolean = false;
  get element(): HTMLElement {
    return this.ref.nativeElement;
  }

  private inViewClass: string = 'in-view';
  private staticInViewClass: string = 'in-view';

  public activate(onStart: boolean): void {
    if (!this.activated) {
      const classToAdd = onStart ? this.staticInViewClass : this.inViewClass;
      this.ref.nativeElement.classList?.add(classToAdd);
      this.activated = true;
    }
  }

  public getRect() {
    return this.element.getBoundingClientRect();
  }

}
