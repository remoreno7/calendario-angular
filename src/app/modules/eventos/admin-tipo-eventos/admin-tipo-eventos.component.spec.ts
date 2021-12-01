import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTipoEventosComponent } from './admin-tipo-eventos.component';

describe('AdminTipoEventosComponent', () => {
  let component: AdminTipoEventosComponent;
  let fixture: ComponentFixture<AdminTipoEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminTipoEventosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTipoEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
