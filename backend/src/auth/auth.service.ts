import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from 'generate/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(body: RegisterDto) {
    const email = body.email.trim().toLowerCase();
    if (Buffer.byteLength(body.password, 'utf8') > 72) {
      throw new BadRequestException('Password maksimal 72 byte UTF-8');
    }
    const passwordHash = await bcrypt.hash(body.password, 10);
    try {
      return await this.prisma.user.create({
        data: { email, passwordHash },
        select: { id: true, email: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email sudah terdaftar');
      }
      throw error;
    }
  }

  async login(body: LoginDto) {
    const email = body.email.trim().toLowerCase();
    if (Buffer.byteLength(body.password, 'utf8') > 72) {
      throw new UnauthorizedException('Email atau password salah');
    }
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
      throw new UnauthorizedException('Email atau password salah');
    }
    const accessToken = await this.jwt.signAsync({ sub: user.id });
    return { accessToken, user: { id: user.id, email: user.email } };
  }

  async findPublicUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true },
    });
    if (!user) throw new UnauthorizedException('User tidak ditemukan');
    return user;
  }
}
