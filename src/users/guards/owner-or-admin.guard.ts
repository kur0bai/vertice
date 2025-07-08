import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class UserOwnerOrAdminGuard implements CanActivate {
    constructor(private readonly usersService: UsersService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { user, params } = request;

        const userId = params.id;

        if (!isValidObjectId(userId)) {
            throw new ForbiddenException('ID inválido');
        }


        const targetUser = await this.usersService.findOne(userId);
        if (!targetUser) {
            throw new ForbiddenException('Usuario no encontrado');
        }

        if (targetUser._id.toString() === user.userId || user.role === 'admin') {
            return true;
        }

        throw new ForbiddenException('No tienes permiso para esta acción');
    }
}
