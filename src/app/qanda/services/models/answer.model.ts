export class Answer  {
  answerId: string;
  answer: string;
  questionId: string;
  positiveVotes?: number;
  negativeVotes?: number;
  createdDate: Date;
  userId: string;
  lastUpdatedStamp?: Date;
  AnswerStatistics?: AnswerStatistics
}


export class AnswerStatistics  {
  totAnswerDownVotesCount : number;
        totUserAnswerUpVotesCount : number;
        totUserAnswerDownVotesCount : number;
        totAnswerUpVotesCount : number;
}
