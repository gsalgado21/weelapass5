import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Utils } from '../services/utils.service';

@Component({
  selector: 'app-history',
  templateUrl: 'history.html',
  styleUrls: ['history.scss'],
})
export class HistoryPage implements OnInit {
  trips: Array<any>;

  constructor(public api: ApiService, public utils: Utils) {}

  ngOnInit() {
    this.getTrips();
  }

  getTrips() {
    this.utils.showLoading();
    this.api.getMyTrips().subscribe((data: any) => {
      if (data && data.result === 'success') {
        this.trips = data.trips;
      }
      this.utils.hideLoading();
    });
  }
}
