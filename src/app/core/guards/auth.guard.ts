import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  Router, 
  UrlTree 
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const requiredRoles = route.data['roles'] as Role[];
    const currentUser = this.authService.currentUserValue;

    // Allow access if route doesn't require specific roles and user is authenticated
    if (!requiredRoles && currentUser) return true;

    // Handle unauthenticated users
    if (!currentUser) {
      return this.router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: this.router.url }
      });
    }

    // Check role authorization - now supports multiple roles
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some(role => 
        this.authService.hasRole(role)
      );
      
      if (!hasRequiredRole) {
        return this.router.createUrlTree(['/']);
      }
    }

    return true;
  }
}