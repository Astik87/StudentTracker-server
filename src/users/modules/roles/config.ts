export enum DefaultRoles {
  STUDENT = 'student',
  ADMIN = 'admin',
  TEACHER = 'teacher',
}

type DefaultRolesListItem = {
  name: string;
  code: DefaultRoles;
};

export const defaultRolesList: DefaultRolesListItem[] = [
  {
    code: DefaultRoles.STUDENT,
    name: 'Студент',
  },
  {
    code: DefaultRoles.ADMIN,
    name: 'Администратор',
  },
  {
    code: DefaultRoles.TEACHER,
    name: 'Преподаватель',
  },
];
