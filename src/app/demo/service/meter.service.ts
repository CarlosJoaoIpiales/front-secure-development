import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Meter } from '../api/meter.model';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MeterService {
    private apiUrl = 'http://localhost:8082/m3verificaciones/api/v1/meter';

    constructor(private http: HttpClient) { }

    getMeterById(id: string): Observable<Meter> {
        return this.http.get<Meter>(`${this.apiUrl}/${id}`);
    }

    saveMeter(meter: Meter): Observable<Meter> {
        return this.http.post<Meter>(this.apiUrl, meter);
    }

    deleteMeterById(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    updateMeter(id: string, meter: Meter): Observable<Meter> {
        return this.http.put<Meter>(`${this.apiUrl}/${id}`, meter);
    }

    getAllMeters(
        model?: string,
        diameter?: number,
        type_communication?: string,
        id_company?: string,
        sort?: string
    ): Observable<Meter[]> {
        let params = new HttpParams();
        if (model) {
            params = params.set('model', model);
        }
        if (diameter) {
            params = params.set('diameter', diameter.toString());
        }
        if (type_communication) {
            params = params.set('type_communication', type_communication);
        }
        if (id_company) {
            params = params.set('id_company', id_company);
        }
        if (sort) {
            params = params.set('sort', sort);
        }

        return this.http.get<Meter[]>(this.apiUrl, { params });
    }

    getMetersByCompany(uniqueKeyCompany: string): Observable<Meter[]> {
        return this.http.get<Meter[]>(`${this.apiUrl}?id_company=${uniqueKeyCompany}`);
    }

    deleteMeterByCompanyID(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/company/${id}`);
    }

    uploadCSV(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file, file.name);

        return this.http.post(`${this.apiUrl}/upload`, formData, {
            headers: new HttpHeaders(),
            observe: 'response',
            responseType: 'text'
        }).pipe(
            map(response => {
                if (response.status === 200 || response.status === 201) {
                    return response.body;
                } else {
                    throw new Error('Error en el servidor');
                }
            }),
            catchError(error => {
                return throwError(error);
            })
        );
    }

    getMeterStatusCount(companyUniqueKey: string): Observable<any> {
        if (!companyUniqueKey) {
            return throwError('Company Unique Key is not provided');
        }
        const params = new HttpParams().set('company_unique_key', companyUniqueKey);

        return this.http.get<any>(`${this.apiUrl}/status/count`, { params });
    }

    getMetersLocations(companyUniqueKey: string): Observable<any> {
        if (!companyUniqueKey) {
            return throwError('Company Unique Key is not provided');
        }
        const params = new HttpParams().set('company_unique_key', companyUniqueKey);

        return this.http.get<any>(`${this.apiUrl}/coordinates`, { params });
    }
}
