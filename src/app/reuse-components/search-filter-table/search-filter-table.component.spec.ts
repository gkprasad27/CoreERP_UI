import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFilterTableComponent } from './search-filter-table.component';

describe('SearchFilterTableComponent', () => {
  let component: SearchFilterTableComponent;
  let fixture: ComponentFixture<SearchFilterTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFilterTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFilterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
