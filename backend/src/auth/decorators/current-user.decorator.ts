import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserPayload {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
