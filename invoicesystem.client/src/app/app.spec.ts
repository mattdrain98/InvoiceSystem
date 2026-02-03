import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [App],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve customers from the server', () => {
    const mockClients = [
      { id: 1, name: 'Matthew', billingAddress: '20035 Seminole, Redford, MI', email: 'test@gmail.com', isActive: true, created: Date.now() },
      { id: 2, name: 'Bill', billingAddress: '20035 Seminole, Redford, MI', email: 'test2@gmail.com', isActive: true, created: Date.now() },
    ];

    component.ngOnInit();

    const req = httpMock.expectOne('api/customer');
    expect(req.request.method).toEqual('GET');
    req.flush(mockClients);

    expect(component.customers).toEqual(mockClients);
  });
});
