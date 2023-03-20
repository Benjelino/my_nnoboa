import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-noboaabout",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"],
})
export class AboutComponent {
  constructor(private modalController: ModalController) {}

  dismiss(): void {
    this.modalController.dismiss();
  }
}
