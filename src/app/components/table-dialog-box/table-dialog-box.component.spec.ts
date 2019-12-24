import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDialogBoxComponent } from './table-dialog-box.component';

describe('TableDialogBoxComponent', () => {
  let component: TableDialogBoxComponent;
  let fixture: ComponentFixture<TableDialogBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableDialogBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
