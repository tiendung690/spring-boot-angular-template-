import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/finally';
import { Output } from '@angular/core';
import { LoginService } from '../services/login.service';
import { TemplateUserFactory } from '../models/template-user-factory';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  auth = false;
  @Output() authenticated = new EventEmitter<boolean>();
  templateUser = TemplateUserFactory.empty();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.authenticate();
  }

  authenticate() {
    this.loginService
      .getTemplateUser()
      .finally(() => {
        this.authenticated.emit(this.auth);
      })
      .subscribe(
        templateUser => {
          this.templateUser = templateUser;
          this.auth = templateUser['id'] ? true : false;
        },
        () => {
          this.auth = false;
        }
      );
  }

  logout() {
    this.loginService
      .logout()
      .finally(() => {
        this.auth = false;
        this.authenticated.emit(this.auth);
      })
      .subscribe();
  }
}
