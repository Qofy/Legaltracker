import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meeting } from './meeting.entity';
import { User } from '../users/user.entity';
import { CasesService } from '../cases/cases.service';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private meetingsRepository: Repository<Meeting>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private casesService: CasesService,
  ) {}

  async findAll(user: User, caseId?: string): Promise<Meeting[]> {
    const queryBuilder = this.meetingsRepository.createQueryBuilder('meeting')
      .leftJoinAndSelect('meeting.case', 'case')
      .leftJoinAndSelect('meeting.attendees', 'attendees')
      .leftJoinAndSelect('meeting.created_by', 'created_by');

    if (caseId) {
      queryBuilder.andWhere('meeting.case_id = :caseId', { caseId });
    }

    const meetings = await queryBuilder.getMany();

    // Filter meetings based on case access
    const accessibleMeetings = [];
    for (const meeting of meetings) {
      if (await this.casesService.canAccessCase(meeting.case_id, user)) {
        accessibleMeetings.push(meeting);
      }
    }

    return accessibleMeetings;
  }

  async findOne(id: string, user: User): Promise<Meeting> {
    const meeting = await this.meetingsRepository.findOne({
      where: { id },
      relations: ['case', 'attendees', 'created_by'],
    });

    if (!meeting) {
      throw new NotFoundException(`Meeting with ID ${id} not found`);
    }

    const canAccess = await this.casesService.canAccessCase(meeting.case_id, user);
    if (!canAccess) {
      throw new ForbiddenException('You do not have access to this meeting');
    }

    return meeting;
  }

  async create(createDto: any, user: User): Promise<Meeting> {
    const { case_id, attendee_ids, ...meetingData } = createDto;

    // Check if user can access the case
    const canAccess = await this.casesService.canAccessCase(case_id, user);
    if (!canAccess) {
      throw new ForbiddenException('You do not have access to this case');
    }

    const meeting = this.meetingsRepository.create({
      ...meetingData,
      case_id,
      created_by: user,
    });

    if (attendee_ids && attendee_ids.length > 0) {
      meeting.attendees = await this.usersRepository.findByIds(attendee_ids);
    }

    return await this.meetingsRepository.save(meeting);
  }

  async update(id: string, updateDto: any, user: User): Promise<Meeting> {
    const meeting = await this.findOne(id, user);

    const canEdit = await this.casesService.canEditCase(meeting.case_id, user);
    if (!canEdit) {
      throw new ForbiddenException('You do not have permission to edit this meeting');
    }

    const { attendee_ids, ...meetingData } = updateDto;

    Object.assign(meeting, meetingData);

    if (attendee_ids) {
      meeting.attendees = await this.usersRepository.findByIds(attendee_ids);
    }

    return await this.meetingsRepository.save(meeting);
  }

  async remove(id: string, user: User): Promise<void> {
    const meeting = await this.findOne(id, user);

    const canEdit = await this.casesService.canEditCase(meeting.case_id, user);
    if (!canEdit) {
      throw new ForbiddenException('You do not have permission to delete this meeting');
    }

    await this.meetingsRepository.remove(meeting);
  }

  async findUpcoming(user: User, caseId?: string): Promise<Meeting[]> {
    const now = new Date();
    const queryBuilder = this.meetingsRepository.createQueryBuilder('meeting')
      .leftJoinAndSelect('meeting.case', 'case')
      .leftJoinAndSelect('meeting.attendees', 'attendees')
      .leftJoinAndSelect('meeting.created_by', 'created_by')
      .where('meeting.meeting_date >= :now', { now })
      .andWhere('meeting.status = :status', { status: 'scheduled' })
      .orderBy('meeting.meeting_date', 'ASC');

    if (caseId) {
      queryBuilder.andWhere('meeting.case_id = :caseId', { caseId });
    }

    const meetings = await queryBuilder.getMany();

    // Filter based on case access
    const accessibleMeetings = [];
    for (const meeting of meetings) {
      if (await this.casesService.canAccessCase(meeting.case_id, user)) {
        accessibleMeetings.push(meeting);
      }
    }

    return accessibleMeetings;
  }
}
