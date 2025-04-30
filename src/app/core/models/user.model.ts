export interface User {
  id: number; 
  username: string;
  email: string;
  role: Role;
  blocked: boolean;
  profilePic?: string;
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE' ,
  AGENCE = 'AGENCE' , 
  PROVIDER = 'PROVIDER' ,
  MONUMENT = 'MONUMENT' 
}