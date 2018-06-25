import { Injectable } from '@angular/core';
import { CommonService } from "../../shared/services/common.service";
import { API_CONFIGURATION } from "../../core/constants/server.constant";

@Injectable()
export class ProjectsManagementService extends CommonService{

  projectInfo = {
    floorId: null,
    timeFrom: null,
    timeTo: null,
    buildingId: null,
    clientId: null
  };

  getClientById(params): Promise<any> {
    return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.CLIENT + params, null));
  }
  getProjectById(params): Promise<any> {
    return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.PROJECT + params, null, null));
  }
  getAllProject(params): Promise<any> {
    return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.PROJECT, null, null));
  }
  deleteProject(params): Promise<any> {
    return this.handleRequest(() => this.deleteRequest(API_CONFIGURATION.URLS.STANDARD.PROJECT + params, null));
  }
  getAllClient(): Promise<any> {
    return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.CLIENT, null, null));
  }

  getPublishClient(params): Promise<any> {
    return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.CLIENT, params, null));
  }

  getBuildingByClientId(params): Promise<any> {
    return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.BUILDING, params, null));
  }
  getFloorByBuildingId(params): Promise<any> {
    return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.FLOOR , params, null));
  }
  createProject(body): Promise<any> {
    return this.handleRequest(() => this.postRequest(API_CONFIGURATION.URLS.STANDARD.PROJECT, body, this.getHeaderFormData()));
  }
  editProject(body): Promise<any> {
    return this.handleRequest(() => this.putRequest(API_CONFIGURATION.URLS.STANDARD.PROJECT, body, this.getHeaderFormData()));
  }
}
