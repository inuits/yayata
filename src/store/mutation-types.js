// OAUTH2
export const OAUTH2_CONFIGURE = 'OAUTH2/CONFIGURE';
export const OAUTH2_SET_TOKEN = 'OAUTH2/SET_TOKEN';
export const OAUTH2_SET_AUTHENTICATED = 'OAUTH2/SET_AUTHENTICATED';
export const OAUTH2_GET_TOKEN = 'OAUTH2/GET_TOKEN';
export const OAUTH2_REFRESH_TOKEN = 'OAUTH2/REFRESH_TOKEN';

// PREFERENCES
export const PREFERENCES_SET_KEY = 'PREFERENCES/SET_KEY';

// NINETOFIVER
//Mutations
export const NINETOFIVER_SET_ACTIVITY_PERFORMANCES = 'NINETOFIVER/SET_ACTIVITY_PERFORMANCES';
export const NINETOFIVER_SET_ALL_MONTHLY_ACTIVITY_PERFORMANCES = 'NINETOFIVER/SET_ALL_MONTHLY_ACTIVITY_PERFORMANCES';
export const NINETOFIVER_SET_ATTACHMENTS = 'NINETOFIVER/SET_ATTACHMENTS';
export const NINETOFIVER_SET_STANDBY_PERFORMANCES = 'NINETOFIVER/SET_STANDBY_PERFORMANCES';
export const NINETOFIVER_SET_COMPANIES = 'NINETOFIVER/SET_COMPANIES';
export const NINETOFIVER_SET_CONTRACT_GROUPS = 'NINETOFIVER/SET_CONTRACT_GROUPS';
export const NINETOFIVER_SET_CONTRACT_ROLES = 'NINETOFIVER/SET_CONTRACT_ROLES';
export const NINETOFIVER_SET_CONTRACT_USERS = 'NINETOFIVER/SET_CONTRACT_USERS';
export const NINETOFIVER_SET_CONTRACTS = 'NINETOFIVER/SET_CONTRACTS';
export const NINETOFIVER_SET_EMPLOYMENT_CONTRACT_TYPES = 'NINETOFIVER/SET_EMPLOYMENT_CONTRACT_TYPES';
export const NINETOFIVER_SET_EMPLOYMENT_CONTRACTS = 'NINETOFIVER/SET_EMPLOYMENT_CONTRACTS';
export const NINETOFIVER_SET_FILTERED_CONTRACTS = 'NINETOFIVER/SET_FILTERED_CONTRACTS';
export const NINETOFIVER_SET_FILTERED_USERS = 'NINETOFIVER/SET_FILTERED_USERS';
export const NINETOFIVER_SET_HOLIDAYS = 'NINETOFIVER/SET_HOLIDAYS';
export const NINETOFIVER_SET_LEAVE_TYPES = 'NINETOFIVER/SET_LEAVE_TYPES';
export const NINETOFIVER_SET_LEAVES = 'NINETOFIVER/SET_LEAVES';
export const NINETOFIVER_SET_MONTHLY_ACTIVITY_PERFORMANCES = 'NINETOFIVER/SET_MONTHLY_ACTIVITY_PERFORMANCES';
export const NINETOFIVER_SET_MONTH_INFO = 'NINETOFIVER/SET_MONTH_INFO';
export const NINETOFIVER_SET_LEAVE_OVERVIEW = 'NINETOFIVER/SET_LEAVE_OVERVIEW';
export const NINETOFIVER_SET_PERFORMANCE_TYPES = 'NINETOFIVER/SET_PERFORMANCE_TYPES';
export const NINETOFIVER_SET_PROJECT_ESTIMATES = 'NINETOFIVER/SET_PROJECT_ESTIMATES';
export const NINETOFIVER_SET_TIMESHEETS = 'NINETOFIVER/SET_TIMESHEETS';
export const NINETOFIVER_SET_UPCOMING_LEAVES = 'NINETOFIVER/SET_UPCOMING_LEAVES';
export const NINETOFIVER_SET_USER = 'NINETOFIVER/SET_USER';
export const NINETOFIVER_SET_USER_GROUPS = 'NINETOFIVER/SET_USER_GROUPS';
export const NINETOFIVER_SET_USER_WORK_SCHEDULE = 'NINETOFIVER/SET_USER_WORK_SCHEDULE';
export const NINETOFIVER_SET_USERS = 'NINETOFIVER/SET_USERS';
export const NINETOFIVER_SET_WHEREABOUTS = 'NINETOFIVER/SET_WHEREABOUTS';
export const NINETOFIVER_SET_WORK_SCHEDULES = 'NINETOFIVER/SET_WORK_SCHEDULES';
export const NINETOFIVER_SET_REDMINE_TIME_ENTRIES = 'NINETOFIVER/SET_REDMINE_TIME_ENTRIES';
export const NINETOFIVER_SET_BACKEND_BASE_URL = 'NINETOFIVER/SET_BACKEND_BASE_URL';
// Mutations: ng
export const NINETOFIVER_SET_MY_ACTIVE_CONTRACTS = 'NINETOFIVER/SET_MY_ACTIVE_CONTRACTS';
export const NINETOFIVER_SET_MY_CONTRACT_USERS = 'NINETOFIVER/SET_MY_CONTRACT_USERS';
export const NINETOFIVER_SET_MY_CURRENT_TIMESHEET = 'NINETOFIVER/SET_MY_CURRENT_TIMESHEET';
export const NINETOFIVER_SET_MY_CURRENT_MONTH_INFO = 'NINETOFIVER/SET_MY_CURRENT_MONTH_INFO';
export const NINETOFIVER_SET_MY_OPEN_TIMESHEETS = 'NINETOFIVER/SET_MY_OPEN_TIMESHEETS';
export const NINETOFIVER_SET_MY_IMPORTABLE_PERFORMANCES = 'NINETOFIVER/SET_MY_IMPORTABLE_PERFORMANCES';
export const NINETOFIVER_SET_MY_CURRENT_WORK_SCHEDULE = 'NINETOFIVER/SET_MY_CURRENT_WORK_SCHEDULE';

