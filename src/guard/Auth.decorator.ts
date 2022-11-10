import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { GqlAuthGuard, RoleGuards } from './auth.guard';
export function Auth(...roles: any[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(GqlAuthGuard, RoleGuards),
  );
}
