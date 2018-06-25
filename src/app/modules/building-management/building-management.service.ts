import { Injectable } from "@angular/core";
import { CommonService } from "../../shared/services/common.service";
import { API_CONFIGURATION } from "../../core/constants/server.constant";

@Injectable()
export class BuildingManagementService extends CommonService {

  publishClientStatus;
  getBuildingByClientId(params): Promise<any> {
    return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.BUILDING, params, null));
  }
  getBuildingById(id, params): Promise<any> {
    return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.BUILDING + id, params, null));
  }
  createBuilding(body): Promise<any> {
    return this.handleRequest(() => this.postRequest(API_CONFIGURATION.URLS.STANDARD.BUILDING, body, this.getHeaderFormData()));
  }
  updateBuilding(body): Promise<any> {
    return this.handleRequest(() => this.postRequest(API_CONFIGURATION.URLS.STANDARD.BUILDING, body, this.getHeaderFormData()));
  }
  deleteBuilding(id, params): Promise<any> {
    return this.handleRequest(() => this.deleteRequest(API_CONFIGURATION.URLS.STANDARD.BUILDING + id, params, null));
  }
  uploadFloor(id, body): Promise<any> {
    return this.handleRequest(() => this.postRequest(API_CONFIGURATION.URLS.STANDARD.BUILDING + 'upload-floor/' + id, body, this.getHeaderFormData()));
  }
  deleteFloor(id, params): Promise<any> {
    return this.handleRequest(() => this.deleteRequest(API_CONFIGURATION.URLS.STANDARD.FLOOR + id, params, null));
  }
  getFloorById(id, params): Promise<any> {
    return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.FLOOR + id, params, null));
  }
  updateFloor(body): Promise<any> {
    return this.handleRequest(() => this.putRequest(API_CONFIGURATION.URLS.STANDARD.FLOOR, body, null));
  }
  uploadLocation(id, body): Promise<any> {
    return this.handleRequest(() => this.postRequest(API_CONFIGURATION.URLS.STANDARD.FLOOR + 'upload-location/' + id, body, this.getHeaderFormData()));
  }
  uploadSensor(id, body): Promise<any> {
    return this.handleRequest(() => this.postRequest(API_CONFIGURATION.URLS.STANDARD.FLOOR + 'upload-sensor/' + id, body, this.getHeaderFormData()));
  }
  deleteAllLocation(id): Promise<any> {
    return this.handleRequest(() => this.deleteRequest(API_CONFIGURATION.URLS.STANDARD.FLOOR + 'delete-location/' + id, null, null));
  }
  deleteAllSensor(id): Promise<any> {
    return this.handleRequest(() => this.deleteRequest(API_CONFIGURATION.URLS.STANDARD.FLOOR + 'delete-sensor/' + id, null, null));
  }
  getLocations(id, params): Promise<any> {
    return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.FLOOR + 'view-location/' + id, params, null));
  }
  getSensors(id, params): Promise<any> {
    return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.FLOOR + 'view-sensor/' + id, params, null));
  }

  getTimeZones(): Promise<any> {
    return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.TIMEZONES, null, null));
  }
  getSensorsPlace(id, params): Promise<any> {
    return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.FLOOR + id, params, null));
  }


  createWorkForceData(id, body): Promise<any> {
    return this.handleRequest(() => this.postRequest(API_CONFIGURATION.URLS.STANDARD.WORKFORCEDATA.UPLOAD_FILE + id + '/workforce-data/parse', body, this.getHeaderFormData()));
  }
  getAllWorkForceData(id): Promise<any> {
    return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.WORKFORCEDATA.UPLOAD_FILE + id + '/workforce-files', null));
  }
  deleteWorkForceData(id): Promise<any> {
    return this.handleRequest(() => this.deleteRequest(API_CONFIGURATION.URLS.STANDARD.WORKFORCE_DATA + 'workforce-file/' + id, null));
  }
  downloadWorkForceData(id): Promise<any> {
    return this.handleRequest(() => this.downloadRequest(API_CONFIGURATION.URLS.STANDARD.WORKFORCE_DATA + 'workforce-file/' + id));
  }

  createIpMapping(id, body): Promise<any> {
    return this.handleRequest(() => this.postRequest(API_CONFIGURATION.URLS.STANDARD.WORKFORCEDATA.UPLOAD_FILE + id + '/ip-mapping-file/parse', body, this.getHeaderFormData()));
  }
  getAllMappingData(id): Promise<any> {
    return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.WORKFORCEDATA.UPLOAD_FILE + id + '/id-mapping-files', null));
  }
  deleteIpMapping(id): Promise<any> {
    return this.handleRequest(() => this.deleteRequest(API_CONFIGURATION.URLS.STANDARD.WORKFORCE_DATA + 'id-mapping-file/' + id, null));
  }
  downloadIpMapping(id): Promise<any> {
    return this.handleRequest(() => this.downloadRequest(API_CONFIGURATION.URLS.STANDARD.WORKFORCE_DATA + 'id-mapping-file/' + id));
  }

  createBookingData(id, body): Promise<any> {
    return this.handleRequest(() => this.postRequest(API_CONFIGURATION.URLS.STANDARD.WORKFORCEDATA.UPLOAD_FILE + id + '/booking-file/parse', body, this.getHeaderFormData()));
  }
  getAllBookingData(id): Promise<any> {
    return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.WORKFORCEDATA.UPLOAD_FILE + id + '/booking-files', null));
  }
  deleteBookingData(id): Promise<any> {
    return this.handleRequest(() => this.deleteRequest(API_CONFIGURATION.URLS.STANDARD.WORKFORCE_DATA + 'booking-file/' + id, null));
  }
  downloadBookingData(id): Promise<any> {
    return this.handleRequest(() => this.downloadRequest(API_CONFIGURATION.URLS.STANDARD.WORKFORCE_DATA + 'booking-file/' + id));
  }

  publishClient(id): Promise<any> {
    return this.handleRequest(() => this.putRequest(API_CONFIGURATION.URLS.STANDARD.CLIENT + 'publish/'+ id  ,null));
  }

  unpublishClient(id): Promise<any> {
    return this.handleRequest(() => this.putRequest(API_CONFIGURATION.URLS.STANDARD.CLIENT + 'unpublish/'+ id  ,null));
  }
}
