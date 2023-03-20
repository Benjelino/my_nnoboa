import { ToastController } from "@ionic/angular";
import { Injectable } from "@angular/core";

@Injectable()
export class ToastComponent extends ToastController {
  private DEFAULT_MESSAGE_SUCCEED = "Operation Submitted Sucessfully";
  private DEFAULT_MESSAGE_FAILED = "Operation Failed";

  presentSuccess() {
    this.presentSuccessToast(this.DEFAULT_MESSAGE_SUCCEED);
  }

  presentFailure() {
    this.presentFailedToast(this.DEFAULT_MESSAGE_FAILED);
  }

  processResponse(data: any) {
    if (data.httpStatus == "200") {
      this.presentSuccessToast(data.message);
    } else {
      this.presentFailedToast(data.message);
    }
  }

  async presentSuccessToast(
    msg: string,
    duration: number = 2000
  ): Promise<void> {
    const toast = await this.create({
      message: msg,
      duration: duration,
      position: "middle",
      color: "sucess",
      buttons: [
        {
          side: "start",
          icon: "checkmark-done",
        },
      ],
    });
    toast.present();
  }

  async presentFailedToast(msg: string): Promise<void> {
    const toast = await this.create({
      message: msg,
      duration: 2000,
      position: "middle",
      color: "warning",
      buttons: [
        {
          side: "start",
          icon: "alert-circle",
        },
      ],
    });
    toast.present();
  }
}
