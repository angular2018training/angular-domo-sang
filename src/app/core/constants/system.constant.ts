import { environment } from '../../../environments/environment';
export const SYSTEM = {
  ACCOUNT: 'wps-login-account',
  USER: 'wps-user',
  LANGUAGE: 'wps-language',
  SECRET_KEY: 'wps-secret-key',
  TOKEN: 'token',
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refresh-token',
  INVALID_TOKEN: 'invalid_token',
  EXPIRED_TOKEN: 'error.token.expired',
  TENNANT_ID: 'tenant-id',
  LOGIN_USER_INFO: 'login-user-info',
  LOGGED_USER_INFO: 'logged-user-info',
  DISPLAY_DATE: 'YYYY/MM/DD',
  DISPLAY_DATE_TIME: 'YYYY/MM/DD HH:mm:ss',
  COMM_DATE: 'YYYYMMDD',
  COMM_DATE_TIME: 'YYYY-MM-DDTHH:mm:ssZ',
  PAGE_SIZES: [25, 50, 75, 100],
  MAX_REPAIR_PLAN_PER_FACILITY: 100,
  TENANT_ID: 'wps-tenant-id',
  ROLES: {
    ADMIN: 1,
    CONSULTANT: 2,
    SUPER_CONSULTANT: 3
  }
}

export const TAGS = [
  'tags.userManagement.email',
  'tags.userManagement.name',
  'tags.userManagement.status',
  'tags.userManagement.role',
  'tags.userManagement.lastLogin',
  'tags.userManagement.createdDate',
  'tags.userManagement.id',
  'tags.userManagement.fullname',
  'tags.userManagement.username',
  'tags.userManagement.groupAuth',

  'tags.clientManagement',  
  'tags.clientManagement.id',
  'tags.clientManagement.clientName',
  'tags.clientManagement.partnerName',
  'tags.clientManagement.address',
  'tags.clientManagement.province',
  'tags.clientManagement.country',
  'tags.clientManagement.phone',
  'tags.clientManagement.email',
  'tags.clientManagement.enterpriseType',
  'tags.clientManagement.industryType',
  'tags.clientManagement.create',
  'tags.clientManagement.clientDetail',

  'tags.workForceData.fileName',
  'tags.workForceData.uploadedBy',
  'tags.workForceData.uploadedDate',

  'tags.buildingManagement',
  'tags.otherData',

  'tags.projectsManagement',
  'tags.projectsManagement.reportingName',
  'tags.projectsManagement.targetClient',
  'tags.projectsManagement.targetBuilding',
  'tags.projectsManagement.targetFloor',

  'tags.setupSensorPlacement.information',
  'tags.setupSensorPlacement.change',
  'tags.setupSensorPlacement.delete',

  'tags.tenantManagement',
  'tags.tenantManagement.tenantID',
  'tags.tenantManagement.tenantName',
  'tags.tenantManagement.tenantAddress',
  'tags.tenantManagement.tenantEmail',
  'tags.tenantManagement.createdDate',
  'tags.partners',
  'tags.partners.partnerDetail',
  'tags.partners.createNewPartner',

  'tags.groupManagement.id',
  'tags.groupManagement.name',
  'tags.groupManagement.authority',

  'tags.configuration',
  'tags.dashboardsManagement',
  'tags.dashboardsManagement.createNewDashboard',
  'tags.dashboardsManagement.editDashboard',
]

export const USER_AUTHORITY = {
  DENY: { name: 'Deny', value: 'DENY' },
  READ: { name: 'Read Only', value: 'READ' },
  READ_WRITE: { name: 'Read & Write', value: 'READ_WRITE' },
}

export const ROLE = {
  TENANT_USER: 'TENANT_USER',
  TENANT_ADMIN: 'TENANT_ADMIN',
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  TEMPORARY: 'TEMPORARY'
}

export const LOGGER = {
  prod: environment.production,
  log: function (...args: any[]) { !LOGGER.prod && console.log(args.join(' | ')) },
  info: function (...args: any[]) { !LOGGER.prod && console.info(args.join(' | ')) },
  trace: function (...args: any[]) { !LOGGER.prod && console.trace(args.join(' | ')) },
  error: function (...args: any[]) { !LOGGER.prod && console.error(args.join(' | ')) }
}

export const PATTERNS = {
  VALIDATE_LEADING_SPACE: /^[^\s]+[a-zA-Z0-9\s]*$/,
  VALIDATE_EMAIL: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;-\s@\"]+\.{0,1})+[^<>()\.,;:\s@\"]{2,})\.[a-z]{2,}$/
};
