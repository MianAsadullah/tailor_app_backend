import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from './shop.entity';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { User } from '../users/user.entity';
import { Order } from '../orders/order.entity';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopsRepo: Repository<Shop>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
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
      relations: ['owner', 'members'],
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
    const result = await this.shopsRepo.softDelete({ id });
    if (!result.affected) {
      throw new NotFoundException('Shop not found');
    }
    return { success: true };
  }

  async analytics(id: string) {
    const shop = await this.shopsRepo.findOne({ where: { id } });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const totalOrders = await this.ordersRepo.count({ where: { shop: { id } } });
    const completedOrders = await this.ordersRepo.count({
      where: { shop: { id }, status: 'delivered' },
    });
    const pendingOrders = await this.ordersRepo.count({
      where: { shop: { id }, status: 'pending' },
    });
    const revenueRaw = await this.ordersRepo
      .createQueryBuilder('order')
      .select('SUM(order.price)', 'revenue')
      .where('order.shopId = :id', { id })
      .andWhere('order.isPaid = true')
      .getRawOne<{ revenue: string | null }>();

    const revenue = revenueRaw?.revenue ? Number(revenueRaw.revenue) : 0;

    return {
      totalOrders,
      completedOrders,
      pendingOrders,
      revenue,
    };
  }

  async updateSettings(id: string, settings: Record<string, unknown>) {
    const shop = await this.shopsRepo.findOne({ where: { id } });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }
    shop.settings = { ...(shop.settings || {}), ...settings };
    return this.shopsRepo.save(shop);
  }

  async inviteTailor(id: string, tailorId: string) {
    const shop = await this.shopsRepo.findOne({
      where: { id },
      relations: ['members'],
    });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const tailor = await this.usersRepo.findOne({ where: { id: tailorId } });
    if (!tailor) {
      throw new NotFoundException('Tailor not found');
    }

    shop.members = [...(shop.members || []), tailor];
    await this.shopsRepo.save(shop);
    return { success: true };
  }

  async members(id: string) {
    const shop = await this.shopsRepo.findOne({
      where: { id },
      relations: ['owner', 'members'],
    });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }
    return {
      owner: shop.owner,
      members: shop.members || [],
    };
  }

  async removeMember(id: string, userId: string) {
    const shop = await this.shopsRepo.findOne({
      where: { id },
      relations: ['members'],
    });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }
    shop.members = (shop.members || []).filter((m) => m.id !== userId);
    await this.shopsRepo.save(shop);
    return { success: true };
  }
}

