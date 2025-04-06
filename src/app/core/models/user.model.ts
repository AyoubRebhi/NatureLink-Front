export interface User {
    id: number; 
    username: string;
    email: string;
    role: Role;
  }
  
  export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
    EMPLOYEE = 'EMPLOYEE'
  }