import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './components/ui/ToastContext';
import { DemoDataNotice } from './components/common/DemoDataNotice';
import { MainHeader } from './components/layout/MainHeader';
import { MainFooter } from './components/layout/MainFooter';
import { QuickServicesBar } from './components/layout/QuickServicesBar';

// Views
import { HeroSection } from './components/home/HeroSection';
import { ExploreModelsLineup } from './components/home/ExploreModelsLineup';
import { ExperienceShowcase } from './components/home/ExperienceShowcase';
import { SpotlightBanner } from './components/home/SpotlightBanner';
import { ConfiguratorTeaser } from './components/home/ConfiguratorTeaser';
import { ModelsCatalogue } from './components/models/ModelsCatalogue';
import { ModelDetailPage } from './components/detail/ModelDetailPage';
import { VehicleConfigurator } from './components/configurator/VehicleConfigurator';
import { VehicleComparison } from './components/compare/VehicleComparison';
import { DealerLocator } from './components/dealers/DealerLocator';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Modals
import { SearchModal } from './components/common/SearchModal';
import { UserAccountModal } from './components/account/UserAccountModal';
import { TestDriveModal } from './components/dealers/TestDriveModal';
import { QuoteModal } from './components/dealers/QuoteModal';

// Services & Data
import { authService } from './services/authService';
import { modelService } from './services/modelService';
import { User, SavedConfiguration } from './types';
import { VEHICLE_MODELS } from './data/vehicles';

