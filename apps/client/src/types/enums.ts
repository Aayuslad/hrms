export const GENDER = {
    MALE: 'MALE',
    FEMALE: 'FEMALE',
    OTHER: 'OTHER',
} as const;
export type Gender = (typeof GENDER)[keyof typeof GENDER];

export const WEEK_DAYS = {
    SUNDAY: 'SUNDAY',
    MONDAY: 'MONDAY',
    TUESDAY: 'TUESDAY',
    WEDNESDAY: 'WEDNESDAY',
    THURSDAY: 'THURSDAY',
    FRIDAY: 'FRIDAY',
    SATURDAY: 'SATURDAY',
} as const;
export type WeekDay = (typeof WEEK_DAYS)[keyof typeof WEEK_DAYS];

export const EXPENSE_STATUS = {
    SUBMITTED: 'SUBMITTED',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    DRAFTING: 'DRAFTING',
} as const;
export type ExpenseStatus =
    (typeof EXPENSE_STATUS)[keyof typeof EXPENSE_STATUS];
