import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReciterDetailComponent } from './reciter-detail.component';

describe('ReciterDetailComponent', () => {
  let component: ReciterDetailComponent;
  let fixture: ComponentFixture<ReciterDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReciterDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReciterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
