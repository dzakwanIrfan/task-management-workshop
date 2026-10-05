import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedRequest } from './auth.types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const [scheme, token, extra] =
      request.headers.authorization?.split(' ') ?? [];

    if (scheme !== 'Bearer' || !token || extra) {
      throw new UnauthorizedException('Token diperlukan');
    }

    let payload: { sub?: unknown };
    try {
      payload = await this.jwt.verifyAsync<{ sub?: unknown }>(token);
    } catch {
      throw new UnauthorizedException('Token tidak valid atau kedaluwarsa');
    }

    if (
      typeof payload.sub !== 'number' ||
      !Number.isInteger(payload.sub) ||
      payload.sub <= 0
    ) {
      throw new UnauthorizedException('Isi token tidak valid');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true },
    });
    if (!user) throw new UnauthorizedException('User tidak ditemukan');

    request.user = { id: user.id };
    return true;
  }
}
