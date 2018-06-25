import { Injectable } from "@angular/core";
import { CommonService } from "../../shared/services/common.service";
import { API_CONFIGURATION } from "../../core/constants/server.constant";

@Injectable()
export class SetupSensorPlacementService extends CommonService {
  getSensorsPlace(id, params): Promise<any> {
    return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.FLOOR + id, params, null));
  }
  saveSensorLayout(body): Promise<any> {
    return this.handleRequest(() => this.putRequest(API_CONFIGURATION.URLS.STANDARD.SENSOR, body, null));
  }
  changeLayout(body): Promise<any> {
    return this.handleRequest(() => this.postRequest(API_CONFIGURATION.URLS.STANDARD.FLOOR + 'register-image/', body, this.getHeaderFormData()));
  }
}
