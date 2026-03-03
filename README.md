## Tailor App Backend

NestJS + PostgreSQL backend for a tailor management application.  
Features authentication, shops, users, measurements, orders, payments, and notifications with full REST APIs and Swagger docs.

### Tech stack

- **Runtime**: Node.js, TypeScript
- **Framework**: NestJS (`@nestjs/core`, `@nestjs/common`, `@nestjs/swagger`)
- **Database**: PostgreSQL with TypeORM
- **Auth**: JWT (email or phone + password)

### Getting started

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment variables**

Create a `.env` file in the project root:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

JWT_SECRET=super_secret_key
JWT_EXPIRES_IN=1d
```

3. **Run the server**

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api`.

### API documentation (Swagger)

After the server is running, open:

- Swagger UI: `http://localhost:3000/api/docs`

### Core modules and endpoints (all under `/api`)

- **Auth**
  - `POST /auth/register`
  - `POST /auth/login` (login with **email or phone** + password)
  - `GET /auth/me` (requires Bearer token)
  - `POST /auth/logout` (requires Bearer token)

- **Users** (JWT required)
  - `GET /users` (admin only)
  - `GET /users/:id`
  - `PATCH /users/:id`
  - `DELETE /users/:id`

- **Shops** (JWT required)
  - `POST /shops`
  - `GET /shops`
  - `GET /shops/:id`
  - `PATCH /shops/:id`
  - `DELETE /shops/:id`

- **Measurements** (JWT required)
  - `POST /measurements`
  - `GET /measurements`
  - `GET /measurements/:id`
  - `PATCH /measurements/:id`
  - `DELETE /measurements/:id`

- **Orders** (JWT required)
  - `POST /orders`
  - `GET /orders`
  - `GET /orders/:id`
  - `PATCH /orders/:id/status`
  - `PATCH /orders/:id`
  - `DELETE /orders/:id`

- **Payments**
  - `POST /payments` (JWT required)
  - `GET /payments/order/:orderId` (JWT required)
  - `POST /payments/webhook` (public, for Stripe/JazzCash callbacks)

- **Notifications** (JWT required)
  - `GET /notifications`
  - `PATCH /notifications/:id/read`

### Database schema (overview)

- **User**
  - `id`, `name`, `email` (unique), `phone` (unique, nullable), `passwordHash`, `role` (`customer` | `tailor` | `admin`), `isActive`, timestamps
- **Shop**
  - `id`, `name`, `owner` (User), `address`, `city`, `logoUrl`, `isActive`, `createdAt`
- **Measurement**
  - `id`, `customer` (User), `title`, `gender` (`male` | `female`), `measurements` (JSONB), `createdAt`
- **Order**
  - `id`, `orderNumber`, `customer` (User), `tailor` (User), `shop` (Shop), `measurement` (Measurement), `dressType`, `fabricImageUrl`, `designNotes`, `status`, `price`, `deliveryDate`, `isPaid`, timestamps
- **Payment**
  - `id`, `order` (Order), `customer` (User), `amount`, `method` (`cash` | `stripe` | `jazzcash`), `status`, `transactionId`, `createdAt`
- **Notification**
  - `id`, `user` (User), `title`, `message`, `isRead`, `createdAt`

### Authentication

- JWT-based auth with `Authorization: Bearer <token>` header.
- Users can log in with **either**:
  - `email` + `password`, or
  - `phone` + `password`.