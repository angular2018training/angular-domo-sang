import { Injectable } from "@angular/core";
import { CommonService } from "../../shared/services/common.service";
import { API_CONFIGURATION } from "../../core/constants/server.constant";
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';

@Injectable()
export class LoginService extends CommonService {
  public loginSystem(body): Promise<any> {
    return this.handleRequest(() => this.getNewToken(body));
  }

  public getUserInfo(): Promise<any> {
    return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.COMMON.USER_INFO, null, null));
  }

  public checkTenant(params): Promise<any> {
    let headers = new Headers();
    headers.append('Accept', 'application/json, text/plain, */*');
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    // headers.append('TenantId', tenantId);

    return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.ADMIN.CHECK_TENANT, headers, params));
  }
}