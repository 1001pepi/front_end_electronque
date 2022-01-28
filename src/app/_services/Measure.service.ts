import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'querystring';
import {Subject} from 'rxjs'
import { Measure } from '../_models/measure.models'

@Injectable()
export class MeasureService{
    measure:Measure = new Measure("","","","","","");
    measureSubject = new Subject<any>()

    historique:any[] = []
    historiqueSubject = new Subject<any>()

    constructor(private httpClient:HttpClient){}

    emitMeasure(){
        this.measureSubject.next(this.measure)
    }

    emitHistorique(){
      this.historiqueSubject.next(this.historique)
    }

    post(value:String){
      let a = {
        mega:2
      }
      this.httpClient
      .post<any>('http://localhost:3000/api', {etat:value})
      .subscribe(
        (reponse) => {
          console.log(reponse);
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      )

    }

    getMeasure(){
        this.httpClient
        .get<Measure>('http://localhost:3000/api')
        .subscribe(
          (response) => {
            this.measure = response;
            this.emitMeasure();
          },
          (error) => {
            console.log('Erreur ! : ' + error);
          }
        );
    }

    getMeasures(){
      this.httpClient
      .get<any[]>('http://localhost:3000/api/historique')
      .subscribe(
        (response) => {
          this.historique = response;
          this.emitHistorique();
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
  }

  createUser(email:String, password:String){
    this.httpClient
    .post<any>('http://localhost:3000/api/signUp', {email:email, password:password} )
    .subscribe(
      (reponse) => {
        console.log(reponse);
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    )
  }

}