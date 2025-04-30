export class Favorite {
  userId: number;
  logementId: number;
  user?: any; // or User if you have a User model
  logement?: any; // or Logement if you have a Logement model

  constructor(userId: number, logementId: number, user?: any, logement?: any) {
    this.userId = userId;
    this.logementId = logementId;
    this.user = user;
    this.logement = logement;
  }
}