export function AppContent() {
  const { showToast } = useToast();

  // Route state
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeModelSlug, setActiveModelSlug] = useState<string>('5-series');
  const [activeVariantId, setActiveVariantId] = useState<string | undefined>();
  const [loadedConfig, setLoadedConfig] = useState<SavedConfiguration | null>(null);

  // Compare state
  const [compareList, setCompareList] = useState<string[]>(['bmw-3-series', 'bmw-5-series']);

  // Modals state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [testDriveModalOpen, setTestDriveModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteType, setQuoteType] = useState<'quote' | 'financing' | 'general'>('quote');
  const [selectedDealerId, setSelectedDealerId] = useState<string | undefined>();
  const [configuredBuildSummary, setConfiguredBuildSummary] = useState<string | undefined>();

  // Current user state
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = authService.subscribe((user) => {
      setCurrentUser(user);
    });
    return unsub;
  }, []);

  // Navigation handler
  const handleNavigate = (view: string, params?: { modelSlug?: string; variantId?: string }) => {
    if (params?.modelSlug) {
      setActiveModelSlug(params.modelSlug);
    }
    if (params?.variantId) {
      setActiveVariantId(params.variantId);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectModel = (slug: string) => {
    setActiveModelSlug(slug);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfigureModel = (slug: string, variantId?: string) => {
    setActiveModelSlug(slug);
    setActiveVariantId(variantId);
    setLoadedConfig(null);
    setCurrentView('configurator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleCompare = (modelId: string) => {
    setCompareList((prev) => {
      if (prev.includes(modelId)) {
        showToast('Removed vehicle from comparison.');
        return prev.filter((id) => id !== modelId);
      }
      if (prev.length >= 3) {
        showToast('You can compare up to 3 vehicles at a time.', 'info');
        return prev;
      }
      showToast('Added vehicle to comparison.');
      return [...prev, modelId];
    });
  };

  const handleOpenTestDriveModal = (modelId?: string, dealerId?: string, buildSummary?: string) => {
    if (modelId) {
      const found = VEHICLE_MODELS.find((m) => m.id === modelId || m.slug === modelId);
      if (found) setActiveModelSlug(found.slug);
    }
    if (dealerId) setSelectedDealerId(dealerId);
    if (buildSummary) setConfiguredBuildSummary(buildSummary);
    setTestDriveModalOpen(true);
  };

  const handleOpenQuoteModal = (type: 'quote' | 'financing' | 'general' = 'quote') => {
    setQuoteType(type);
    setQuoteModalOpen(true);
  };

  const handleQuickServiceAction = (service: 'dealers' | 'test-drive' | 'quote' | 'contact') => {
    switch (service) {
      case 'dealers':
        handleNavigate('dealers');
        break;
      case 'test-drive':
        handleOpenTestDriveModal();
        break;
      case 'quote':
        handleOpenQuoteModal('quote');
        break;
      case 'contact':
        handleOpenQuoteModal('general');
        break;
    }
  };

  const handleLoadConfiguration = (config: SavedConfiguration) => {
    setLoadedConfig(config);
    const m = VEHICLE_MODELS.find((mod) => mod.id === config.modelId);
    if (m) setActiveModelSlug(m.slug);
    setCurrentView('configurator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find active vehicle for detail view
  const currentModel = modelService.getModelBySlug(activeModelSlug) || VEHICLE_MODELS[0];

  return (
    <div className="bg-[#080a0c] text-white min-h-screen flex flex-col font-sans">
      {/* Top Banner Notice for simulated demo compliance */}
      <DemoDataNotice />

      {/* Main Global Header */}
      <MainHeader
        currentView={currentView}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Primary View Routing */}
      <main className="flex-1">
        {currentView === 'home' && (
          <div>
            <HeroSection onNavigate={handleNavigate} />
            <ExploreModelsLineup
              onSelectModel={handleSelectModel}
              onViewAllModels={() => handleNavigate('models')}
            />
            <ExperienceShowcase />
            <SpotlightBanner
              onLearnMore={(slug) => handleSelectModel(slug)}
              onConfigure={(slug) => handleConfigureModel(slug)}
            />
            <ConfiguratorTeaser
              onStartConfigurator={() => handleConfigureModel('5-series')}
            />
            <QuickServicesBar onSelectService={handleQuickServiceAction} />
          </div>
        )}

        {currentView === 'models' && (
          <ModelsCatalogue
            onSelectModel={handleSelectModel}
            onConfigureModel={handleConfigureModel}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            onOpenCompare={() => handleNavigate('compare')}
          />
        )}

        {currentView === 'detail' && (
          <ModelDetailPage
            model={currentModel}
            onBack={() => handleNavigate('models')}
            onConfigure={(slug, variantId) => handleConfigureModel(slug, variantId)}
            onBookTestDrive={(modelId) => handleOpenTestDriveModal(modelId)}
            onToggleCompare={handleToggleCompare}
            isCompared={compareList.includes(currentModel.id)}
          />
        )}

        {currentView === 'configurator' && (
          <VehicleConfigurator
            initialModelSlug={activeModelSlug}
            initialVariantId={activeVariantId}
            loadedConfig={loadedConfig}
            onBack={() => handleNavigate('home')}
            onBookTestDriveWithBuild={(modelId, buildSummary) =>
              handleOpenTestDriveModal(modelId, undefined, buildSummary)
            }
            currentUserId={currentUser?.id}
          />
        )}

        {currentView === 'compare' && (
          <VehicleComparison
            compareIds={compareList}
            onRemoveFromCompare={handleToggleCompare}
            onAddToCompare={handleToggleCompare}
            onBack={() => handleNavigate('models')}
            onConfigure={handleConfigureModel}
            onBookTestDrive={(modelId) => handleOpenTestDriveModal(modelId)}
          />
        )}

        {currentView === 'dealers' && (
          <DealerLocator
            onBookTestDriveAtDealer={(dealerId) => handleOpenTestDriveModal(undefined, dealerId)}
            onContactDealer={() => handleOpenQuoteModal('general')}
          />
        )}

        {currentView === 'experience' && (
          <div className="pt-20">
            <ExperienceShowcase />
            <QuickServicesBar onSelectService={handleQuickServiceAction} />
          </div>
        )}

        {currentView === 'admin' && (
          <AdminDashboard currentUser={currentUser} onNavigate={handleNavigate} />
        )}
      </main>

      {/* Global Footer */}
      <MainFooter onNavigate={handleNavigate} />

      {/* Modals Container */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectModel={handleSelectModel}
        onOpenConfigurator={handleConfigureModel}
      />

      <UserAccountModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onLoadConfiguration={handleLoadConfiguration}
        onSelectModel={handleSelectModel}
      />

      <TestDriveModal
        isOpen={testDriveModalOpen}
        onClose={() => setTestDriveModalOpen(false)}
        defaultModelId={currentModel.id}
        defaultDealerId={selectedDealerId}
        configuredBuildSummary={configuredBuildSummary}
        userId={currentUser?.id}
      />

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        type={quoteType}
        defaultModelId={currentModel.id}
        userId={currentUser?.id}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
