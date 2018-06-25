import { Injectable } from "@angular/core";
import { CommonService } from "../../shared/services/common.service";
import { API_CONFIGURATION } from "../../core/constants/server.constant";

@Injectable()
export class AdminService extends CommonService {
    saveUser(body): Promise<any> {
	return this.handleRequest(() => this.postRequest(API_CONFIGURATION.URLS.STANDARD.USER, body, null));
    }
      
    createUser(body): Promise<any> {
        return this.handleRequest(() => this.postRequest(API_CONFIGURATION.URLS.STANDARD.USER, body, null));
    }
}
