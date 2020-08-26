import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewProductPage } from './new-product.page';

describe('NewProductPage', () => {
  let component: NewProductPage;
  let fixture: ComponentFixture<NewProductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewProductPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
