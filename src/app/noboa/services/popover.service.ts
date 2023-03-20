import { IfeedBackCard } from './models/IfeedBack';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopoverService {

  public feedback: IfeedBackCard;

  constructor() { }
}
