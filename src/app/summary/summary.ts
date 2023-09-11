import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Utils } from '../services/utils.service';

@Component({
  selector: 'app-summary',
  templateUrl: 'summary.html',
  styleUrls: ['summary.scss']
})
export class SummaryPage {

  trip: any;
  rating: number = 0;
  public ratingRange = [1, 2, 3, 4, 5];

  constructor(public navCtrl: NavController, private api: ApiService, private utils: Utils) { }

  ionViewDidEnter() {
    this.api.getTripInProgress().subscribe(data => {
      if (data && data.result == 'success') {
        for (let at in data.trip)
          if (at.indexOf('_amount') != -1)
            data.trip[at] = parseFloat(data.trip[at]);

        this.trip = data.trip;
        this.trip.ended_at = new Date(this.trip.ended_at);
        this.trip.started_at = new Date(this.trip.started_at);
      }
    });
  }

  durationTime(): string {
    return (((this.trip['ended_at'] - this.trip['started_at']) / 1000) / 60).toFixed(1);
  }

  rateTrip() {
    this.api.rateTrip(this.trip.id, this.rating).subscribe(data => {
      if (data && data.result == 'success') {
        this.navCtrl.navigateRoot('home');
        this.utils.showAlert('Corrida Finalizada com Sucesso', 'Obrigado por correr com Weela', ['Ok'], true);
      }
    });
  }
  
  
  
  
}
