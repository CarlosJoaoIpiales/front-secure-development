import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Brand } from '../api/brand.model';

@Injectable({
    providedIn: 'root'
})
export class BrandService {
    private apiUrl = 'http://localhost:8082/m3verificaciones/api/v1/brand';

    constructor(private http: HttpClient) { }

    getBrandById(id: string): Observable<Brand> {
        return this.http.get<Brand>(`${this.apiUrl}/${id}`);
    }
    getAllBrands(
        sort?: string
    ): Observable<Brand[]> {
        let params = new HttpParams();
        if (sort) {
            params = params.set('sort', sort);
        }
        return this.http.get<Brand[]>(this.apiUrl, { params });
    }
}
