import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { Measure } from '../_models/measure.models';
import { AuthenticationService } from '../_services';
import { MeasureService } from '../_services/Measure.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: firebase.default.User;
  subscription:Subscription = new Subscription()
  public measure:Measure = new Measure("","","","","","")
  public interval:Subscription = new Subscription()
  toogle:boolean = true

  constructor(
    private energyService:MeasureService, 
    private router: Router,
    private authenticationService: AuthenticationService){

      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    this.subscription = this.energyService.measureSubject.subscribe(
      (measure:any)=>{
        this.measure = measure 
      }
    )
    this.interval = interval(5500).subscribe(
      ()=>{
        this.energyService.getMeasure()
      },
      (err)=>{
        console.log('Error:' + err)
      }
    )

    this.energyService.emitMeasure()

    // setInterval(()=>{
    //   console.log("1")
    //   this.energyService.getMeasure()
    //   console.log(this.measure)
    // }, 1000)

    /*graphique pour les variables*/
    var xValues = [50,60,70,80,90,100,110,120,130,140,150];
    var yValues = [7,8,8,9,9,9,10,11,14,14,15];

    let ctx:any = document.getElementById("myChart");
    
    let myChar = new Chart("myChart", {
      type: "line",
      data: {
        labels: xValues,
        datasets: [{
          label: 'Consommation(Wh) vs time',
          backgroundColor: "rgba(0,0,0,1.0)",
          borderColor: "rgba(0,0,0,0.1)",
          data: yValues
        }]
      }
    });
  
  }

  toggleCurrent(){
    if(this.toogle){
      this.energyService.post("on")
      this.toogle = !this.toogle
    }
    else{
      this.energyService.post("off")
      this.toogle = !this.toogle
    }
    
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe()
      this.interval.unsubscribe()
  }

  /*fonction pour se déconnecter*/
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
