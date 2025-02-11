import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Importa el operador `map`

// Definir las interfaces para las respuestas de GeoNames
interface GeoNamesResponse {
    geonames: GeoNames[];
}

interface GeoNames {
    countryName?: string;
    countryCode?: string;
    geonameId: string;
    name: string;
    lat: number;
    lng: number;
}

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    private geoNamesUrl = 'http://api.geonames.org';
    private username = 'shadowmoon'; 

    constructor(private http: HttpClient) { }

    getCountries(): Observable<GeoNames[]> {
        const params = new HttpParams().set('username', this.username);
        return this.http.get<GeoNamesResponse>(`${this.geoNamesUrl}/countryInfoJSON`, { params })
            .pipe(
                map(response => response.geonames)
            );
    }

    getProvinces(countryCode: string): Observable<GeoNames[]> {
        const params = new HttpParams().set('username', this.username);
        return this.http.get<GeoNamesResponse>(`${this.geoNamesUrl}/childrenJSON`, {
            params: params.set('geonameId', countryCode)
        })
            .pipe(
                map(response => response.geonames)
            );
    }

    getCities(provinceCode: string): Observable<GeoNames[]> {
        const params = new HttpParams().set('username', this.username);
        return this.http.get<GeoNamesResponse>(`${this.geoNamesUrl}/childrenJSON`, {
            params: params.set('geonameId', provinceCode)
        })
            .pipe(
                map(response => response.geonames) 
            );
    }
}
