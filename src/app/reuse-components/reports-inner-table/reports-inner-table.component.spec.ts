import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsInnerTableComponent } from './reports-inner-table.component';

describe('ReportsInnerTableComponent', () => {
  let component: ReportsInnerTableComponent;
  let fixture: ComponentFixture<ReportsInnerTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsInnerTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsInnerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
