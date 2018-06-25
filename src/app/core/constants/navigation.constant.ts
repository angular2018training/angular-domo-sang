export const PAGE_URL = {
  COMMON: {
    USER_DETAIL: '/user-detail',
    RESET_PASSOWRD: '/reset-password',
    UPDATE_PASSWORD: '/update-password' 
  },
  // USER: {
  //   FACILITY: '/facility',
  //   FACILITY_DETAIL: '/facility/detail',
  //   // REPAIR_PLAN_DETAIL: '/facility/repair-plan',
  //  },
  // ADMIN_CLIENT: {
  //   DATA_DEFINITION: '/data-definition',
  //   USER_MANAGEMENT: '/user-management',
  //   GROUP_MANAGEMENT: '/group-management',
  //   CONFIGURATION: '/client-configuration',
  // },
  ADMIN_SYSTEM: {
    PROJECTS_MANAGEMENT: '/projects-management',
    CLIENT_MANAGEMENT: '/client-management',
    ADMINISTRATOR_MANAGEMENT: '/administrator',
    USER_MANAGEMENT: '/user-management',
    CONFIGURATION: '/system-configuration',
    BUIDLING_MANAGEMENT: '/client-management/buildings',
    SETUP_SENSOR_PLACEMENT: '/setup-sensor-placement',
    OTHER_DATA: '/client-management/other-data',
    // DASH_BOARD_MANAGEMENT: '/dash-board-management',
    DASHBOARDS_MANAGEMENT:'/dashboards-management',

    ADD_CLIENT: '/client-management/add',
    ADD_PROJECT: '/projects-management/add',
    ADD_ADMIN:'/administrator/add',
    ADD_USER: '/user-management/add',
    TENANT_MANAGEMENT: '/tenant-management',
    TENANT_DETAIL: '/tenant-management/tenant-detail',
    ADD_TENANT: '/tenant-management/add',
    CLIENT_MANAGEMENT_CREATE: '/client-management/client-create',
    CLIENT_MANAGEMENT_DETAIL: '/client-management/client-detail',
    DASHBOARDS_MANAGEMENT_CREATE: '/dashboards-management/create',
    DASHBOARDS_MANAGEMENT_EDIT: '/dashboards-management/edit'
  }
}

export const MENU = {
  ADMIN_SYSTEM: [
    {
      "id": "10",
      "tagLabel": "tags.clientManagement",
      "url": PAGE_URL.ADMIN_SYSTEM.CLIENT_MANAGEMENT,
      "type": "page",
      'screenId': 'SC401-SC402'
    },
    {
      "id": "25",
      "tagLabel": "tags.tenantManagement",
      "url": PAGE_URL.ADMIN_SYSTEM.TENANT_MANAGEMENT,
      "type": "page",
      'screenId': 'SC403'
    },
    {
      "id": "50",
      "tagLabel": "tags.configuration",
      "url": PAGE_URL.ADMIN_SYSTEM.CONFIGURATION,
      "type": "page",
      'screenId': 'SC405'
    },
  ],

  CONSULTANT: [
    {
      "id": "1",
      "tagLabel": "tags.projectsManagement",
      "url": PAGE_URL.ADMIN_SYSTEM.PROJECTS_MANAGEMENT,
      "type": "page",
      'screenId': 'SC002'
    },
	  {
      "id": "30",
      "tagLabel": "tags.dashboardsManagement",
      "url": PAGE_URL.ADMIN_SYSTEM.DASHBOARDS_MANAGEMENT,
      "type": "page",
      'screenId': 'SC601-SC603'
    }
  ],
}

export const MENU_MAPPING = {
  TITLE_TAG: {
    /* parent menu */
    [PAGE_URL.ADMIN_SYSTEM.PROJECTS_MANAGEMENT]: "tags.projectsManagement",
    [PAGE_URL.ADMIN_SYSTEM.CLIENT_MANAGEMENT]: "tags.clientManagement",
    [PAGE_URL.ADMIN_SYSTEM.CONFIGURATION]: "tags.configuration",
    [PAGE_URL.ADMIN_SYSTEM.ADMINISTRATOR_MANAGEMENT]: "tags.adminManagement",
    [PAGE_URL.ADMIN_SYSTEM.BUIDLING_MANAGEMENT]: "tags.buildingManagement",
    [PAGE_URL.ADMIN_SYSTEM.OTHER_DATA]: "tags.otherData",
    [PAGE_URL.ADMIN_SYSTEM.DASHBOARDS_MANAGEMENT]: "tags.dashboardsManagement",
    [PAGE_URL.ADMIN_SYSTEM.TENANT_MANAGEMENT]: "tags.partners",
    [PAGE_URL.ADMIN_SYSTEM.SETUP_SENSOR_PLACEMENT]: "tags.setupSensorPlacement",
    /* chiller menu */
    [PAGE_URL.ADMIN_SYSTEM.ADD_CLIENT]: "tags.clientDetail.addClient",
    [PAGE_URL.ADMIN_SYSTEM.ADD_PROJECT]: "tags.projectAdd.addProject",
    [PAGE_URL.ADMIN_SYSTEM.ADD_ADMIN]: "tags.adminAdd.addAdmin",
    [PAGE_URL.ADMIN_SYSTEM.ADD_USER]: "tags.userAdd.addUser",
    [PAGE_URL.COMMON.USER_DETAIL]: "tags.userDetail",
    [PAGE_URL.ADMIN_SYSTEM.ADD_CLIENT]: "tags.adminClient.addClient",
    [PAGE_URL.ADMIN_SYSTEM.ADD_TENANT]: "tags.partners.createNewPartner",
    [PAGE_URL.ADMIN_SYSTEM.TENANT_DETAIL]: "tags.partners.partnerDetail",
    [PAGE_URL.ADMIN_SYSTEM.CLIENT_MANAGEMENT_CREATE]: "tags.clientManagement.create",
    [PAGE_URL.ADMIN_SYSTEM.CLIENT_MANAGEMENT_DETAIL]: "tags.clientManagement.clientDetail",
    [PAGE_URL.ADMIN_SYSTEM.DASHBOARDS_MANAGEMENT_CREATE]: "tags.dashboardsManagement.createNewDashboard",
    [PAGE_URL.ADMIN_SYSTEM.DASHBOARDS_MANAGEMENT_EDIT]: "tags.dashboardsManagement.editDashboard",

  },
  PARENT: {
    [PAGE_URL.ADMIN_SYSTEM.PROJECTS_MANAGEMENT]: PAGE_URL.ADMIN_SYSTEM.PROJECTS_MANAGEMENT,
    [PAGE_URL.ADMIN_SYSTEM.CLIENT_MANAGEMENT]: PAGE_URL.ADMIN_SYSTEM.CLIENT_MANAGEMENT,
    [PAGE_URL.ADMIN_SYSTEM.TENANT_MANAGEMENT]: PAGE_URL.ADMIN_SYSTEM.TENANT_MANAGEMENT,
  },
  REGEX_TITLE: {
   
  },
  HIDE_TITLE: {
    
  },
  HIDE_REGEX_TITLE: {
    
  }
}