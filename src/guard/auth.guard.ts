import { BadRequestException, Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { jwtConstant } from 'src/jwtConstant';
import { Reflector } from '@nestjs/core';
import { OwnersService } from 'src/owners/owners.service';
['user', 'admin'];

@Injectable()
export class RoleGuards implements CanActivate {
  constructor(
    private reflector: Reflector,
    private ownerService: OwnersService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<any[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const currentUser = await this.ownerService.findOne(req.data.id);
    if (!currentUser) {
      throw new BadRequestException("User doesn't exist in system");
    }
    req.user = currentUser;
    return requiredRoles.some((role) => role === currentUser.role);
  }
}

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const data = this.jwtService.verify(req.token, {
      secret: jwtConstant.jwtKey,
    });
    req.data = data;
    return data;
  }
}
