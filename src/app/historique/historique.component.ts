import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { MeasureService } from '../_services/Measure.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent implements OnInit {
  subscription:Subscription = new Subscription()
  public historique = []
  
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private energyService:MeasureService, 
  ){

  }

  ngOnInit(): void {
    this.subscription = this.energyService.historiqueSubject.subscribe(
      (historique:any)=>{
        this.historique = historique
      }
    )

    this.energyService.getMeasures();

    this.energyService.emitHistorique()

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
    
    var xValues = this.historique.reverse().map(historique => {
      const date = new Date(historique.date)

      return date.getDate().toString()+ " " + months[date.getMonth()] + " " + date.getFullYear().toString();
    })

    var yValues = this.historique.reverse().map(historique => historique.energy);

    let ctx:any = document.getElementById("myChart");
    
    let myChar = new Chart("myChart", {
      type: "bar",
      data: {
        labels: xValues,
        datasets: [{
          label: "consommation(wh)",
          backgroundColor: "rgba(0,0,0,1.0)",
          borderColor: "rgba(0,0,0,0.1)",
          data: yValues
        }]
      },
      options: {
        indexAxis: 'y',
        elements: {
          bar: {
            borderWidth: 2,
          }
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        }
      },
    });
    
  }

  

  /*fonction pour se déconnecter*/
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
