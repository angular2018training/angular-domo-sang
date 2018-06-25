import { Injectable } from '@angular/core';
import { CommonService } from "../../../../shared/services/common.service";
import { API_CONFIGURATION } from "../../../../core/constants/server.constant";

@Injectable()
export class ProjectDashBoardService extends CommonService{
  getProjectById(params): Promise<any> {
    return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.PROJECT + params, null, null));
  }
}
