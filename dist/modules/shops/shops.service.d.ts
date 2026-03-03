import { Repository } from 'typeorm';
import { Shop } from './shop.entity';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { User } from '../users/user.entity';
export declare class ShopsService {
    private readonly shopsRepo;
    private readonly usersRepo;
    constructor(shopsRepo: Repository<Shop>, usersRepo: Repository<User>);
    create(dto: CreateShopDto): Promise<Shop>;
    findAll(): Promise<Shop[]>;
    findOne(id: string): Promise<Shop>;
    update(id: string, dto: UpdateShopDto): Promise<Shop>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
