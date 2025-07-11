import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        console.log('User in AdminGuard:', user);
        if (user?.role === 'admin') {
            return true;
        }

        throw new ForbiddenException(
            'Solo administradores pueden realizar esta acción',
        );
    }
}
