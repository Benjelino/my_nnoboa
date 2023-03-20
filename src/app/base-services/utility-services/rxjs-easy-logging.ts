// https://ofek-dev.com/easy-logging-rxjs/
/*
  Then use anywhere like :
    observable.pipe( d(`next value is ` );
)
*/
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

export enum RxJsLoggingLevel {
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR
}

let rxjsLoggingLevel = RxJsLoggingLevel.TRACE;

export function setRxJsLoggingLevel(level: RxJsLoggingLevel) {
  rxjsLoggingLevel = level;
}

function a<T>(level: number) {
  return (message: string) => (source: Observable<T>) => source
    .pipe(
      tap(val => {
        if (level >= rxjsLoggingLevel) {
          console.log(message + ': ', val);
        }
      })
    );
}

export function t<T>(message: string) {
  return a<T>(RxJsLoggingLevel.TRACE)(message)
}

export function d<T>(message: string) {
  return a<T>(RxJsLoggingLevel.DEBUG)(message)
}

export function i<T>(message: string) {
  return a<T>(RxJsLoggingLevel.INFO)(message)
}

export function w<T>(message: string) {
  return a<T>(RxJsLoggingLevel.WARN)(message)
}

export function e<T>(message: string) {
  return a<T>(RxJsLoggingLevel.ERROR)(message)
}