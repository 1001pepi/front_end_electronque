import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<firebase.default.User>;
    public currentUser: Observable<firebase.default.User>;

    constructor(private http: HttpClient, private angularFireAuth: AngularFireAuth) {
        this.currentUserSubject = new BehaviorSubject<firebase.default.User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): firebase.default.User {
        if(localStorage.getItem('currentUser')){

            var tmp = new BehaviorSubject<firebase.default.User>(JSON.parse(localStorage.getItem('currentUser')));
            this.currentUserSubject = tmp;
            this.currentUser = tmp.asObservable();

            return tmp.value;
        }

        return this.currentUserSubject.value;
    }

    /* Sign up */
    signUp(email: string, password: string) {

        return this.angularFireAuth
            .createUserWithEmailAndPassword(email, password)
    }

    login(email: any, password: any) {
        return this.angularFireAuth
        .signInWithEmailAndPassword(email, password)
        
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}