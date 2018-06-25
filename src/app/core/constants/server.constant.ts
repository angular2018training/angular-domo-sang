import { environment } from '../../../environments/environment';

export class API_CONFIGURATION {
  private static SERVER = environment.serverName;
  private static PROJECT_NAME_API = 'api/';
  private static SERVER_WITH_API_ADMIN = API_CONFIGURATION.SERVER + API_CONFIGURATION.PROJECT_NAME_API;
  private static SERVER_WITH_API_STANDARD = API_CONFIGURATION.SERVER_WITH_API_ADMIN;
  private static SERVER_API = API_CONFIGURATION.SERVER_WITH_API_ADMIN;
  
  public static URLS = {
    ADMIN: {
      NORMAL_LOGIN: API_CONFIGURATION.SERVER_WITH_API_ADMIN + 'authenticate',
      SYSTEM_LOGIN: API_CONFIGURATION.SERVER_WITH_API_ADMIN + 'authenticate',
      LOGOUT: API_CONFIGURATION.SERVER_API + 'logout',
      TENANT_MANAGEMENT: API_CONFIGURATION.SERVER_API + 'tenants/',
      CHECK_TENANT: API_CONFIGURATION.SERVER_API + 'tenants/checkTenant',
      LOAD_USER_INFO: API_CONFIGURATION.SERVER_API + 'users/loadUser',
      GET_USER_INFO: API_CONFIGURATION.SERVER_API + 'users/me',
      SAML_LOGIN: API_CONFIGURATION.SERVER_API + 'saml/login',
      SAML_LOGOUT: API_CONFIGURATION.SERVER_API + 'saml/logout',
      UPDATE_USER_INFO: API_CONFIGURATION.SERVER_API + 'users/me',
      TENANT_MANAGEMENT_SIZE: API_CONFIGURATION.SERVER_API + 'tenants?size=',
      TENANT_MANAGEMENT_CREATE: API_CONFIGURATION.SERVER_API + 'tenants/users',
    },
    STANDARD: {
      DATA_DEFINITION: API_CONFIGURATION.SERVER_WITH_API_STANDARD + 'data-definition',
      DATA_DEFINITION_EXPORT: API_CONFIGURATION.SERVER_WITH_API_STANDARD + 'data-definition/export',
      BUILDING: API_CONFIGURATION.SERVER_WITH_API_ADMIN + 'buildings/',
      FLOOR: API_CONFIGURATION.SERVER_WITH_API_ADMIN + 'floors/',
      SENSOR: API_CONFIGURATION.SERVER_WITH_API_ADMIN + 'sensors/',
      TIMEZONES: API_CONFIGURATION.SERVER_WITH_API_ADMIN + 'timezones/',
      CLIENT: API_CONFIGURATION.SERVER_WITH_API_ADMIN + 'clients/',
      PUBLISH_CLIENT: API_CONFIGURATION.SERVER_WITH_API_ADMIN + 'clients/publish',
      PROJECT: API_CONFIGURATION.SERVER_WITH_API_ADMIN + 'projects/',
      USER_TENANT: API_CONFIGURATION.SERVER_WITH_API_ADMIN + 'users/tenant/',
      USER: API_CONFIGURATION.SERVER_WITH_API_ADMIN + 'users/',
      COUNTRY:API_CONFIGURATION.SERVER_WITH_API_ADMIN + 'countries/',
      PROVINCES:API_CONFIGURATION.SERVER_WITH_API_ADMIN + 'provinces/countries/',
      USER_CHANGEPASSWORD: API_CONFIGURATION.SERVER_WITH_API_ADMIN + 'users/change-password',
      SYSTEM_CONFIGURATION: API_CONFIGURATION.SERVER_WITH_API_ADMIN + 'system-configurations/',
      SYSTEM_CONFIGURATION_TEST_ACCOUNT: API_CONFIGURATION.SERVER_WITH_API_ADMIN + 'system-configurations/',

      INDUSTRY: API_CONFIGURATION.SERVER_WITH_API_ADMIN + 'industries',
      ENTERPRISE: API_CONFIGURATION.SERVER_WITH_API_ADMIN + 'enterprise',
      SYSTEM_CONFIGURATION_SHOWLOG: API_CONFIGURATION.SERVER_WITH_API_ADMIN + 'system-logs/',
      WORKFORCE_DATA: API_CONFIGURATION.SERVER_WITH_API_ADMIN,
      WORKFORCEDATA : {
        UPLOAD_FILE: API_CONFIGURATION.SERVER_WITH_API_ADMIN + 'client/'
      },
      COMMON: {
        LOGIN: API_CONFIGURATION.SERVER_WITH_API_ADMIN + 'authenticate', // POST
        USER_INFO: API_CONFIGURATION.SERVER_WITH_API_ADMIN + 'account', // GET
        GET_USER_INFOR: API_CONFIGURATION.SERVER_WITH_API_STANDARD + 'account', //GET
        EDIT_USER_INFOR: API_CONFIGURATION.SERVER_WITH_API_STANDARD + 'account', // PUT
        CHANGE_PASSWORD_USER: API_CONFIGURATION.SERVER_WITH_API_STANDARD + 'account/change-password', // POST
        RESET_PASSWORD_USER: API_CONFIGURATION.SERVER_WITH_API_STANDARD + 'account/reset-password/init',
        USER_REQUEST_PASSWORD: API_CONFIGURATION.SERVER_WITH_API_STANDARD + 'account/reset-password/finish',
        CHANGE_PASSWORD: API_CONFIGURATION.SERVER_WITH_API_STANDARD + 'user/change-password' // 
      } 
    },
    CHART: {
      CH001: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH002: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH003: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH004: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH005: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH006: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH007: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH008: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH009: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH010: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH011: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH012: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH013: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH014: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH015: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH016: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH017: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH018: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH019: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH020: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH021: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH022: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH023: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH024: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH025: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH026: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH027: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH028: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH901: API_CONFIGURATION.SERVER_API + 'charts/get',//API_CONFIGURATION.SERVER_API + 'charts/get',
      CH902: API_CONFIGURATION.SERVER_API + 'charts/get',
      CH903: API_CONFIGURATION.SERVER_API + 'charts/get',
    }
  }
}

