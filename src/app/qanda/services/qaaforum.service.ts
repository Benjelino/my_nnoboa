import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import * as AppConstants from "src/app/base-services/common-service/app-constants/app-constants.service";



import { Question } from "./models/question.model";
import { Category, Categorys } from "./models/category.model";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";

@Injectable({
  providedIn: "root",
})
export class QaaForumService {
  constructor(private remoteSvrc: RemoteService) {}

  // --------------- Categories Operations ---------------
  storeCategory(category: Category, apikey: string) {
    let url = AppConstants.URL_LIVE_MOQUI_QAAFORUM_REST + "storeCategory";
    let credentials = {};

    const msgBody = {
      catId: category.catId,
      slug: category.slug,
      title: category.title,
      description: category.description,
      color: category.color,
      tags: category.tags,
    };

    return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  getCategories(apikey: string): Observable<Categorys> {
    let url = AppConstants.URL_LIVE_MOQUI_QAAFORUM_REST + "getCategories";

    return this.remoteSvrc.getHttpApikey(url, {}, apikey, {}, {});
  }

  getCategoryBySlug(
    categorySlug: string,
    apikey: string
  ): Observable<Category> {
    let url = AppConstants.URL_LIVE_MOQUI_QAAFORUM_REST + "getCategoryBySlug";
    let credentials = {};
    const params = {
      slug: categorySlug,
    };

    return this.remoteSvrc.getHttpApikey(url, credentials, apikey, params, {});
  }

  deleteCategory(categoryId: string, apikey: string) {
    let url = AppConstants.URL_LIVE_MOQUI_QAAFORUM_REST + "deleteCategory" + categoryId;

    const params = {
      catId: categoryId,
    };

    return this.remoteSvrc.deleteHttpApikey(url, {}, apikey, params, {});
  }

  // --------------- Answers CRUD Operations ---------------
  getQuestionAnswers(questionId: string, apiKey: string): Observable<any> {
    let url = AppConstants.URL_LIVE_MOQUI_QAAFORUM_REST + "getQuestionAnswers";
    const params = {
      questionId: questionId,
    };
  
    return this.remoteSvrc.postHttpApikey(url, params, {}, apiKey);
  }

  storeAnswer(
    answerId: string,
    answer: string,
    questionId: string,
    userId: string,
    apikey: string
  ) {
    let url = AppConstants.URL_LIVE_MOQUI_QAAFORUM_REST + "storeAnswer";
    let credentials = {};
    const msgBody = {
      answer: answer,
      questionId: questionId,
      userId: userId,
      answerId: answerId,
    };

    return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  deleteAnswer(answerId: string, apikey: string) {
    let url = AppConstants.URL_LIVE_MOQUI_QAAFORUM_REST + "deleteAnswer";
    const params = {
      answerId: answerId,
    };

    return this.remoteSvrc.deleteHttpApikey(url, {}, apikey, params, {});
  }

  voteAnswer(answerId: string, vote: string, userId: string, apikey: string) {
    let url = AppConstants.URL_LIVE_MOQUI_QAAFORUM_REST + "voteAnswer";
    let credentials = {};
    const msgBody = {
      answerId: answerId,
      vote: vote,
      userId: userId,
    };

    return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  getAnswersByUser(userId: string, apiKey: string): Observable<Question> {
    let url = AppConstants.URL_LIVE_MOQUI_QAAFORUM_REST + "getAnswersByUser";
    const params = {
      userId: userId,
    };
    return this.remoteSvrc.getHttpApikey(url, {}, apiKey, params, {});
  }

  getAnswersVotesByUser(userId: string, apiKey: string): Observable<any> {
    let url =
      AppConstants.URL_LIVE_MOQUI_QAAFORUM_REST + "getAnswersVotesByUser";
    const params = {
      userId: userId,
    };

    return this.remoteSvrc.postHttpApikey(url, params, {}, apiKey);
  }

  // --------------- Questions CRUD Operations ---------------
  getQuestionById(questionId: string, apiKey: string): Observable<Question> {
    let url = AppConstants.URL_LIVE_MOQUI_QAAFORUM_REST + "getQuestionById";
    const params = {
      questionId: questionId,
    };

    return this.remoteSvrc.postHttpApikey(url, params, {}, apiKey);
  }

  storeQuestion(question: Question, apikey: string) {
    let url = AppConstants.URL_LIVE_MOQUI_QAAFORUM_REST + "storeQuestion";
    let credentials = {};
    const msgBody = {
      slug: question.slug,
      title: question.title,
      description: question.description,
      questionId: question.questionId,
      tags: question.tags,
      catId: question.catId,
      userId: question.userId,
    };

    return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  deleteQuestion(questionId: string, apikey: string) {
    let url = AppConstants.URL_LIVE_MOQUI_QAAFORUM_REST + "deleteQuestion";
    const params = {
      questionId: questionId,
    };

    return this.remoteSvrc.deleteHttpApikey(url, {}, apikey, params, {});
  }

  voteQuestion(
    questionId: string,
    vote: string,
    userId: string,
    apikey: string
  ) {
    let url = AppConstants.URL_LIVE_MOQUI_QAAFORUM_REST + "voteQuestion";
    let credentials = {};
    const msgBody = {
      questionId: questionId,
      vote: vote,
      userId: userId,
    };

    return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  getQuestionsByUser(userId: string, apikey: string): Observable<any> {
    let url = AppConstants.URL_LIVE_MOQUI_QAAFORUM_REST + "getQuestionsByUser";
    const params = {
      userId: userId,
    };

    return this.remoteSvrc.postHttpApikey(url, params, {}, apikey);
  }

  getQuestionsByUserPage(
    userId: string,
    offset: number,
    limit: number,
    apikey: string
  ): Observable<any> {
    let url = AppConstants.URL_LIVE_MOQUI_QAAFORUM_REST + "getQuestionsByUser";
    const params = {
      userId: userId,
      offset: offset,
      limit: limit,
    };

    return this.remoteSvrc.postHttpApikey(url, params, {}, apikey);
  }

  getQuestionsByCategoryPage(
    catId: string,
    offset: number,
    limit: number,
    apikey: string
  ): Observable<any> {
    let url =
      AppConstants.URL_LIVE_MOQUI_QAAFORUM_REST + "getQuestionsByCategory";
    const params = {
      catId: catId,
      offset: offset,
      limit: limit,
    };
    return this.remoteSvrc.postHttpApikey(url, params, {}, apikey);
  }

  searchQuestions(
    searchItem: string,
    offset: number,
    limit: number,
    apikey: string
  ): Observable<any> {
    let url =
      AppConstants.URL_LIVE_MOQUI_QAAFORUM_SEARCH + "searchSimpleQueryString";
    const params = {
      qstr: searchItem,
      from: offset,
      size: limit,
    };
    return this.remoteSvrc.postHttpApikey(url, params, {}, apikey);
  }

  searchMyQuestions(
    userId: string,
    searchItem: string,
    offset: number,
    limit: number,
    apikey: string
  ): Observable<any> {
    let url =
      AppConstants.URL_LIVE_MOQUI_QAAFORUM_SEARCH + "searchSimpleQueryString";
    const params = {
      userId: userId,
      qstr: searchItem,
      from: offset,
      size: limit,
    };
    return this.remoteSvrc.postHttpApikey(url, params, {}, apikey);
  }

  getQuestionsByTag(
    tag: string,
    offset: number,
    limit: number,
    apikey: string
  ): Observable<any> {
    let url = AppConstants.URL_LIVE_MOQUI_QAAFORUM_REST + "/getQuestionsByTag";
    const params = {
      tag: tag,
      offset: offset,
      limit: limit,
    };
    return this.remoteSvrc.postHttpApikey(url, params, {}, apikey);
  }

  getQuestions(apikey: string): Observable<any> {
    let url = AppConstants.URL_LIVE_MOQUI_QAAFORUM_REST + "getQuestions";
    const params = {
    };

    return this.remoteSvrc.postHttpApikey(url, params, {}, apikey);
  }

  getQuestionsByPage(
    offset: number,
    limit: number,
    apikey: string
  ): Observable<any> {
    let url = AppConstants.URL_LIVE_MOQUI_QAAFORUM_REST + "getQuestions";
    const params = {
      offset: offset,
      limit: limit,
    };

    return this.remoteSvrc.postHttpApikey(url, params, {}, apikey);
  }

  getQuestionsVotesByUser(userId: string, apiKey: string): Observable<any> {
    let url = AppConstants.URL_LIVE_MOQUI_QAAFORUM_REST + "getQuestionsVotesByUser";
    const params = {
      userId: userId,
    };
    
    return this.remoteSvrc.postHttpApikey(url, params, {}, apiKey);
  }

  // --------------- Utils ---------------
  slugify(input: string): string {
    return input
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  }
  
}
