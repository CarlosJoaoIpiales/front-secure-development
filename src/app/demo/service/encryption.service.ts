import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';
import { en } from '@fullcalendar/core/internal-common';

@Injectable({
    providedIn: 'root'
})
export class EncryptionService {
    private secretKey = environment.secret_key;
    /* 'r8*Y#s1L$k9z!Pq2W@v3&Tx$7jL^Bm%Q' */

    encrypt(password: string): string {
        return CryptoJS.AES.encrypt(password, this.secretKey).toString();
    }

    decrypt(encryptedPassword: string): string {
        const bytes = CryptoJS.AES.decrypt(encryptedPassword, this.secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
}
