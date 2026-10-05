import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generate/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: number, body: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        userId,
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.task.findMany({ where: { userId } });
  }

  async findOne(userId: number, id: number) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });
    if (!task) throw new NotFoundException('Task tidak ditemukan');
    return task;
  }

  async update(userId: number, id: number, body: UpdateTaskDto) {
    try {
      return await this.prisma.task.update({
        where: { id, userId },
        data: {
          title: body.title,
          description: body.description,
          completed: body.completed,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Task tidak ditemukan');
      }
      throw error;
    }
  }

  async remove(userId: number, id: number) {
    try {
      return await this.prisma.task.delete({
        where: { id, userId },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Task tidak ditemukan');
      }
      throw error;
    }
  }
}
