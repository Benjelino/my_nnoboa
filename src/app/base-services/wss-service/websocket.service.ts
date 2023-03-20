import { Injectable } from '@angular/core';

import { Subject, BehaviorSubject } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/auth-service/authentication.service';

import { Utils } from '../utility-services/utils';


@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    static ws: WebSocket = null;
    static connectState = new BehaviorSubject('notconnected');
    static topic = new Subject<string>();
    //static lcnSvrc: LocalNotificationService;

    // ,  public lcnSvrc: LocalNotificationService
    constructor(private auth: AuthenticationService) {
        //WebSocketService.lcnSvrc = lcnSvrc;
        WebSocketService.connectState.subscribe(state => {
            console.log('WebSocketService::constructor() state: ' + state);
            switch (state) {
                case 'connect':
                    console.log("WebSocketService::constructor() AuthenticationService.userLogin: " + JSON.stringify(AuthenticationService.userLogin));
                    //wsUrl: "wss://dcubedev.com/notws"
                    //wsUrl: "ws://localhost:8888/notws"
                    //wsUrl: "ws://10.0.0.126:8888/notws"
                    WebSocketService.ws = new WebSocket(AuthenticationService.env.wsUrl);

                    WebSocketService.ws.onopen = this.onOpen;
                    WebSocketService.ws.onmessage = this.onMessage;
                    WebSocketService.ws.onclose = this.onClose;
                    WebSocketService.ws.onerror = this.onError;
                    //WebSocketService.ws['singleNotification'] = this.singleNotification;
                    //WebSocketService.ws['backgroundNotification'] = this.backgroundNotification;
                    break;
                case 'connecting':
            
                    break;
                case 'connected':
               
                    break;
            }
        });

        // instead of a function, we will pass an object with next, error, and complete methods
        const subscription = WebSocketService.topic.subscribe({
            // on successful emissions
            next: event => {
                let msg = "WebSocketService.topic.subscribe() event: " + JSON.stringify(event);
                console.log(msg)
            },
            // on errors
            error: error => { console.log(error) },
            // called once on completion
            complete: () => console.log('WebSocketService.topic complete!')
        });

    }

    onOpen(msg) {
        console.log("WebSocketService::onOpen() MessageEvent msg: " + JSON.stringify(msg));
        //let smsg = Utils.getUserTopic(AuthenticationService.userLogin.userId);
        let smsg = Utils.getNotificationTopics(AuthenticationService.userLogin.subscribedTopics);
        console.log('WebSocketService::onOpen() smsg: ' + smsg);
        WebSocketService.ws.send(smsg);
    }

    onMessage(msg: MessageEvent) {
        console.log("WebSocketService::onMessage() message: " + JSON.stringify(msg));
        console.log("WebSocketService::onMessage() MessageEvent msg.data: " + JSON.stringify(msg.data));
        // forward message to listeners
        WebSocketService.topic.next(msg.data);
        WebSocketService.ws['backgroundNotification'](msg.data);
        WebSocketService.ws['singleNotification'](msg.data);
    }

    onClose(error) {
        console.log("WebSocketService::onClose() web socket closed " + JSON.stringify(error));
    }

    onError(data) {
        console.log("WebSocketService::onError() data: " + JSON.stringify(data));
    }

    singleNotification(ltext) {
        // Schedule a single notification
        // this.lcnSvrc.singleNotification
        /*
        WebSocketService.lcnSvrc.scheduleNotification({
            id: 1,
            text: ltext,
            data: { singlenotif: 'single notification' }
        });
        */
    }

    backgroundNotification(ltext) {
        // Schedule a foreground notification
        /*
        WebSocketService.lcnSvrc.scheduleNotification({
            text: ltext,
            trigger: { at: new Date(new Date().getTime() + 1) },
            foreground: true,
            sound: null
        });
        */
    }


}