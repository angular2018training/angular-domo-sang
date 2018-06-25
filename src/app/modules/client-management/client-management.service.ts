import { Injectable } from "@angular/core";
import { CommonService } from "../../shared/services/common.service";
import { API_CONFIGURATION } from "../../core/constants/server.constant";

@Injectable()
export class ClientService extends CommonService {
  
      getAllClient(): Promise<any> {
        return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.CLIENT));
      }
      getClientById(params): Promise<any> {
        return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.CLIENT + params, null));
      }
      createClient(body): Promise<any> {
        return this.handleRequest(() => this.postRequest(API_CONFIGURATION.URLS.STANDARD.CLIENT, body, null));
      }
      saveClient(body): Promise<any> {
        return this.handleRequest(() => this.postRequest(API_CONFIGURATION.URLS.STANDARD.CLIENT, body, null));
      }
      updateClient(body): Promise<any> {
        return this.handleRequest(() => this.putRequest(API_CONFIGURATION.URLS.STANDARD.CLIENT, body, null));
      }
      deleteClient(params): Promise<any> {
        return this.handleRequest(() => this.deleteRequest(API_CONFIGURATION.URLS.STANDARD.CLIENT + params, null));
      }

      getCountry(): Promise<any> {
        return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.COUNTRY, null, null));
      }

      getTenantList(): Promise<any> {
        return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.ADMIN.TENANT_MANAGEMENT, null));
      }

      getTenantListSize(params): Promise<any> {
        return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.ADMIN.TENANT_MANAGEMENT_SIZE + params, null));
      }

      getIndustryType(): Promise<any> {
        return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.INDUSTRY, null));
      }

       getEnterprise(): Promise<any> {
        return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.ENTERPRISE, null));
      }
}
