import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateTaskDto) {
    return this.prismaService.task.create({
      data: body,
    });
  }

  async findAll() {
    return this.prismaService.task.findMany();
  }

  async findOne(id: number) {
    const task = await this.prismaService.task.findUnique({
      where: {
        id,
      },
    });

    if (!task) throw new NotFoundException('Task tidak ditemukan!');

    return task;
  }

  async update(id: number, body: UpdateTaskDto) {
    return this.prismaService.task.update({
      where: {
        id,
      },
      data: {
        ...body,
      },
    });
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    if (!task) throw new NotFoundException('Task tidak ditemukan');

    const deletedTask = await this.prismaService.task.delete({
      where: { id },
    });

    return deletedTask;
  }
}
