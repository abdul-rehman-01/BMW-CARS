import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { VEHICLE_MODELS } from '../../data/vehicles';
import { enquiryService } from '../../services/enquiryService';
import { CheckCircle2, Send, FileText } from 'lucide-react';
import { useToast } from '../ui/ToastContext';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'quote' | 'financing' | 'general';
  defaultModelId?: string;
  userId?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  type = 'quote',
  defaultModelId,
  userId,
}) => {
  const { showToast } = useToast();

  const [modelId, setModelId] = useState(defaultModelId || VEHICLE_MODELS[0].id);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [enquiryType, setEnquiryType] = useState<'quote' | 'financing' | 'general'>(type);
  const [consent, setConsent] = useState(true);

  const [confirmedRef, setConfirmedRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = enquiryService.submitEnquiry({
      name: fullName,
      email,
      phone,
      message,
      type: enquiryType,
      modelId,
      consent,
      userId,
    });

    setIsSubmitting(false);

    if (res.success && res.enquiry) {
      setConfirmedRef(res.enquiry.referenceNumber);
      showToast('Enquiry received! A customer representative will contact you.');
    } else {
      showToast(res.error || 'Please fill in all required fields.', 'error');
    }
  };

  const handleDone = () => {
    setConfirmedRef(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleDone}
      title={confirmedRef ? 'Enquiry Submitted' : 'Request Pricing & Financing Terms'}
      maxWidth="xl"
    >
      {confirmedRef ? (
        <div className="text-center py-6 space-y-5">
          <div className="w-14 h-14 bg-emerald-950/80 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 mx-auto shadow-lg">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">We Have Received Your Request</h3>
            <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto">
              A BMW finance representative will prepare custom rate options and vehicle availability for your area.
            </p>
          </div>

          <div className="bg-[#080a0c] border border-white/10 rounded p-4 max-w-xs mx-auto text-xs space-y-1">
            <span className="text-gray-400 block">Enquiry Case Number</span>
            <span className="font-mono text-[#1c69d4] font-bold text-sm block">{confirmedRef}</span>
          </div>

          <Button variant="primary" onClick={handleDone}>
            Return to Showroom
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Vehicle of Interest
            </label>
            <select
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              className="w-full bg-[#080a0c] border border-white/20 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#1c69d4]"
            >
              {VEHICLE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — From ${m.basePrice.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Enquiry Type
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(['quote', 'financing', 'general'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setEnquiryType(t)}
                  className={`py-2 px-3 rounded capitalize font-semibold transition border cursor-pointer ${
                    enquiryType === t
                      ? 'bg-[#1c69d4] border-white text-white'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
                  }`}
                >
                  {t === 'quote' ? 'Official Quote' : t === 'financing' ? 'Financing/Lease' : 'General'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rachel Adams"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#080a0c] border border-white/20 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#1c69d4]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="rachel@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#080a0c] border border-white/20 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#1c69d4]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
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
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Your Message or Specific Questions *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Please provide custom lease terms (36 mos / 10k miles) or trade-in valuation..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#080a0c] border border-white/20 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#1c69d4]"
            />
          </div>

          <label className="flex items-start gap-2 text-[11px] text-gray-400 cursor-pointer pt-1">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 rounded bg-white/10 border-white/20 text-[#1c69d4] focus:ring-0"
            />
            <span>
              I consent to receiving customized financing and product communications from BMW Authorized Centers.
            </span>
          </label>

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Send Request
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
