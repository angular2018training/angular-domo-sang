import { Injectable } from "@angular/core";
import { CommonService } from "../../shared/services/common.service";
import { API_CONFIGURATION } from "../../core/constants/server.constant";

@Injectable()
export class UserDetailService extends CommonService {

    getUser(): Promise<any> {
        return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.COMMON.GET_USER_INFOR, null, null));
      }
    editUser(body): Promise<any> {
        return this.handleRequest(() => this.postRequest(API_CONFIGURATION.URLS.STANDARD.COMMON.EDIT_USER_INFOR, body, null));
    }
    changePasswordUser(body): Promise<any> {
        return this.handleRequest(() => this.postRequest(API_CONFIGURATION.URLS.STANDARD.COMMON.CHANGE_PASSWORD_USER, body, null));
    }
}
