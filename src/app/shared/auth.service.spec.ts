/* tslint:disable:no-unused-variable */
import { TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { MockBackend }                      from '@angular/http/testing';

import { Http, ConnectionBackend, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';

import { AuthService } from './auth.service';
import { baseURL }     from './options';

describe('Service: Auth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        BaseRequestOptions,
        MockBackend,
        { provide: Http, useFactory: (backend: ConnectionBackend,
                                      defaultOptions: BaseRequestOptions) => {
                                        return new Http(backend, defaultOptions);
                                      },
                                      deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should be', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));

  describe('signIn method', () => {
    it('authenticate user and returning login status',
      inject([AuthService, MockBackend], fakeAsync((service: AuthService, backend: MockBackend) => {
        let res;
        let apiURL = baseURL + 'api/login/?format=json';

        backend.connections.subscribe(connect => {
          expect(connect.request.url).toBe(apiURL);

          let response = new ResponseOptions({body: '{"success": "true", "token": "12345"}'});
          connect.mockRespond(new Response(response));
        });

        let loggedIn = false;
        let authUser = {};
        let mockUser = {username: 'user8', token: '12345'};

        service.isLoggedIn().subscribe(isLogged => {
          loggedIn = isLogged;
          authUser = service.getUser();
        });

        service.signIn('user8', '888').subscribe((_post: any) => {
          res = _post;
        });
        tick();

        expect(res).toBe(true);
        expect(loggedIn).toBe(true);
        expect(authUser).toEqual(mockUser);
      }))
    );
  });
});
