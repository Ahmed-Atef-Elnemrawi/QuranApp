import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReciterListComponent } from './reciter-list.component';

describe('ReciterListComponent', () => {
  let component: ReciterListComponent;
  let fixture: ComponentFixture<ReciterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReciterListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReciterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
