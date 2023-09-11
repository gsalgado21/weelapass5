import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { POSITION_INTERVAL, HERE_MAP_API_KEY } from "../../environments/environment";
import { PlaceService } from "../services/place.service";
import { ApiService } from '../services/api.service';
import { ServerSocket } from '../services/server.service';
import { Utils } from '../services/utils.service';
import { DriverService } from '../services/driver.service';

declare var H: any;

@Component({
  selector: 'app-tracking',
  templateUrl: 'tracking.html',
  styleUrls: ['tracking.scss']
})
export class TrackingPage implements OnInit, OnDestroy {
  driver: any;
  map: any;
  here_api: any;
  trip: any = {};
  driverTracking: any;
  tripStatus: any;
  alertCnt: any = 0;
  time: any;

  driver_marker: any;
  origin_marker: any;
  destination_marker: any;
  private websocketSubscription: any;

  infowindow: any;

  last_lat_lng: any;

  constructor(
    public nav: NavController,
    private api: ApiService,
    private utils: Utils,
    private socket: ServerSocket,
    public placeService: PlaceService,
    private driverService: DriverService
  ) {}

  ngOnInit() {
    let divMap = document.getElementById('map_tracking');

    this.here_api = new H.service.Platform({
      apikey: HERE_MAP_API_KEY
    });

    let maptypes = this.here_api.createDefaultLayers();

    this.map = new H.Map(
      divMap,
      maptypes.raster.normal.map,
      {
        zoom: 16,
        center: new H.geo.Point(-23.0269805, -45.5521864)
      });

    new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));

    window.addEventListener('resize', () => this.map.getViewPort().resize());
  }

  ngOnDestroy() {
    clearInterval(this.driverTracking);
    if (this.websocketSubscription) this.websocketSubscription.unsubscribe();
  }

  ionViewDidEnter() {
    this.utils.showLoading();
    this.api.getTripInProgress().subscribe(data => {
      this.utils.hideLoading();
      if (data && data.result == 'success') {
        this.trip = data.trip;
        this.driver = data.trip.driver;
        this.watchTrip(data.trip.id);
        this.updateMarkers();
        this.trackDriver();
      }
    }, err => {
      this.utils.showError();
    });
  }

  watchTrip(tripId) {
    if (!this.websocketSubscription) {
      this.websocketSubscription = this.socket.connect().subscribe((data) => {
        let resp = JSON.parse(data);
        if (typeof resp.message == 'object' && resp.message.trip_id.toString() == tripId.toString()) {
          if (resp.message.status == 'CANCELED') {
            this.utils.showAlert('Corrida Cancelada', 'A corrida foi cancelada pelo motorista', ['Ok'], false);
            this.nav.navigateRoot('home');
          } else if (resp.message.status == 'GOING') {
            this.trip.origin_latitude = this.trip.origin_longitude = null;
            this.updateMarkers();
            this.trip.status = 'GOING';
          } else if (resp.message.status == 'DONE') {
            this.nav.navigateRoot('summary');
          }
        }
      }, err => {
        if (this.websocketSubscription) {
          this.websocketSubscription.unsubscribe();
        }
        this.websocketSubscription = null;
        setTimeout(() => { this.watchTrip(tripId); }, 5000);
      });
    }
  }

  trackDriver() {
    this.showDriverOnMap();
    this.driverTracking = setInterval(() => {
      this.showDriverOnMap();
    }, POSITION_INTERVAL);
  }

  cancelTrip() {
    this.utils.showAlert('Cancelar Corrida', 'Tem certeza que deseja cancelar a corrida?', ['Não', {
      text: 'Sim',
      handler: () => {
        this.utils.showLoading();
        if (this.websocketSubscription) {
          this.websocketSubscription.unsubscribe();
        }
        this.api.cancelTrip(this.trip.id).subscribe(data => {
          if (data && data.result == 'success') {
            this.nav.navigateRoot('home');
          } else {
            this.utils.showError();
          }
          this.utils.hideLoading();
        }, err => {
          this.utils.hideLoading();
          this.utils.showError();
        });
      }
    }], false);
  }

  showDriverOnMap() {
    this.api.getDriverLocation(this.trip.driver_id).subscribe(data => {
      if (data && data.result == 'success') {
        let latLng = undefined;
        if (data.latitude == null || data.longitude == null) {
          latLng = this.last_lat_lng;
        } else {
          latLng = new H.geo.Point(data.latitude, data.longitude);
        }

        this.last_lat_lng = latLng;
        this.map.setCenter(latLng);

        if (this.driver_marker) {
          this.map.removeObject(this.driver_marker);
        }

        let angle = this.driverService.getIconWithAngle(
          this.last_lat_lng.lat,
          this.last_lat_lng.lng,
          latLng.lat,
          latLng.lng
        );

        let car_icon = new H.map.Icon('assets/img/car' + angle + '.png', { size: { w: 40, h: 40 } });
        this.driver_marker = new H.map.Marker(latLng, { icon: car_icon });
        this.map.addObject(this.driver_marker);

        if (this.trip.status == 'GOING') {
          this.time = this.calcCrow(latLng.lat, latLng.lng, this.trip.destination_latitude, this.trip.destination_longitude) + ' Min';
        } else {
          this.time = this.calcCrow(latLng.lat, latLng.lng, this.trip.origin_latitude, this.trip.origin_longitude) + ' Min';
        }
      }
    });
  }

  private updateMarkers() {
    if (this.trip.origin_latitude && this.trip.origin_longitude) {
      let green_icon = new H.map.Icon('assets/img/pin-green.png');

      if (this.origin_marker) {
        this.map.removeObject(this.origin_marker);
      }

      this.origin_marker = new H.map.Marker(new H.geo.Point(this.trip.origin_latitude, this.trip.origin_longitude), { icon: green_icon });
      this.map.addObject(this.origin_marker);
    } else {
      if (this.origin_marker) {
        this.map.removeObject(this.origin_marker);
      }
    }

    if (this.trip.destination_latitude && this.trip.destination_longitude) {
      let red_icon = new H.map.Icon('assets/img/pin-red.png');

      if (this.destination_marker) {
        this.map.removeObject(this.destination_marker);
      }

      this.destination_marker = new H.map.Marker(new H.geo.Point(this.trip.destination_latitude, this.trip.destination_longitude), { icon: red_icon });
      this.map.addObject(this.destination_marker);
    } else {
      if (this.destination_marker) {
        this.map.removeObject(this.destination_marker);
      }
    }
  }

  async openChat() {
    const modal = await this.utils.showModal('ChatPage', { trip_id: this.trip.id });
    
    modal.onWillDismiss().then(() => {
      this['has_message'] = false;
    });
  }

  private calcCrow(lat1, lon1, lat2, lon2) {
    let R = 6371; // km
    let dLat = this.toRad(lat2 - lat1);
    let dLon = this.toRad(lon2 - lon1);
    lat1 = this.toRad(lat1);
    lat2 = this.toRad(lat2);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return (d * 2.5).toFixed(0);
  }

  private toRad(value) {
    return value * Math.PI / 180;
  }
}
