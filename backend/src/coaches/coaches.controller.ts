import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { CoachesService } from './coaches.service';
import { CoachBrandingDto, LeadRequestDto } from './dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('api/v1/coaches')
export class CoachesController {
  constructor(private coachesService: CoachesService) {}

  @Post('leads/request')
  async requestLead(@Body() dto: LeadRequestDto) {
    return this.coachesService.requestLead(dto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@CurrentUser() user: any) {
    return this.coachesService.getCoachProfile(user.uid);
  }

  @Put('branding')
  @UseGuards(AuthGuard)
  async updateBranding(
    @CurrentUser() user: any,
    @Body() dto: CoachBrandingDto,
  ) {
    return this.coachesService.updateBranding(user.uid, dto);
  }

  @Get('clients')
  @UseGuards(AuthGuard)
  async getClients(@CurrentUser() user: any) {
    return this.coachesService.getClients(user.uid);
  }

  @Put('clients/:id/notes')
  @UseGuards(AuthGuard)
  async updateClientNotes(
    @CurrentUser() user: any,
    @Param('id') customerId: string,
    @Body() body: { notes: string },
  ) {
    return this.coachesService.updateClientNotes(user.uid, customerId, body.notes || '');
  }

  @Post('clients/:id/unlock-with-credit')
  @UseGuards(AuthGuard)
  async unlockClientWithCredit(
    @CurrentUser() user: any,
    @Param('id') customerId: string,
  ) {
    return this.coachesService.unlockClientWithCredits(user.uid, customerId);
  }

  @Get('clients/:id/copilot-brief')
  @UseGuards(AuthGuard)
  async getCopilotBrief(
    @CurrentUser() user: any,
    @Param('id') customerId: string,
  ) {
    return this.coachesService.generateCopilotAdvice(user.uid, customerId);
  }

  @Get('leads')
  @UseGuards(AuthGuard)
  async getAssignedLeads(@CurrentUser() user: any) {
    return this.coachesService.getAssignedLeads(user.uid);
  }

  @Put('leads/:id/status')
  @UseGuards(AuthGuard)
  async updateLeadStatus(
    @CurrentUser() user: any,
    @Param('id') leadId: string,
    @Body() body: { status: string; notes?: string },
  ) {
    return this.coachesService.updateLeadStatus(user.uid, leadId, body.status, body.notes);
  }
}
