import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: String;
  username: String;
  email: String;
  password: String;
  confirmPassword: String;

  constructor(private validateService: ValidateService, private flashmessagesService: FlashMessagesService) { }

  ngOnInit() {
  }

  onRegisterSubmit(){
    const user ={
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    }

    // Require Fields
    if(!this.validateService.valiateRegister(user)){
      this.flashmessagesService.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }

    // Validate Email
    if(!this.validateService.validateEmail(user.email)){
      this.flashmessagesService.show('Please use a valid email', {cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }

    // Validate Password
    if(!this.validateService.validatePassword(this.password, this.confirmPassword)){
      this.flashmessagesService.show('Password do not match', {cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }
  }
}
