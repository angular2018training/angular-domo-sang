import { Injectable } from "@angular/core";
import { CommonService } from "../../shared/services/common.service";
import { API_CONFIGURATION } from "../../core/constants/server.constant";

@Injectable()
export class TenantManagementService extends CommonService {

      tenantInfo;

      getTenantList(params): Promise<any> {
        return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.ADMIN.TENANT_MANAGEMENT, params, null));
      }
    
      getAllTenant(params): Promise<any> {
        return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.ADMIN.TENANT_MANAGEMENT, params, null));
      }
    
      getTenantById(id): Promise<any> {
        return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.ADMIN.TENANT_MANAGEMENT + id, null));
      }
      createTenant(body): Promise<any> {
        return this.handleRequest(() => this.postRequest(API_CONFIGURATION.URLS.ADMIN.TENANT_MANAGEMENT_CREATE, body, this.getHeaderFormData()));
      }
      updateTenant(body): Promise<any> {
        return this.handleRequest(() => this.putRequest(API_CONFIGURATION.URLS.ADMIN.TENANT_MANAGEMENT, body, null));
      }
      deleteTenant(id): Promise<any> {
        return this.handleRequest(() => this.deleteRequest(API_CONFIGURATION.URLS.ADMIN.TENANT_MANAGEMENT + id, null));
      }

      getCountryTenant(): Promise<any> {
        return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.COUNTRY , null, null));
      }

      getUserByTenantId(params): Promise<any> {
        return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.USER_TENANT + params, null, null));
      }

      getProvinceByIdCountry(id): Promise<any> {
        return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.PROVINCES + id, null));
      }
    
    
    
      getAllUser(params): Promise<any> {
        return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.USER_TENANT, params, null));
      }
    
      getUserById(params): Promise<any> {
        return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.USER_TENANT, params, null));
      }
      createUser(body): Promise<any> {
        return this.handleRequest(() => this.postRequest(API_CONFIGURATION.URLS.STANDARD.USER, body, this.getHeaderFormData()));
      }
      updateUser(body): Promise<any> {
        return this.handleRequest(() => this.putRequest(API_CONFIGURATION.URLS.STANDARD.USER, body, null));
      }
      updatePassword(body): Promise<any> {
        return this.handleRequest(() => this.putRequest(API_CONFIGURATION.URLS.STANDARD.USER_CHANGEPASSWORD, body, null));
      }
      deleteUser(id): Promise<any> {
        return this.handleRequest(() => this.deleteRequest(API_CONFIGURATION.URLS.STANDARD.USER+ id, null));
      }
    
      viewUser(id): Promise<any> {
        return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.USER_TENANT + id, null));
      }
      viewUserById(id): Promise<any> {
        return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.STANDARD.USER+ id, null));
      }
      
      getTenantListSize(params): Promise<any> {
        return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.ADMIN.TENANT_MANAGEMENT_SIZE + params, null));
      }
  
}
