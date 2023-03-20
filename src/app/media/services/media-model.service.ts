import { Injectable } from "@angular/core";

export interface Event {
  mediumId: string;
  userId?: string;
  locationName: string;
  locationGPS?: string;
  description: string;
  startDate: Date;
  endDate: Date;
  eventId?: string;
}

export enum mediumType {
  Announcement = 100,
  News = 200,
  Opinion = 300,
  Story = 400,
}

export enum linkType {
  Announcement = 100,
  News = 200,
  Website = 300,
}

export enum FunNoteType {
  Biography = "BIO",
  Condolences = "CON",
  Eulogy = "EUL",
  Memories = "MEM",
  Obituary = "OBI",
  Sympathy = "SYM",
  Thank_You = "TNY",
  Tribute = "TRB",
}

export interface Tribute {
  tributeId: string;
  mediumId: string;
  appId: string;
  ttype: string;
  userId: string;
  title: string;
  author: string;
  location: string;
  tag: string;
  content: string;
  datePosted: Date;
  imageFile: string;
}

export interface Annoucement {
  author: string;
  content: string;
  title: string;
  datePosted: Date;
  anousId: string;
  tag: string;
}

export interface Annoucements {
  list: Annoucement[];
  httpStatus: string;
  message: string;
}

export interface Hits {
  hits: Hit[];
}

export interface Hit {
  _source: Medium;
}

export interface UserStat {
  totAnnounceUserIdCount: number;
  totNewsUserIdCount: number;
  totOpinionUserIdCount: number;
  totLikesUserIdLikeCount: number;
  totLikesUserIdDislikeCount: number;
  totLinksUserIdCount: number;
  httpStatus: string;
  totCommentsUserIdCount: number;
  message: string;
  userId: string;
  totMediaUserIdCount: number;
  totStoryUserIdCount: number;
}

export interface AnnoucementResponse {
  httpStatus: number;
  message: string;
  anousId: string;
}

export interface Link {
  mediumId: number;
  linkId: number;
  ltype: number;
  urlink: string;
  mname: string;
  title: string;
}

export interface LinkList {
  list: Link[];
  httpStatus: string;
  message: string;
}

export interface NewsList {
  list: News[];
  httpStatus: string;
  message: string;
}

export interface News {
  author: string;
  content: string;
  title: string;
  datePosted: Date;
  newsId: string;
  tag: string;
}

export interface Comment {
  cmcId: number;
  subject: string;
  name: string;
  dateCommented: Date;
  comment: string;
}

export interface Comments {
  cmap: Comment[];
  httpStatus: string;
  message: string;
  mediumId: number;
  userId: string;
  CommentStats: CommentStats;
}

export interface CommentStats {
  totCommentMediumIdCount: number;
  totCommentsUserIdCount: number;
}

export interface CommentResponse {
  cmcId: number;
  message: string;
  httpStatus: string;
  mediumId: string;
}

export interface LikeResponse {
  cmlId: number;
  message: string;
  httpStatus: string;
  mediumId: string;
}

export interface LikeCount {
  totDislikeCount: number;
  totCount: number;
  httpStatus: string;
  mediumId: string;
  totLikeCount: number;
  message: string;
}

export interface Medium {
  author: string;
  content: string;
  title: string;
  datePosted: Date;
  mediumId: string;
  tag: string;
  mtype: number;
  imageUrl: string;
  LikeStats: LikeStats;
  CommentStats: CommentStats;
  httpStatus?: string;
  events: Event[];
  links: Link[];
  tributes: Tribute[];
}

export interface LikeStats {
  totLikeMediumIdLikeCount: number;
  totLikeCount: number;
  totLikeMediumIdCount: number;
  totLikesUserIdCLikeCount: number;
  totLikesUserIdCDislikeCount: number;
  totLikeMediumIdDislikeCount: number;
}

export interface CommentStats {
  totCount: number;
  totCommentMediumIdCount: number;
  totCommentsUserIdCount: number;
}

export interface MediaStats {
  totMediaCount: number;
  totMediaTypeCount: number;
  totMediaTypeUserIdCount: number;
}

export interface MediumList {
  list: Medium[];
  httpStatus: string;
  message: string;
  mtype: number;
  MediaStats: MediaStats;
}

export interface MediumSearchList {
  _source: Medium;
  events: Event[];
}

@Injectable({
  providedIn: "root",
})
export class MediaModelService {
  constructor() {}
}
