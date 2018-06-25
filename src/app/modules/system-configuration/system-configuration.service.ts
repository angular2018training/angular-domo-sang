import { Injectable } from "@angular/core";
import { CommonService } from "../../shared/services/common.service";
import { API_CONFIGURATION } from "../../core/constants/server.constant";
import { Strings } from "../../core/services/utilities.service";
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Subject } from "rxjs/Subject";

@Injectable()
export class SystemConfigurationService extends CommonService {
    getAllData(): Promise<any> {
        return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.SYSTEM_CONFIGURATION, null, null));
    }
    getDataShowlog(): Promise<any> {
        return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.SYSTEM_CONFIGURATION, null, null));
    }
    updateData(body): Promise<any> {
        return this.handleRequest(() => this.putRequest(API_CONFIGURATION.URLS.STANDARD.SYSTEM_CONFIGURATION, body, null));
    }
    testData(body): Promise<any> {
        return this.handleRequest(() => this.postRequest(API_CONFIGURATION.URLS.STANDARD.SYSTEM_CONFIGURATION_TEST_ACCOUNT, body, null));
    }
}
