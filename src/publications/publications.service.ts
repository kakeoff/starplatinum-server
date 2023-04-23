import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicationsService {
  constructor(private prisma: PrismaService) {}
  async getAllPublications() {
    const pubs = await this.prisma.publication.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        link: true,
        cost: true,
      },
    });
    return pubs;
  }
  async createPublication(pub) {
    const publication = await this.prisma.publication.create({
      data: {
        name: pub.name,
        description: pub.description,
        link: pub.link,
        cost: pub.cost,
      },
    });
    return publication;
  }

  async updatePublication(pub) {
    const publication = await this.prisma.publication.update({
      where: {
        id: pub.id,
      },
      data: {
        name: pub.name,
        description: pub.description,
        link: pub.link,
        cost: pub.cost,
      },
    });
    return publication;
  }

  async deletePublication(id: number) {
    await this.prisma.publication.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
