import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../api/message.model';

@Injectable({
    providedIn: 'root'
})
export class MessagesService {
    private apiUrl = 'http://localhost:8085/m3verificaciones/api/v1/messages';

    constructor(private http: HttpClient) { }

    getMessageById(id: string): Observable<Message> {
        return this.http.get<Message>(`${this.apiUrl}/${id}`);
    }
    getAllMessages(
        sort?: string
    ): Observable<Message[]> {
        let params = new HttpParams();
        if (sort) {
            params = params.set('sort', sort);
        }
        return this.http.get<Message[]>(this.apiUrl, { params });
    }
}
