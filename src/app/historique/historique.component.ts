import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ){

  }

  ngOnInit(): void {
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

  

  /*fonction pour se déconnecter*/
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
