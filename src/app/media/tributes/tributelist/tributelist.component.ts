import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import * as Models from "src/app/media/services/media-model.service";

@Component({
  selector: "app-tributelist",
  templateUrl: "./tributelist.component.html",
  styleUrls: ["./tributelist.component.scss"],
})
export class TributelistComponent implements OnInit {
  @Input()
  tributeList: Models.Tribute[];

  constructor(public modalController: ModalController) {}

  ngOnInit() {}

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
