import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChatsListPage } from './chats-list.page';

describe('ChatsListPage', () => {
  let component: ChatsListPage;
  let fixture: ComponentFixture<ChatsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatsListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
