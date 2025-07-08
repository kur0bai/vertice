import { Role } from "src/common/enums/role.enum";

export interface RequestWithUser extends Request {
    user: {
        sub: string;
        email: string;
        role: Role;
        iat: number;
        exp: number;
    };
}