export const MESSAGE = {
  MSG001: 'messages.MSG001',
  MSG002: 'messages.MSG002',
  MSG003: 'messages.MSG003',
  MSG004: 'messages.MSG004',
  MSG005: 'messages.MSG005'
}
export const ERROR_MESSAGE = {
  404: 'error.http.service.unavailable',
  500: 'error.http.service.unavailable',
  503: 'error.http.service.unavailable',
  504: 'error.http.service.unavailable',
  12: 'error.http.service.unavailable'
}

export const LOCK_UI_MESSAGES = ["error.bad.credentials","error.locked.user","error.user.not.exist.in.afm.system", "error.can.not.connect.to.idp.server", "error.process.import.file.missing.header","error.process.import.cell.is.empty","error.process.import.facility.is.not.match.with.selected","error.process.import.cell.is.over.size","error.process.import.cell.not.initialize","error.process.import.cell.is.wrong.format","error.process.import.cell.is.not.empty","error.process.import.file","error.process.import.file.reason","error.delete.data.constrain","error.value.wrong.format","error.import.data.not.exist","error.value.out.range","error.import.data.constrain","error.duplicate.entity","error.general.delete","error.general.save", "error.set.value.is.over.size", "error.process.import.cell.is.negative.number", "error.general", "error.import.cell.format", "error.import.entity.duplicate", "error.import.definition.not.exist", "error.import.file.header", "error.import.cell.empty", "error.import.value.out.of.range", "error.import.file", "error.import.group.not.exist", "error.import.file.excel", "error.import.entity.not.exist", "error.import.delete.constrain", "error.facility.not.existed","error.import.exceed.records", "error.exceed.max.record.per.facility", "error.import.file.size", "error.exceed.max.record", "error.import.general", "error.plan.not.found", "error.entity.not.exist", "error.chart.common", "error.exceed.max.record", "error.manual.correction.over", "error.plan.out.of.date", "error.import.values.maximum.number", "error.import.no.record", "error.import.update.not.allow", "error.import.facility.is.not.match", "error.import.part.cell", "error.http.service.unavailable"];