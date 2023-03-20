import { Injectable } from "@angular/core";


export class UserChat {
    id: string;
    name: string;
    email: string;
    phone: string;
    photoUrl: string;
    welcomeMessage: string;
    image: string;
    configuration: string;
}
export interface IuserChat {
    id: string;
    name: string;
    email: string;
    phone: string;
    photoUrl: string;
    welcomeMessage: string;
    image: string;
    configuration: string;
}

export class chatTopic {
    id: string;
    subject: string;
    constructor(id: string, subject: string) {
        this.id = id;
        this.subject = subject;
    }
}

export class ChatResponse {
    chats: Chat[];
    httpStatus: string;
    message: string;
}

export class Chat {
    clientChat: UserChat;
    registrationDate: Date;
    reviews: number;
    requests: number;
    completed: number;
    rating: number;
    chatId: string;
    displayName: string;
    participantType: string;
    fullName: string;
    topic: string;
    id: string;
    meUserI: string;
    userId: string;
    otherUserId: string;
    status: ChatStatus;
    avatar: string;
    Members: ChatMember[];
}

export class ChatStatus {
    httpStatusCode: string;
    last_active_ago: Date;
    presence: string;
}

export class ChatStatusType {
    enumId: string;
    lastUpdatedStamp: Date;
    enumTypeId: string;
    description: string;
}

export class ChatStatusTypeList {
    OnlineStatusType: ChatStatusType[];
    httpStatus: string;
    message: string;
}

export class ChatMember {
    avatar: string;
    displayName: string;
    fullName: string;
    userId: string;
}


@Injectable({
    providedIn: "root",
})
export class ChatModelService {
    constructor() { }
}
