import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSectionComponent } from './info-section.component';

describe('InfoSectionComponent', () => {
  let component: InfoSectionComponent;
  let fixture: ComponentFixture<InfoSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoSectionComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add "in-view" class on activate', () => {
    component.activate(false);
    expect(component.element.classList.contains('in-view'));
  });

  it('should add "in-view-static" class on activate', () => {
    component.activate(true);
    expect(component.element.classList.contains('in-view-static'));
  });
});
