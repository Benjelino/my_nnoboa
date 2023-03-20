import { Component, OnInit, Input } from '@angular/core';
import { PopoverService } from './../services/popover.service';


@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  @Input("value") value;

  constructor() { }

  ngOnInit() {}

}
