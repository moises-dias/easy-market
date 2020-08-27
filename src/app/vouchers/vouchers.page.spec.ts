import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VouchersPage } from './vouchers.page';

describe('VouchersPage', () => {
  let component: VouchersPage;
  let fixture: ComponentFixture<VouchersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VouchersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VouchersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
