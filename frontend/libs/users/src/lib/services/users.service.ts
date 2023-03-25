import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { User } from '../models/user.model';
import * as countriesLib from 'i18n-iso-countries';

declare const require: any;

@Injectable()
export class UsersService {
    apiUrl = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient) {
        countriesLib.registerLocale(
            require('i18n-iso-countries/langs/en.json')
        );
    }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    getUserById(userId: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${userId}`);
    }

    createUsers(user: User): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
    }

    updateUser(user: User): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
    }

    deleteUser(userId: string): Observable<Record<string, string>> {
        return this.http.delete<Record<string, string>>(
            `${this.apiUrl}/${userId}`
        );
    }

    getUsersCount(): Observable<number> {
        return this.http
            .get<number>(`${this.apiUrl}/get/count`)
            .pipe(map((objectValue: any) => objectValue.usersCount));
    }

    getCountries(): Record<string, string>[] {
        return Object.entries(
            countriesLib.getNames('en', { select: 'official' })
        ).map((entry: any) => {
            return {
                code: entry[0],
                name: entry[1]
            };
        });
    }

    getCountry(countryKey: string): string {
        return countriesLib.getName(countryKey, 'en');
    }
}
