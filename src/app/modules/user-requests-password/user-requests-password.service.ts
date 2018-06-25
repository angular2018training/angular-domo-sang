import { Injectable } from '@angular/core';
import { CommonService } from "../../shared/services/common.service";
import { API_CONFIGURATION } from "../../core/constants/server.constant";

@Injectable()
export class UserRequestsPasswordService extends CommonService{
  sendUserInfo(body): Promise<any> {
    return this.handleRequest(() => this.postRequest(API_CONFIGURATION.URLS.STANDARD.COMMON.USER_REQUEST_PASSWORD, body, null));
}
}
