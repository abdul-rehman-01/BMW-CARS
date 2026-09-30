import React, { useState, useEffect } from 'react';
import { modelService } from '../../services/modelService';
import { enquiryService } from '../../services/enquiryService';
import { storageService } from '../../services/storageService';
import { authService } from '../../services/authService';
import { VehicleModel, TestDriveRequest, Enquiry, AuditLog, User } from '../../types';
import { Button } from '../ui/Button';
import {
  ShieldCheck,
  Car,
  Calendar,
  MessageSquare,
  History,
  RotateCcw,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';
import { useToast } from '../ui/ToastContext';

interface AdminDashboardProps {
  currentUser: User | null;
  onNavigate: (view: string, params?: { modelSlug?: string }) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, onNavigate }) => {
  const { showToast } = useToast();
  const isAdmin = currentUser?.role === 'admin';

  const [activeTab, setActiveTab] = useState<'models' | 'test-drives' | 'enquiries' | 'audit'>('models');
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [testDrives, setTestDrives] = useState<TestDriveRequest[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const loadData = () => {
    setModels(modelService.getAllModels(true));
    setTestDrives(enquiryService.getAllTestDrives());
    setEnquiries(enquiryService.getAllEnquiries());
    setAuditLogs(storageService.getAuditLogs());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTogglePublish = (id: string) => {
    const updated = modelService.togglePublishStatus(id);
    if (updated) {
      setModels(modelService.getAllModels(true));
      showToast(`${updated.name} is now ${updated.status.toUpperCase()}`);
    }
  };

  const handleUpdateTestDriveStatus = (id: string, newStatus: TestDriveRequest['status']) => {
    enquiryService.updateTestDriveStatus(id, newStatus);
    setTestDrives(enquiryService.getAllTestDrives());
    showToast(`Test drive ${id} updated to ${newStatus}`);
  };

  const handleUpdateEnquiryStatus = (id: string, newStatus: Enquiry['status']) => {
    enquiryService.updateEnquiryStatus(id, newStatus);
    setEnquiries(enquiryService.getAllEnquiries());
    showToast(`Enquiry ${id} updated to ${newStatus}`);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all vehicle data to factory defaults? Any edits will be refreshed.')) {
      modelService.resetDefaults();
      loadData();
      showToast('Vehicles reset to factory defaults.');
    }
  };

  const handleElevateToAdmin = () => {
    authService.quickDemoLogin('admin');
    showToast('Signed in as BMW Administrator.');
  };

  if (!isAdmin) {
    return (
      <div className="pt-28 pb-20 bg-[#080a0c] text-white min-h-screen">
        <div className="max-w-xl mx-auto px-6 py-12 text-center space-y-5 bg-[#0f141c] border border-white/10 rounded-xl">
          <div className="w-16 h-16 bg-blue-950/80 border border-blue-500 rounded-full flex items-center justify-center text-blue-400 mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Administrator Access Required</h2>
            <p className="text-xs text-gray-400 mt-2">
              The BMW Showroom Content Management System is protected by role-based authorization.
            </p>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-xs text-gray-300">
            Current session: <span className="font-semibold text-white">{currentUser?.email || 'Guest User'}</span> (Role: {currentUser?.role || 'None'})
          </div>

          <Button
            variant="primary"
            onClick={handleElevateToAdmin}
            leftIcon={<UserCheck className="w-4 h-4" />}
          >
            Switch to Demo Administrator
          </Button>
        </div>
      </div>
    );
  }

  const publishedCount = models.filter((m) => m.status === 'published').length;
  const newTestDriveCount = testDrives.filter((td) => td.status === 'new' || td.status === 'scheduled').length;
  const newEnquiryCount = enquiries.filter((eq) => eq.status === 'new' || eq.status === 'in_progress').length;

  return (
    <div className="pt-24 pb-20 bg-[#080a0c] text-white min-h-screen">
      <div className="max-w-[1536px] mx-auto px-6 lg:px-12 space-y-8">
        {/* Header Bar */}
        <div className="py-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1c69d4]">
              <ShieldCheck className="w-4 h-4" />
              <span>BMW Regional Administrator Console</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1 font-display">
              Showroom Management & Operations
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDefaults}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset Data
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('home')}
            >
              Exit to Showroom
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0f141c] border border-white/10 rounded-lg p-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400 block">Published Models</span>
              <span className="text-2xl font-black text-white tabular-nums">
                {publishedCount} <span className="text-xs text-gray-500 font-normal">/ {models.length}</span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#0f141c] border border-white/10 rounded-lg p-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400 block">Active Test Drives</span>
              <span className="text-2xl font-black text-white tabular-nums">
                {newTestDriveCount}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#0f141c] border border-white/10 rounded-lg p-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400 block">Customer Enquiries</span>
              <span className="text-2xl font-black text-white tabular-nums">
                {newEnquiryCount}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#0f141c] border border-white/10 rounded-lg p-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400 block">Audit Activity Logs</span>
              <span className="text-2xl font-black text-white tabular-nums">
                {auditLogs.length}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-white/10 flex gap-4 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('models')}
            className={`pb-3 transition relative cursor-pointer ${
              activeTab === 'models' ? 'text-white border-b-2 border-[#1c69d4]' : 'text-gray-400 hover:text-white'
            }`}
          >
            Vehicles & Catalog ({models.length})
          </button>

          <button
            onClick={() => setActiveTab('test-drives')}
            className={`pb-3 transition relative cursor-pointer ${
              activeTab === 'test-drives' ? 'text-white border-b-2 border-[#1c69d4]' : 'text-gray-400 hover:text-white'
            }`}
          >
            Test Drive Bookings ({testDrives.length})
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`pb-3 transition relative cursor-pointer ${
              activeTab === 'enquiries' ? 'text-white border-b-2 border-[#1c69d4]' : 'text-gray-400 hover:text-white'
            }`}
          >
            Quotes & Enquiries ({enquiries.length})
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-3 transition relative cursor-pointer ${
              activeTab === 'audit' ? 'text-white border-b-2 border-[#1c69d4]' : 'text-gray-400 hover:text-white'
            }`}
          >
            Audit Trail
          </button>
        </div>

        {/* Tab 1: Models Management */}
        {activeTab === 'models' && (
          <div className="bg-[#0f141c] border border-white/10 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#080a0c] border-b border-white/10 text-[11px] uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="p-4">Model & Visual</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Powertrain</th>
                    <th className="p-4">MSRP</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {models.map((m) => (
                    <tr key={m.id} className="hover:bg-white/[0.02]">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={m.imageUrl}
                          alt={m.name}
                          className="w-16 h-10 object-cover rounded bg-neutral-900"
                        />
                        <div>
                          <div className="font-bold text-white text-sm">{m.name}</div>
                          <div className="text-[10px] text-gray-400">{m.variants.length} Variants</div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{m.category}</td>
                      <td className="p-4 text-gray-300">
                        {m.horsepower} hp · {m.acceleration}s
                      </td>
                      <td className="p-4 font-bold text-white tabular-nums">
                        ${m.basePrice.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            m.status === 'published'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleTogglePublish(m.id)}
                          className="p-1.5 rounded hover:bg-white/10 text-gray-300 hover:text-white transition"
                          title={m.status === 'published' ? 'Unpublish to Draft' : 'Publish Model'}
                        >
                          {m.status === 'published' ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4 text-emerald-400" />
                          )}
                        </button>
                        <button
                          onClick={() => onNavigate('detail', { modelSlug: m.slug })}
                          className="text-[#1c69d4] hover:underline font-semibold text-xs"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Test Drives Management */}
        {activeTab === 'test-drives' && (
          <div className="bg-[#0f141c] border border-white/10 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#080a0c] border-b border-white/10 text-[11px] uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="p-4">Booking Ref</th>
                    <th className="p-4">Client Details</th>
                    <th className="p-4">Vehicle Model</th>
                    <th className="p-4">Scheduled Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {testDrives.map((td) => {
                    const model = models.find((m) => m.id === td.modelId);
                    return (
                      <tr key={td.id} className="hover:bg-white/[0.02]">
                        <td className="p-4 font-mono text-xs text-[#1c69d4] font-bold">
                          {td.referenceNumber}
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-white">{td.name}</div>
                          <div className="text-[11px] text-gray-400">{td.email} · {td.phone}</div>
                        </td>
                        <td className="p-4 font-semibold text-white">
                          {model?.name || td.modelId}
                        </td>
                        <td className="p-4 text-gray-300">
                          {td.preferredDate} ({td.preferredTime})
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              td.status === 'completed'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : td.status === 'scheduled'
                                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {td.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <select
                            value={td.status}
                            onChange={(e) => handleUpdateTestDriveStatus(td.id, e.target.value as any)}
                            className="bg-[#080a0c] border border-white/20 rounded p-1 text-xs text-white"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Enquiries Management */}
        {activeTab === 'enquiries' && (
          <div className="bg-[#0f141c] border border-white/10 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#080a0c] border-b border-white/10 text-[11px] uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="p-4">Reference</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Message Details</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {enquiries.map((eq) => (
                    <tr key={eq.id} className="hover:bg-white/[0.02]">
                      <td className="p-4 font-mono text-[#1c69d4] font-bold">{eq.referenceNumber}</td>
                      <td className="p-4">
                        <div className="font-semibold text-white">{eq.name}</div>
                        <div className="text-[11px] text-gray-400">{eq.email}</div>
                      </td>
                      <td className="p-4 uppercase text-[10px] font-bold text-gray-300">
                        {eq.type}
                      </td>
                      <td className="p-4 max-w-xs truncate text-gray-300" title={eq.message}>
                        {eq.message}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/10 text-gray-200">
                          {eq.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={eq.status}
                          onChange={(e) => handleUpdateEnquiryStatus(eq.id, e.target.value as any)}
                          className="bg-[#080a0c] border border-white/20 rounded p-1 text-xs text-white"
                        >
                          <option value="new">New</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Audit Trail */}
        {activeTab === 'audit' && (
          <div className="bg-[#0f141c] border border-white/10 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">System Security & Mutation Log</h3>
              <span className="text-xs text-gray-400">Strictly recorded for audit compliance</span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scroll">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-[#080a0c] border border-white/5 rounded p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[#1c69d4] font-bold">{log.action}</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-300">{log.entityType}</span>
                    <span className="text-gray-500">by {log.actorEmail}</span>
                  </div>
                  <span className="text-[11px] text-gray-500 font-mono">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
