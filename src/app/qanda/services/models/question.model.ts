import { Answer } from "./answer.model";

export class Question {
  questionId: string;
  slug: string;
  title: string;
  description: string;
  catId: string;
  createdDate: Date;
  lastUpdatedStamp?: Date;
  userId: string;
  tags: string;
  bountied?: string;
  hasAnsweredQuestion?: boolean;
  hasVotedQuestion?: boolean;
  QuestionStatistics?: QuestionStatistics;
  Answers?: Answer[];
  Statistics?: Statistics;
  CatTitle?: string;
  hasSubscribed?: boolean;
}

export class QuestionStatistics {
  totUserQuestionVoteCount: number;
  totQuestionVotesCount: number;
  totQuestionUpVotesCount: number;
  totUserQuestionDownVoteCount: number;
  totQuestionDownVotesCount: number;
  totUserQuestionUpVoteCount: number;
  totQuestionAnswersCount: number;
}

export class Statistics {
  totAnswersCount: number;
  totQuestionsCount: number;
  totUserAnswersCount: number;
  totUserQuestionsCount: number;
}

export enum SearchType {
  All = 1,
  Categeory = 2,
  Tags = 3,
  User = 4,
  Search = 5,
}
