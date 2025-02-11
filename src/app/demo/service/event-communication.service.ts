import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventCommunicationService {
    private saveUser = new Subject<void>();
    saveUser$ = this.saveUser.asObservable();
    private companyChangeSource = new Subject<void>();
    companyChange$ = this.companyChangeSource.asObservable();
    emitSaveUser() {
        this.saveUser.next();
    }
    emitCompanyChange() {
        this.companyChangeSource.next();
    }
}