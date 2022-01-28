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
  price:any = 0.0;
  historySubscription:Subscription = new Subscription()
  public measure:Measure = new Measure("","","","","","")
  public historique = []
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
        this.price = parseFloat(measure.finalEnergyValue) * 0.05;
      }
    )

    this.historySubscription = this.energyService.historiqueSubject.subscribe(
      (historique:any)=>{
        this.historique = historique
      }
    )

    this.interval = interval(5000).subscribe(
      ()=>{
        this.energyService.getMeasure()
      },
      (err)=>{
        console.log('Error:' + err)
      }
    )

    this.interval = interval(3000).subscribe(
      ()=>{
        this.energyService.getMeasures();
      },
      (err)=>{
        console.log('Error:' + err)
      }
    )

    this.energyService.emitMeasure()

    this.energyService.emitHistorique()

    // setInterval(()=>{
    //   console.log("1")
    //   this.energyService.getMeasure()
    //   console.log(this.measure)
    // }, 1000)

    /*graphique pour les variables*/
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]

    var tmpHistory = []

    if(this.historique.length > 10){
      tmpHistory = this.historique.filter((historique, index) => this.historique.length - index >= 10)

    }else{
      tmpHistory = this.historique
    }

    var xValues = tmpHistory.map(historique => {
      const date = new Date(historique.date)

      return date.getDate().toString()+ " " + months[date.getMonth()] + " " + date.getFullYear().toString();
    })

    var yValues = tmpHistory.map(historique => historique.energy);

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
    console.log("hi");
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
