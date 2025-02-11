import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gateway } from '../api/gateway.model';
import { throwError } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class GatewayService {

    private apiUrl = 'http://localhost:8080/m3verificaciones/api/v1/gateway';

    constructor(private http: HttpClient) { }

    getGatewaysByCompany(uniqueKeyCompany: string): Observable<Gateway[]> {
        return this.http.get<Gateway[]>(`${this.apiUrl}?id_company=${uniqueKeyCompany}`);
    }

    deleteGateway(gatewayId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${gatewayId}`);
    }

    saveGateway(gateway: Gateway): Observable<Gateway> {
        return this.http.post<Gateway>(this.apiUrl, gateway);
    }

    updateGateway(gateway: Gateway): Observable<Gateway> {
        return this.http.put<Gateway>(`${this.apiUrl}/${gateway.unique_key}`, gateway);
    }

    getGatewayById(gatewayId: string): Observable<Gateway> {
        return this.http.get<Gateway>(`${this.apiUrl}/${gatewayId}`);
    }

    getGatewayStatusCount(companyUniqueKey: string): Observable<any> {
        if (!companyUniqueKey) {
            return throwError('Company Unique Key is not provided');
        }
        const params = new HttpParams().set('unique_key_company', companyUniqueKey);
        return this.http.get<any>(`${this.apiUrl}/status/count`, { params });
    }
}