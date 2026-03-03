import { Controller, Get, Header, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../middlewares/jwt-auth.guard';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  dashboard() {
    return this.analyticsService.dashboard();
  }

  @Get('revenue')
  revenue() {
    return this.analyticsService.revenue();
  }

  @Get('orders')
  orders() {
    return this.analyticsService.orders();
  }

  @Get('customers')
  customers() {
    return this.analyticsService.customers();
  }

  @Get('reports/sales')
  sales() {
    return this.analyticsService.salesReport();
  }

  @Get('reports/tailor-performance')
  tailorPerformance() {
    return this.analyticsService.tailorPerformance();
  }

  @Get('reports/order-completion-time')
  orderCompletionTime() {
    return this.analyticsService.orderCompletionTime();
  }

  @Get('reports/export-csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="orders-report.csv"')
  exportCsv() {
    return this.analyticsService.exportCsv();
  }
}

