import { Injectable } from "@angular/core";
import { CommonService } from "../../shared/services/common.service";
import { API_CONFIGURATION } from "../../core/constants/server.constant";

@Injectable()
export class ResetPasswordService extends CommonService {
    sendEmail(body): Promise<any> {
        return this.handleRequest(() => this.postRequest(API_CONFIGURATION.URLS.STANDARD.COMMON.RESET_PASSWORD_USER, body, null));
    }
}