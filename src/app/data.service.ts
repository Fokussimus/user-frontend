import { Injectable } from '@angular/core';

import { Http, Headers } from '@angular/http';

import { retry, map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Article } from './model/article';
import { ArticleFactory } from './model/article-factory';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private api = 'http://localhost:3000';
  private headers: Headers = new Headers();

  constructor(private http: Http) {
    this.headers.append('Content-Type', 'application/json');
  }

  private errorHandler(error: Error | any): Observable<any> {
    return Observable.throw(error);
  }

  getAllArticles(): Observable<Array<Article>> {
    return this.http
    .get(`${this.api}/articles`)
    .pipe(retry(3),
      map(response => response.json()),
      map(rawBooks => rawBooks.map(rawArticle => ArticleFactory.fromObject(rawArticle))),
      catchError(this.errorHandler)
    );
  }

  getSingle(id: string): Observable<Article> {
    return this.http
      .get(`${this.api}/articles/${id}`)
      .pipe(
        retry(3),
        map(response => response.json()),
        map(rawBook => ArticleFactory.fromObject(rawBook)),
        catchError(this.errorHandler)
      );
  }

}