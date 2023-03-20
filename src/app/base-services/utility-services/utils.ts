import { AbstractControl } from "@angular/forms";
import { Injectable } from "@angular/core";

@Injectable()
export class Utils {
  static isObject(obj) {
    var type = typeof obj;
    return type === "function" || (type === "object" && !!obj);
  }

  static isObjectEmpty(obj) {
    if (undefined == obj || null == obj) {
      return true;
    }

    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) return false;
    }

    return true;
  }

  static objectNotEmpty(obj) {
    if (undefined == obj || null == obj) {
      return false;
    }

    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) return true;
    }

    return false;
  }

  static isStringEmpty(str) {
    if (undefined == str || null == str || "" == str) {
      return true;
    } else {
      return false;
    }
  }

  static stringNotEmpty(str) {
    if (undefined != str && null != str && str.length > 1) {
      return true;
    } else {
      return false;
    }
  }

  static iterationCopy(src) {
    let target = {};
    for (let prop in src) {
      if (src.hasOwnProperty(prop)) {
        // if the value is a nested object, recursively copy all it's properties
        if (this.isObject(src[prop])) {
          target[prop] = this.iterationCopy(src[prop]);
        } else {
          target[prop] = src[prop];
        }
      }
    }
    return target;
  }

  static isNotPresent(control: AbstractControl): boolean {
    let value = control.value;
    if (value === undefined || value === null) {
      return true;
    }
    return value !== "" ? false : true;
  }

  static getUserTopic(userId) {
    // let topic = `subscribe:${userId}`;
    // String topic =  String.format("NtUser%s", userId);
    let topic = `subscribe:NtUser${userId}`;
    console.log("Utils::getUserTopic() topic: " + topic);
    return topic;
}

static getNotificationTopics(topics) {
    let topic = `subscribe:${topics}`;
    console.log("Utils::getNotificationTopics() topic: " + topic);
    return topic;
}

}
