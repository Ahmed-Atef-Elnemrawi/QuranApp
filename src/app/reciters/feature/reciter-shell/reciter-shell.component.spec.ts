import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReciterShellComponent } from './reciter-shell.component';

describe('ReciterShellComponent', () => {
  let component: ReciterShellComponent;
  let fixture: ComponentFixture<ReciterShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReciterShellComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReciterShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
