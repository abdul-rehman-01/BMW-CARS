import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { VEHICLE_MODELS } from '../../data/vehicles';
import { DEALERS } from '../../data/dealers';
import { enquiryService } from '../../services/enquiryService';
import { Calendar, CheckCircle2, MapPin, Clock, User, Mail, Phone } from 'lucide-react';
import { useToast } from '../ui/ToastContext';

interface TestDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultModelId?: string;
  defaultDealerId?: string;
  configuredBuildSummary?: string;
  userId?: string;
}

export const TestDriveModal: React.FC<TestDriveModalProps> = ({
  isOpen,
  onClose,
  defaultModelId,
  defaultDealerId,
  configuredBuildSummary,
  userId,
}) => {
  const { showToast } = useToast();

  const [modelId, setModelId] = useState(defaultModelId || VEHICLE_MODELS[0].id);
  const [dealerId, setDealerId] = useState(defaultDealerId || DEALERS[0].id);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (10:00 AM – 12:00 PM)');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState(configuredBuildSummary ? `Configured build: ${configuredBuildSummary}` : '');
  const [consent, setConsent] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    reference: string;
    modelName: string;
    dealerName: string;
    date: string;
  } | null>(null);

  useEffect(() => {
    if (defaultModelId) setModelId(defaultModelId);
    if (defaultDealerId) setDealerId(defaultDealerId);
    if (configuredBuildSummary) setNotes(`Configured build: ${configuredBuildSummary}`);
  }, [defaultModelId, defaultDealerId, configuredBuildSummary]);

  // Default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    setPreferredDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = enquiryService.submitTestDrive({
      modelId,
      dealerId,
      name: fullName,
      email,
      phone,
      preferredDate,
      preferredTime,
      notes,
      consent,
      userId,
    });

    setIsSubmitting(false);

    if (res.success && res.request) {
      const selectedModel = VEHICLE_MODELS.find((m) => m.id === modelId);
      const selectedDealer = DEALERS.find((d) => d.id === dealerId);

      setConfirmedBooking({
        reference: res.request.referenceNumber,
        modelName: selectedModel?.name || 'BMW',
        dealerName: selectedDealer?.name || 'Authorized BMW Center',
        date: `${preferredDate} · ${preferredTime}`,
      });
      showToast('Test drive appointment request submitted successfully!');
    } else {
      showToast(res.error || 'Submission failed. Please check required fields.', 'error');
    }
  };

  const handleResetAndClose = () => {
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={confirmedBooking ? 'Reservation Confirmed' : 'Book a BMW Test Drive'}
      maxWidth="2xl"
    >
      {confirmedBooking ? (
        <div className="text-center py-6 space-y-6">
          <div className="w-16 h-16 bg-emerald-950/80 border border-emerald-600 rounded-full flex items-center justify-center text-emerald-400 mx-auto shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#1c69d4]">
              Appointment Request Received
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">
              Your Test Drive is Requested
            </h3>
            <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto">
              A BMW Client Advisor will reach out via telephone or email within 24 hours to finalize your reservation.
            </p>
          </div>

          <div className="bg-[#080a0c] border border-white/10 rounded-lg p-5 max-w-md mx-auto text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">Confirmation Reference</span>
              <span className="font-mono text-[#1c69d4] font-bold">
                {confirmedBooking.reference}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Vehicle</span>
              <span className="font-bold text-white">{confirmedBooking.modelName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Authorized Center</span>
              <span className="text-white text-right">{confirmedBooking.dealerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Preferred Slot</span>
              <span className="text-white">{confirmedBooking.date}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <Button variant="primary" onClick={handleResetAndClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Model Selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Select BMW Vehicle
              </label>
              <select
                value={modelId}
                onChange={(e) => setModelId(e.target.value)}
                className="w-full bg-[#080a0c] border border-white/20 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#1c69d4]"
              >
                {VEHICLE_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Dealer Selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Preferred Authorized Dealer
              </label>
              <select
                value={dealerId}
                onChange={(e) => setDealerId(e.target.value)}
                className="w-full bg-[#080a0c] border border-white/20 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#1c69d4]"
              >
                {DEALERS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.city}, {d.region}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Preferred Date
              </label>
              <input
                type="date"
                required
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full bg-[#080a0c] border border-white/20 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#1c69d4]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Preferred Time Slot
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full bg-[#080a0c] border border-white/20 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#1c69d4]"
              >
                <option value="Morning (10:00 AM – 12:00 PM)">Morning (10:00 AM – 12:00 PM)</option>
                <option value="Afternoon (1:00 PM – 3:00 PM)">Afternoon (1:00 PM – 3:00 PM)</option>
                <option value="Late Afternoon (4:00 PM – 6:00 PM)">Late Afternoon (4:00 PM – 6:00 PM)</option>
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="pt-2 border-t border-white/10 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
              Contact Information
            </span>

            <div>
              <label className="block text-xs text-gray-300 font-semibold mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Jonathan Cole"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#080a0c] border border-white/20 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#1c69d4]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-300 font-semibold mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="jonathan@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#080a0c] border border-white/20 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#1c69d4]"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-300 font-semibold mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#080a0c] border border-white/20 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#1c69d4]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-300 font-semibold mb-1">
                Notes or Specific Requests (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Questions about financing, trade-in, or package comparisons..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#080a0c] border border-white/20 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#1c69d4]"
              />
            </div>

            <label className="flex items-start gap-2.5 text-[11px] text-gray-400 cursor-pointer pt-1">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded bg-white/10 border-white/20 text-[#1c69d4] focus:ring-0"
              />
              <span>
                I agree to be contacted by an authorized BMW representative regarding this test-drive reservation in accordance with the BMW Privacy Policy.
              </span>
            </label>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              leftIcon={<Calendar className="w-4 h-4" />}
            >
              Submit Reservation
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
