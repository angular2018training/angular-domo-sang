import { Injectable } from "@angular/core";

@Injectable()
export class ValidationService {
  emailFormat = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;-\s@\"]+\.{0,1})+[^<>()\.,;:\s@\"]{2,})\.[a-z]{2,}$/;
}