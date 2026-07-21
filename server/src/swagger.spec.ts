import { Test } from '@nestjs/testing';
import { INestApplication, Module } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { OrdersController } from './modules/orders/orders.controller';
import { OrdersService } from './modules/orders/orders.service';
import { UsersController } from './modules/users/users.controller';
import { UsersService } from './modules/users/users.service';
import { JwtAuthGuard } from './middlewares/jwt-auth.guard';
import { User } from './modules/users/user.entity';
import { Order } from './modules/orders/order.entity';
import { Shop } from './modules/shops/shop.entity';
import { Measurement } from './modules/measurements/measurement.entity';

const mockRepository = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  softDelete: jest.fn(),
  create: jest.fn(),
  count: jest.fn(),
  createQueryBuilder: jest.fn(),
  findByIds: jest.fn(),
});

@Module({
  controllers: [AuthController, OrdersController, UsersController],
  providers: [
    AuthService,
    OrdersService,
    UsersService,
    { provide: JwtAuthGuard, useValue: { canActivate: () => true } },
    { provide: getRepositoryToken(User), useFactory: mockRepository },
    { provide: getRepositoryToken(Order), useFactory: mockRepository },
    { provide: getRepositoryToken(Shop), useFactory: mockRepository },
    { provide: getRepositoryToken(Measurement), useFactory: mockRepository },
  ],
})
class SwaggerTestModule {}

describe('Swagger documentation', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [SwaggerTestModule],
    }).compile();

    app = moduleRef.createNestApplication();
  });

  it('generates OpenAPI paths for the current API controllers', async () => {
    const config = new DocumentBuilder()
      .setTitle('Tailor App API')
      .setDescription('API documentation for Tailor backend')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    expect(document.paths).toBeDefined();
    expect(document.paths['/auth/register']).toBeDefined();
    expect(document.paths['/orders']).toBeDefined();
    expect(document.paths['/users']).toBeDefined();
  });

  afterAll(async () => {
    await app?.close();
  });
});
