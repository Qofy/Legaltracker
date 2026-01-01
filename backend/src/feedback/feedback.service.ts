import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BugReport } from './bug-report.entity';
import { FeatureRequest } from './feature-request.entity';
import { User } from '../users/user.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(BugReport)
    private bugReportsRepository: Repository<BugReport>,
    @InjectRepository(FeatureRequest)
    private featureRequestsRepository: Repository<FeatureRequest>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Bug Reports
  async createBugReport(createBugReportDto: any, user: User): Promise<BugReport> {
    const newBugReport = this.bugReportsRepository.create({
      ...createBugReportDto,
      submitted_by_id: user.id,
    });

    return await this.bugReportsRepository.save(newBugReport);
  }

  async findAllBugReports(user: User, filters?: any): Promise<BugReport[]> {
    const queryBuilder = this.bugReportsRepository
      .createQueryBuilder('bug_report')
      .leftJoinAndSelect('bug_report.submitted_by', 'submitted_by');

    // Apply filters
    if (filters?.severity) {
      queryBuilder.where('bug_report.severity = :severity', { severity: filters.severity });
    }
    if (filters?.status) {
      queryBuilder.andWhere('bug_report.status = :status', { status: filters.status });
    }
    if (filters?.search) {
      queryBuilder.andWhere(
        '(bug_report.title LIKE :search OR bug_report.description LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    queryBuilder.orderBy('bug_report.created_date', 'DESC');

    return await queryBuilder.getMany();
  }

  async findOneBugReport(id: string, user: User): Promise<BugReport> {
    const bugReport = await this.bugReportsRepository.findOne({
      where: { id },
      relations: ['submitted_by'],
    });

    if (!bugReport) {
      throw new NotFoundException('Bug report not found');
    }

    return bugReport;
  }

  async updateBugReport(id: string, updateBugReportDto: any, user: User): Promise<BugReport> {
    const bugReport = await this.findOneBugReport(id, user);

    // Only admins or the submitter can update
    if (user.user_type !== 'admin' && bugReport.submitted_by_id !== user.id) {
      throw new ForbiddenException('You do not have permission to update this bug report');
    }

    Object.assign(bugReport, updateBugReportDto);
    return await this.bugReportsRepository.save(bugReport);
  }

  async removeBugReport(id: string, user: User): Promise<void> {
    const bugReport = await this.findOneBugReport(id, user);

    // Only admins or the submitter can delete
    if (user.user_type !== 'admin' && bugReport.submitted_by_id !== user.id) {
      throw new ForbiddenException('You do not have permission to delete this bug report');
    }

    await this.bugReportsRepository.remove(bugReport);
  }

  // Feature Requests
  async createFeatureRequest(createFeatureRequestDto: any, user: User): Promise<FeatureRequest> {
    const newFeatureRequest = this.featureRequestsRepository.create({
      ...createFeatureRequestDto,
      submitted_by_id: user.id,
      votes: 0,
    });

    return await this.featureRequestsRepository.save(newFeatureRequest);
  }

  async findAllFeatureRequests(user: User, filters?: any): Promise<FeatureRequest[]> {
    const queryBuilder = this.featureRequestsRepository
      .createQueryBuilder('feature_request')
      .leftJoinAndSelect('feature_request.submitted_by', 'submitted_by');

    // Apply filters
    if (filters?.priority) {
      queryBuilder.where('feature_request.priority = :priority', { priority: filters.priority });
    }
    if (filters?.status) {
      queryBuilder.andWhere('feature_request.status = :status', { status: filters.status });
    }
    if (filters?.search) {
      queryBuilder.andWhere(
        '(feature_request.title LIKE :search OR feature_request.description LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    queryBuilder.orderBy('feature_request.votes', 'DESC')
      .addOrderBy('feature_request.created_date', 'DESC');

    return await queryBuilder.getMany();
  }

  async findOneFeatureRequest(id: string, user: User): Promise<FeatureRequest> {
    const featureRequest = await this.featureRequestsRepository.findOne({
      where: { id },
      relations: ['submitted_by'],
    });

    if (!featureRequest) {
      throw new NotFoundException('Feature request not found');
    }

    return featureRequest;
  }

  async updateFeatureRequest(id: string, updateFeatureRequestDto: any, user: User): Promise<FeatureRequest> {
    const featureRequest = await this.findOneFeatureRequest(id, user);

    // Only admins or the submitter can update
    if (user.user_type !== 'admin' && featureRequest.submitted_by_id !== user.id) {
      throw new ForbiddenException('You do not have permission to update this feature request');
    }

    Object.assign(featureRequest, updateFeatureRequestDto);
    return await this.featureRequestsRepository.save(featureRequest);
  }

  async removeFeatureRequest(id: string, user: User): Promise<void> {
    const featureRequest = await this.findOneFeatureRequest(id, user);

    // Only admins or the submitter can delete
    if (user.user_type !== 'admin' && featureRequest.submitted_by_id !== user.id) {
      throw new ForbiddenException('You do not have permission to delete this feature request');
    }

    await this.featureRequestsRepository.remove(featureRequest);
  }

  async voteFeatureRequest(id: string, user: User): Promise<FeatureRequest> {
    const featureRequest = await this.findOneFeatureRequest(id, user);
    featureRequest.votes += 1;
    return await this.featureRequestsRepository.save(featureRequest);
  }
}
