import { Enquiry, TestDriveRequest } from '../types';
import { storageService } from './storageService';

export const enquiryService = {
  submitTestDrive(data: {
    modelId: string;
    dealerId: string;
    name: string;
    email: string;
    phone: string;
    preferredDate: string;
    preferredTime: string;
    notes?: string;
    consent: boolean;
    userId?: string;
  }): { success: boolean; request?: TestDriveRequest; error?: string } {
    if (!data.name.trim()) return { success: false, error: 'Full name is required.' };
    if (!data.email.includes('@')) return { success: false, error: 'Valid email address is required.' };
    if (!data.phone.trim()) return { success: false, error: 'Phone number is required.' };
    if (!data.preferredDate) return { success: false, error: 'Preferred date is required.' };
    if (!data.consent) return { success: false, error: 'Consent to terms and privacy is required.' };

    const ref = `TD-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newReq: TestDriveRequest = {
      id: `td-${Date.now()}`,
      userId: data.userId,
      modelId: data.modelId,
      dealerId: data.dealerId,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime || 'Morning (10:00 AM)',
      notes: data.notes?.trim(),
      consent: true,
      status: 'new',
      createdAt: new Date().toISOString(),
      referenceNumber: ref
    };

    storageService.saveTestDrive(newReq);
    storageService.addAuditLog('TEST_DRIVE_BOOKED', 'TestDriveRequest', newReq.id, {
      reference: ref,
      modelId: data.modelId,
      dealerId: data.dealerId,
      email: data.email
    }, data.email);

    return { success: true, request: newReq };
  },

  submitEnquiry(data: {
    name: string;
    email: string;
    phone: string;
    message: string;
    type: Enquiry['type'];
    modelId?: string;
    configurationId?: string;
    consent: boolean;
    userId?: string;
  }): { success: boolean; enquiry?: Enquiry; error?: string } {
    if (!data.name.trim()) return { success: false, error: 'Name is required.' };
    if (!data.email.includes('@')) return { success: false, error: 'Valid email address is required.' };
    if (!data.message.trim()) return { success: false, error: 'Message or enquiry details are required.' };
    if (!data.consent) return { success: false, error: 'Please accept the privacy statement.' };

    const ref = `EQ-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newEnquiry: Enquiry = {
      id: `eq-${Date.now()}`,
      userId: data.userId,
      modelId: data.modelId,
      configurationId: data.configurationId,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      message: data.message.trim(),
      type: data.type || 'quote',
      consent: true,
      status: 'new',
      createdAt: new Date().toISOString(),
      referenceNumber: ref
    };

    storageService.saveEnquiry(newEnquiry);
    storageService.addAuditLog('ENQUIRY_SUBMITTED', 'Enquiry', newEnquiry.id, {
      reference: ref,
      type: data.type,
      modelId: data.modelId,
      email: data.email
    }, data.email);

    return { success: true, enquiry: newEnquiry };
  },

  getAllTestDrives(): TestDriveRequest[] {
    return storageService.getTestDrives();
  },

  getAllEnquiries(): Enquiry[] {
    return storageService.getEnquiries();
  },

  updateTestDriveStatus(id: string, status: TestDriveRequest['status']): void {
    storageService.updateTestDriveStatus(id, status);
    storageService.addAuditLog('TEST_DRIVE_STATUS_UPDATED', 'TestDriveRequest', id, { newStatus: status });
  },

  updateEnquiryStatus(id: string, status: Enquiry['status']): void {
    storageService.updateEnquiryStatus(id, status);
    storageService.addAuditLog('ENQUIRY_STATUS_UPDATED', 'Enquiry', id, { newStatus: status });
  }
};
