import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from './shop.entity';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopsRepo: Repository<Shop>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(dto: CreateShopDto) {
    const owner = await this.usersRepo.findOne({ where: { id: dto.ownerId } });
    if (!owner) {
      throw new NotFoundException('Owner user not found');
    }

    const shop = this.shopsRepo.create({
      name: dto.name,
      owner,
      address: dto.address,
      city: dto.city,
      logoUrl: dto.logoUrl ?? null,
      isActive: dto.isActive ?? true,
    });

    const saved = await this.shopsRepo.save(shop);
    return saved;
  }

  async findAll() {
    return this.shopsRepo.find({ relations: ['owner'] });
  }

  async findOne(id: string) {
    const shop = await this.shopsRepo.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }
    return shop;
  }

  async update(id: string, dto: UpdateShopDto) {
    const shop = await this.shopsRepo.findOne({ where: { id } });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    if (dto.ownerId) {
      const owner = await this.usersRepo.findOne({
        where: { id: dto.ownerId },
      });
      if (!owner) {
        throw new NotFoundException('Owner user not found');
      }
      shop.owner = owner;
    }

    Object.assign(shop, {
      name: dto.name ?? shop.name,
      address: dto.address ?? shop.address,
      city: dto.city ?? shop.city,
      logoUrl: dto.logoUrl ?? shop.logoUrl,
      isActive:
        typeof dto.isActive === 'boolean' ? dto.isActive : shop.isActive,
    });

    return this.shopsRepo.save(shop);
  }

  async remove(id: string) {
    const shop = await this.shopsRepo.findOne({ where: { id } });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }
    await this.shopsRepo.remove(shop);
    return { success: true };
  }
}