//Actions
export const NINETOFIVER_API_REQUEST = 'NINETOFIVER/API_REQUEST';

export const NINETOFIVER_RELOAD_ACTIVITY_PERFORMANCES = 'NINETOFIVER/RELOAD_ACTIVITY_PERFORMANCES';
export const NINETOFIVER_RELOAD_STANDBY_PERFORMANCES = 'NINETOFIVER/RELOAD_STANDBY_PERFORMANCES';
export const NINETOFIVER_RELOAD_ALL_MONTHLY_ACTIVITY_PERFORMANCES = 'NINETOFIVER/RELOAD_ALL_MONTHLY_ACTIVITY_PERFORMANCES';
export const NINETOFIVER_RELOAD_ATTACHMENTS = 'NINETOFIVER/RELOAD_ATTACHMENTS';
export const NINETOFIVER_RELOAD_COMPANIES = 'NINETOFIVER/RELOAD_COMPANIES';
export const NINETOFIVER_RELOAD_CONTRACT_GROUPS = 'NINETOFIVER/RELOAD_CONTRACT_GROUPS';
export const NINETOFIVER_RELOAD_CONTRACT_ROLES = 'NINETOFIVER/RELOAD_CONTRACT_ROLES';
export const NINETOFIVER_RELOAD_CONTRACT_USERS = 'NINETOFIVER/RELOAD_CONTRACT_USERS';
export const NINETOFIVER_RELOAD_CONTRACTS = 'NINETOFIVER/RELOAD_CONTRACTS';
export const NINETOFIVER_RELOAD_EMPLOYMENT_CONTRACT_TYPES = 'NINETOFIVER/RELOAD_EMPLOYMENT_CONTRACT_TYPES';
export const NINETOFIVER_RELOAD_EMPLOYMENT_CONTRACTS = 'NINETOFIVER/RELOAD_EMPLOYMENT_CONTRACTS';
export const NINETOFIVER_RELOAD_FILTERED_CONTRACTS = 'NINETOFIVER/RELOAD_FILTERED_CONTRACTS';
export const NINETOFIVER_RELOAD_FILTERED_USERS = 'NINETOFIVER/RELOAD_FILTERED_USERS';
export const NINETOFIVER_RELOAD_HOLIDAYS = 'NINETOFIVER/RELOAD_HOLIDAYS';
export const NINETOFIVER_RELOAD_MONTH_INFO = 'NINETOFIVER/RELOAD_MONTH_INFO';
export const NINETOFIVER_RELOAD_LEAVE_OVERVIEW = 'NINETOFIVER/RELOAD_LEAVE_OVERVIEW';
export const NINETOFIVER_RELOAD_LEAVE_TYPES = 'NINETOFIVER/RELOAD_LEAVE_TYPES';
export const NINETOFIVER_RELOAD_LEAVES = 'NINETOFIVER/RELOAD_LEAVES';
export const NINETOFIVER_RELOAD_MONTHLY_ACTIVITY_PERFORMANCES = 'NINETOFIVER/RELOAD_MONTHLY_ACTIVITY_PERFORMANCES';
export const NINETOFIVER_RELOAD_PERFORMANCE_TYPES = 'NINETOFIVER/RELOAD_PERFORMANCE_TYPES';
export const NINETOFIVER_RELOAD_PROJECT_ESTIMATES = 'NINETOFIVER/RELOAD_PROJECT_ESTIMATES';
export const NINETOFIVER_RELOAD_TIMESHEETS = 'NINETOFIVER/RELOAD_TIMESHEETS';
export const NINETOFIVER_RELOAD_UPCOMING_LEAVES = 'NINETOFIVER/RELOAD_UPCOMING_LEAVES';
export const NINETOFIVER_RELOAD_USER = 'NINETOFIVER/RELOAD_USER';
export const NINETOFIVER_RELOAD_USER_GROUPS = 'NINETOFIVER/RELOAD_USER_GROUPS';
export const NINETOFIVER_RELOAD_USER_WORK_SCHEDULE = 'NINETOFIVER/RELOAD_USER_WORK_SCHEDULE';
export const NINETOFIVER_RELOAD_USERS = 'NINETOFIVER/RELOAD_USERS';
export const NINETOFIVER_RELOAD_WHEREABOUTS = 'NINETOFIVER/RELOAD_WHEREABOUTS';
export const NINETOFIVER_RELOAD_WORK_SCHEDULES = 'NINETOFIVER/RELOAD_WORK_SCHEDULES';
export const NINETOFIVER_RELOAD_REDMINE_TIME_ENTRIES = 'NINETOFIVER/RELOAD_REDMINE_TIME_ENTRIES';
export const NINETOFIVER_RELOAD_BACKEND_BASE_URL = 'NINETOFIVER/RELOAD_BACKEND_BASE_URL';
// Actions: ng
export const NINETOFIVER_RELOAD_MY_ACTIVE_CONTRACTS = 'NINETOFIVER/RELOAD_MY_ACTIVE_CONTRACTS';
export const NINETOFIVER_RELOAD_MY_CONTRACT_USERS = 'NINETOFIVER/RELOAD_MY_CONTRACT_USERS';
export const NINETOFIVER_RELOAD_MY_CURRENT_TIMESHEET = 'NINETOFIVER/RELOAD_MY_CURRENT_TIMESHEET';
export const NINETOFIVER_RELOAD_MY_CURRENT_MONTH_INFO = 'NINETOFIVER/RELOAD_MY_CURRENT_MONTH_INFO';
export const NINETOFIVER_RELOAD_MY_OPEN_TIMESHEETS = 'NINETOFIVER/RELOAD_MY_OPEN_TIMESHEETS';
export const NINETOFIVER_RELOAD_MY_IMPORTABLE_PERFORMANCES = 'NINETOFIVER/RELOAD_MY_IMPORTABLE_PERFORMANCES';
export const NINETOFIVER_RELOAD_MY_CURRENT_WORK_SCHEDULE = 'NINETOFIVER/RELOAD_MY_CURRENT_WORK_SCHEDULE';
