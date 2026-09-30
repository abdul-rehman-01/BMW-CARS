import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { authService } from '../../services/authService';
import { storageService } from '../../services/storageService';
import { User, SavedConfiguration, TestDriveRequest } from '../../types';
import { VEHICLE_MODELS } from '../../data/vehicles';
import { DEALERS } from '../../data/dealers';
import { LogIn, UserPlus, Heart, Sliders, Calendar, LogOut, CheckCircle2, Trash2 } from 'lucide-react';
import { useToast } from '../ui/ToastContext';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLoadConfiguration: (config: SavedConfiguration) => void;
  onSelectModel: (slug: string) => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoadConfiguration,
  onSelectModel,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'saved-builds' | 'favourites' | 'bookings' | 'login' | 'register'>('profile');

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // User data states
  const [savedConfigs, setSavedConfigs] = useState<SavedConfiguration[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [testDrives, setTestDrives] = useState<TestDriveRequest[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (currentUser) {
        setActiveTab('saved-builds');
        loadUserData();
      } else {
        setActiveTab('login');
      }
    }
  }, [isOpen, currentUser]);

  const loadUserData = () => {
    const configs = storageService.getConfigurations();
    setSavedConfigs(configs);
    const favs = storageService.getFavourites(currentUser?.id);
    setFavourites(favs);
    const tds = storageService.getTestDrives();
    setTestDrives(tds);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = authService.login(loginEmail, loginPassword);
    if (res.success) {
      showToast(`Welcome back, ${res.user?.name}!`);
      loadUserData();
      setActiveTab('saved-builds');
    } else {
      setErrorMessage(res.error || 'Login failed');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = authService.register(registerName, registerEmail, registerPassword);
    if (res.success) {
      showToast(`Account created! Welcome, ${res.user?.name}`);
      loadUserData();
      setActiveTab('saved-builds');
    } else {
      setErrorMessage(res.error || 'Registration failed');
    }
  };

  const handleQuickDemo = (role: 'user' | 'admin') => {
    const user = authService.quickDemoLogin(role);
    showToast(`Signed in as ${user.name} (${user.role.toUpperCase()})`);
    loadUserData();
    setActiveTab('saved-builds');
  };

  const handleLogout = () => {
    authService.logout();
    showToast('Signed out successfully.');
    setActiveTab('login');
  };

  const handleDeleteConfig = (id: string) => {
    storageService.deleteConfiguration(id);
    setSavedConfigs((prev) => prev.filter((c) => c.id !== id));
    showToast('Configuration removed.');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentUser ? `My BMW · ${currentUser.name}` : 'My BMW Account'}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {currentUser ? (
          <div>
            {/* Logged in Navigation Tabs */}
            <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-2 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('saved-builds')}
                className={`px-3 py-2 rounded flex items-center gap-1.5 transition ${
                  activeTab === 'saved-builds'
                    ? 'bg-[#1c69d4] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Saved Builds ({savedConfigs.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('favourites')}
                className={`px-3 py-2 rounded flex items-center gap-1.5 transition ${
                  activeTab === 'favourites'
                    ? 'bg-[#1c69d4] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Favourites ({favourites.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-3 py-2 rounded flex items-center gap-1.5 transition ${
                  activeTab === 'bookings'
                    ? 'bg-[#1c69d4] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Test Drives ({testDrives.length})</span>
              </button>

              <button
                onClick={handleLogout}
                className="ml-auto px-3 py-2 text-gray-400 hover:text-red-400 flex items-center gap-1"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Tab: Saved Builds */}
            {activeTab === 'saved-builds' && (
              <div className="py-4 space-y-3">
                {savedConfigs.length === 0 ? (
                  <div className="text-center py-10 bg-black/30 rounded-lg border border-white/5 space-y-2">
                    <Sliders className="w-8 h-8 text-gray-500 mx-auto" />
                    <p className="text-sm font-semibold text-gray-300">No saved configurations yet.</p>
                    <p className="text-xs text-gray-500">
                      Customize any vehicle in the Configurator and click "Save to Account".
                    </p>
                  </div>
                ) : (
                  savedConfigs.map((cfg) => {
                    const model = VEHICLE_MODELS.find((m) => m.id === cfg.modelId);
                    return (
                      <div
                        key={cfg.id}
                        className="bg-[#080a0c] border border-white/10 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          {model && (
                            <img
                              src={model.imageUrl}
                              alt={model.name}
                              className="w-20 h-14 object-cover rounded bg-neutral-900 shrink-0"
                            />
                          )}
                          <div>
                            <h4 className="text-sm font-bold text-white">{cfg.title}</h4>
                            <div className="text-xs text-[#1c69d4] font-semibold">
                              ${cfg.calculatedPrice.toLocaleString()} {cfg.currency}
                            </div>
                            <div className="text-[11px] text-gray-500">
                              Share Code: <span className="font-mono text-gray-400">{cfg.shareToken}</span> · {new Date(cfg.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => {
                              onLoadConfiguration(cfg);
                              onClose();
                            }}
                          >
                            Load in Builder
                          </Button>
                          <button
                            onClick={() => handleDeleteConfig(cfg.id)}
                            className="p-2 text-gray-500 hover:text-red-400 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Tab: Favourites */}
            {activeTab === 'favourites' && (
              <div className="py-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {favourites.map((modelId) => {
                    const model = VEHICLE_MODELS.find((m) => m.id === modelId);
                    if (!model) return null;
                    return (
                      <div
                        key={model.id}
                        className="bg-[#080a0c] border border-white/10 rounded-lg p-3.5 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={model.imageUrl}
                            alt={model.name}
                            className="w-16 h-12 object-cover rounded"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-white">{model.name}</h4>
                            <div className="text-[11px] text-gray-400">
                              From ${model.basePrice.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            onSelectModel(model.slug);
                            onClose();
                          }}
                        >
                          View
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab: Bookings */}
            {activeTab === 'bookings' && (
              <div className="py-4 space-y-3">
                {testDrives.map((td) => {
                  const model = VEHICLE_MODELS.find((m) => m.id === td.modelId);
                  const dealer = DEALERS.find((d) => d.id === td.dealerId);
                  return (
                    <div
                      key={td.id}
                      className="bg-[#080a0c] border border-white/10 rounded-lg p-4 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-gray-400">{td.referenceNumber}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            td.status === 'scheduled'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-blue-950 text-blue-300 border border-blue-800'
                          }`}
                        >
                          {td.status}
                        </span>
                      </div>
                      <div className="text-white font-bold text-sm">
                        {model?.name || 'BMW Model Test Drive'}
                      </div>
                      <div className="text-gray-400">
                        Dealer Center: <span className="text-gray-200">{dealer?.name}</span>
                      </div>
                      <div className="text-gray-400">
                        Date & Slot: <span className="text-gray-200">{td.preferredDate} · {td.preferredTime}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Sign In / Sign Up Forms */
          <div className="space-y-6">
            {/* Quick Demo Login Option */}
            <div className="bg-[#121824] border border-[#1c69d4]/30 rounded-lg p-4 space-y-3">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1c69d4]" />
                <span>Instant Demo Access (No password required)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('user')}
                  className="py-2.5 px-3 bg-[#1c69d4] hover:bg-[#0053b8] text-white rounded text-xs font-semibold text-center transition"
                >
                  Sign in as Demo Customer (Marcus)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold text-center transition border border-white/20"
                >
                  Sign in as Demo Admin
                </button>
              </div>
            </div>

            {/* Tabs for manual sign in / register */}
            <div className="flex border-b border-white/10 text-xs font-bold">
              <button
                onClick={() => {
                  setActiveTab('login');
                  setErrorMessage('');
                }}
                className={`py-2 px-4 border-b-2 transition ${
                  activeTab === 'login'
                    ? 'border-[#1c69d4] text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setActiveTab('register');
                  setErrorMessage('');
                }}
                className={`py-2 px-4 border-b-2 transition ${
                  activeTab === 'register'
                    ? 'border-[#1c69d4] text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-950/80 border border-red-800 rounded text-red-200 text-xs">
                {errorMessage}
              </div>
            )}

            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-300 font-semibold mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-[#080a0c] border border-white/20 rounded p-3 text-sm text-white focus:outline-none focus:border-[#1c69d4]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 font-semibold mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#080a0c] border border-white/20 rounded p-3 text-sm text-white focus:outline-none focus:border-[#1c69d4]"
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full" leftIcon={<LogIn className="w-4 h-4" />}>
                  Sign In
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-300 font-semibold mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena Rostova"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="w-full bg-[#080a0c] border border-white/20 rounded p-3 text-sm text-white focus:outline-none focus:border-[#1c69d4]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 font-semibold mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full bg-[#080a0c] border border-white/20 rounded p-3 text-sm text-white focus:outline-none focus:border-[#1c69d4]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 font-semibold mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full bg-[#080a0c] border border-white/20 rounded p-3 text-sm text-white focus:outline-none focus:border-[#1c69d4]"
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full" leftIcon={<UserPlus className="w-4 h-4" />}>
                  Create My BMW Account
                </Button>
              </form>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
