/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { PolicyWeights } from './types/pdr';
import { DEFAULT_POLICY_WEIGHTS } from './utils/normCalculations';
import { compileProvincesData } from './data/provincesData';
import { compileSchoolsData } from './data/schoolsData';
import { Header, NavTab } from './components/Header';
import { OverviewStats } from './components/OverviewStats';
import { InteractiveMap } from './components/InteractiveMap';
import { VillageSchoolsAnalysis } from './components/VillageSchoolsAnalysis';
import { ModelSimulator } from './components/ModelSimulator';
import { CodeEngineView } from './components/CodeEngineView';
import { SchoolsTable } from './components/SchoolsTable';
import { InstitutionalReportView } from './components/InstitutionalReportView';
import { PolicyReportModal } from './components/PolicyReportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [weights, setWeights] = useState<PolicyWeights>(DEFAULT_POLICY_WEIGHTS);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState<string | undefined>(undefined);

  // Recompile dynamically when weights change
  const provinces = useMemo(() => compileProvincesData(weights), [weights]);
  const schools = useMemo(() => compileSchoolsData(weights), [weights]);

  const handleUpdateWeights = (updated: Partial<PolicyWeights>) => {
    setWeights((prev) => ({ ...prev, ...updated }));
  };

  const handleResetWeights = () => {
    setWeights(DEFAULT_POLICY_WEIGHTS);
  };

  const handleSelectProvinceForSchools = (provinceName: string) => {
    setSelectedProvinceFilter(provinceName);
    setActiveTab('schools');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewStats
            provinces={provinces}
            schools={schools}
            weights={weights}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
            }}
          />
        )}

        {activeTab === 'map' && (
          <InteractiveMap
            provinces={provinces}
            schools={schools}
            onSelectProvinceForSchools={handleSelectProvinceForSchools}
          />
        )}

        {activeTab === 'rural' && (
          <VillageSchoolsAnalysis
            provinces={provinces}
            schools={schools}
            weights={weights}
            onUpdateWeights={handleUpdateWeights}
          />
        )}

        {activeTab === 'simulator' && (
          <ModelSimulator
            weights={weights}
            onUpdateWeights={handleUpdateWeights}
            onResetWeights={handleResetWeights}
            provinces={provinces}
            schools={schools}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'code' && (
          <CodeEngineView
            provinces={provinces}
            weights={weights}
          />
        )}

        {activeTab === 'schools' && (
          <SchoolsTable
            schools={schools}
            initialProvinceFilter={selectedProvinceFilter}
            onClearInitialProvinceFilter={() => setSelectedProvinceFilter(undefined)}
          />
        )}

        {activeTab === 'report' && (
          <InstitutionalReportView
            provinces={provinces}
            schools={schools}
            weights={weights}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">MEB PDR Norm & İhtiyaç Analitik Platformu</span>
            <span aria-hidden="true">·</span>
            <span>Millî Eğitim İstatistikleri & MEB Norm Kadro Yönetmeliği</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>R tidyverse & sf</span>
            <span aria-hidden="true">/</span>
            <span>Python statsmodels & scikit-learn</span>
            <span aria-hidden="true">/</span>
            <span>2026 Projeksiyon Modeli</span>
          </div>
        </div>
      </footer>

      {/* Policy Report Modal for Decision Makers */}
      <PolicyReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        provinces={provinces}
        weights={weights}
      />
    </div>
  );
}
