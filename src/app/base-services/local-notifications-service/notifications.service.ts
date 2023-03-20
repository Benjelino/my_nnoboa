import { Injectable } from "@angular/core";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
/* import { AuthenticationService } from '../profile-service/authentication.service';
import {
  LocalNotifications,
  LocalNotificationSchema,
} from '@capacitor/local-notifications';
import { TodoSheetRow } from '../worksheet-service/models/sheet-row';
 */
import * as AppConstants from "../common-service/app-constants/app-constants.service";

@Injectable({
  providedIn: "root",
})
export class NotificationsService {
  constructor(private authService: AuthenticationService) {}

  /**
   * create or update an existing local notification
   * @param rowList
   */
  /*   async updateNotifications(rowList: TodoSheetRow[]) {
  
    await this.checkNotificationPermission();

    for (const todoItem of rowList) {
    
      if (this.canCreateNotification(todoItem)) {
       
        const notifications: LocalNotificationSchema[] = this.createNotificationsList(
          todoItem
        );
        await this.createNotification(notifications);
      }
    }
  } */

  /**
   * allow the creation of a notification for a todoItem
   * in order to set a notification for specific todoItem
   * notification should be activated for current user
   * the todoItem should have a due date and a priority
   * the due date should be in the future
   * @param todoItem
   */
  /*  canCreateNotification(todoItem: TodoSheetRow): boolean {
    return (
      this.authService.getUserLogin().isTodoNotify === 'Y' &&
      todoItem.dueDate &&
      todoItem.priority &&
      new Date(Number(todoItem.dueDate)) > new Date()
    );
  } */

  /**
   *  create notifications list to schedule
   * @param todoItem
   */
  /* createNotificationsList(todoItem: TodoSheetRow): LocalNotificationSchema[] {
    const notificationList: LocalNotificationSchema[] = [];
    const notificationHours: number[] = this.getNotificationHours(
      todoItem.dueDate
    );
    for (const hour of notificationHours) {
      const singleNotification = {
        id: this.getNotificationIndex(todoItem.priority, hour),
        title: AppConstants.NOTIFICATION_DEFAULT_TITLE,
        body: this.getNotificationMessage(todoItem.item, hour),
        schedule: this.getNotificationDeliveryDate(todoItem.dueDate, hour),
      };
      notificationList.push(singleNotification);
    }
    return notificationList;
  } */

  /**
   * get an array of different hours before a notification to schedule
   * @param dueDate
   */
  getNotificationHours(dueDate: string): number[] {
    const hours = this.getNumbersOfHoursBeforeDueDate(dueDate);
    if (hours < 1) {
      // notification at the todoItem due date
      return [0];
    } else if (hours >= 1 && hours < 24) {
      // notification 1h prior the todoItem due date
      // notification a the todoItem due date
      return [0, 1];
    } else {
      // notification 24h prior the todoItem due date
      // notification 1h prior the todoItem due date
      // notification a the todoItem due date
      return [0, 1, 24];
    }
  }

  /**
   * determine the number of hours remaining between now and the notification due date
   * @param dueDate
   */
  getNumbersOfHoursBeforeDueDate(dueDate: string): number {
    const now = new Date();
    const notificationDate = new Date(Number(dueDate));
    return Math.trunc(
      Math.abs(notificationDate.getTime() - now.getTime()) / 36e5
    );
  }

  /**
   * get notification index
   * @param priority
   * @param hour
   */
  /*   getNotificationIndex(priority: string, hour: number): number {
    return Number(priority) + hour * AppConstants.NOTIFICATION_INDEX_NUMBER;
  } */

  /**
   * get the notification message
   * @param title
   * @param hour
   */
  getNotificationMessage(title: string, hour: number): string {
    if (hour === 0) {
      return `${title} is now`;
    } else if (hour === 1) {
      return `${title} is in ${hour}h`;
    } else {
      return `${title} is tomorrow`;
    }
  }

  /**
   * get the date when the notification will be trigger
   * the notification is trigger x hours before the todoItem due date
   * @param dueDate due date of the notification
   * @param hoursBefore numbers of hours before due date
   */
  getNotificationDeliveryDate(dueDate: string, hoursBefore: number) {
    const notificationDate = new Date(Number(dueDate));
    notificationDate.setHours(notificationDate.getHours() - hoursBefore);
    return { at: notificationDate };
  }

  /**
   * Schedule one or more local notifications.
   * @param notifications
   */
  /*   async createNotification(notifications: LocalNotificationSchema[]) {
    await LocalNotifications.schedule({ notifications });
  } */

  /**
   * check to see if notification permissions is enabled on user device
   * otherwise request permissions from the user
   */
  /*   async checkNotificationPermission() {
    const notificationStatus = await LocalNotifications.checkPermissions();
    if (notificationStatus.display === 'denied') {
      await LocalNotifications.requestPermissions();
    }
  } */
}
