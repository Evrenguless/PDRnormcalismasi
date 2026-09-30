import React from 'react';
import { ProvinceData, SchoolRecord, PolicyWeights } from '../types/pdr';
import { formatNum } from '../utils/normCalculations';
import { Users, AlertTriangle, Building2, CheckCircle2, TrendingUp, Compass, ArrowRight } from 'lucide-react';
import { DiscreteNormLadder } from './DiscreteNormLadder';
import { EducationalTiersComparisonPanel } from './EducationalTiersComparisonPanel';
import { CalculationTransparencyPanel } from './CalculationTransparencyPanel';
import { SensitivityAnalysisPanel } from './SensitivityAnalysisPanel';

interface OverviewStatsProps {
  provinces: ProvinceData[];
  schools: SchoolRecord[];
  weights: PolicyWeights;
  onNavigateToTab: (tab: 'map' | 'rural' | 'simulator' | 'code' | 'schools') => void;
}

export const OverviewStats: React.FC<OverviewStatsProps> = ({
  provinces,
  schools,
  weights,
  onNavigateToTab,
}) => {
  // Aggregate stats across 81 provinces
  const totalStudents = provinces.reduce((acc, p) => acc + p.totalStudents, 0);
  const totalSchools = provinces.reduce((acc, p) => acc + p.totalSchools, 0);
  const totalVillageSchools = provinces.reduce((acc, p) => acc + p.villageSchoolsCount, 0);
  const totalVillageStudents = provinces.reduce((acc, p) => acc + p.villageStudentsCount, 0);
  const currentCounselors = provinces.reduce((acc, p) => acc + p.currentCounselors, 0);
  const legislationNorm = provinces.reduce((acc, p) => acc + p.legislationNorm, 0);
  const weightedModelNorm = provinces.reduce((acc, p) => acc + p.weightedModelNorm, 0);

  const legislationDeficit = Math.max(0, legislationNorm - currentCounselors);
  const weightedDeficit = Math.max(0, weightedModelNorm - currentCounselors);
  const nationalCoverage = Math.round((currentCounselors / legislationNorm) * 100);
  const avgStudentsPerCounselor = Math.round(totalStudents / currentCounselors);

  // Critical provinces (coverage < 65% or SEGE tier 5-6 with high deficit)
  const criticalProvinces = provinces.filter(p => p.priorityLevel === 'Kritik Acil');
  const highPriorityProvinces = provinces.filter(p => p.priorityLevel === 'Yüksek Öncelik');

  return (
    <div className="space-y-8">
      {/* Top Banner & Context Note */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              <span>MEB Norm Kadro Yönetmeliği Analizi</span>
              <span aria-hidden="true">·</span>
              <span>2026/2027 Öğretim Yılı Durum Tespiti</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Türkiye Okul Rehberlik ve Psikolojik Danışmanlık (PDR) İhtiyaç Analizi
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-3xl">
              Mevcut MEB yönetmelik normu ile kırsal/köy okulları, mesleki eğitim ve özel eğitim dezavantaj katsayılarını
              içeren ağırlıklı personel ihtiyaç modeli karşılaştırması.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateToTab('simulator')}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              Katsayıları Simüle Et
            </button>
            <button
              onClick={() => onNavigateToTab('rural')}
              className="px-3.5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
            >
              Köy Okulları Raporu
            </button>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Toplam Öğrenci & Okul</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            {formatNum(totalStudents)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <span>{formatNum(totalSchools)} okul</span>
            <span aria-hidden="true">·</span>
            <span>81 İl Genelinde</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Görevdeki PDR Uzmanı</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            {formatNum(currentCounselors)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <span>1 Rehber / {avgStudentsPerCounselor} Öğrenci</span>
            <span aria-hidden="true">·</span>
            <span>OECD ort. 1 / 250</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Mevzuat Norm Açığı</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-600 tabular-nums">
            {formatNum(legislationDeficit)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <span>Yönetmelik Normu: {formatNum(legislationNorm)}</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-700 font-medium">%{nationalCoverage} doluluk</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Kırsal & Ağırlıklı Model Açığı</span>
            <TrendingUp className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600 tabular-nums">
            {formatNum(weightedDeficit)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <span>Hedef Norm: {formatNum(weightedModelNorm)}</span>
            <span aria-hidden="true">·</span>
            <span>+{formatNum(weightedDeficit - legislationDeficit)} köy/risk açığı</span>
          </div>
        </div>
      </div>

      {/* Primary Comparative Framework: Mevzuat vs Ağırlıklı Model */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Model Comparison Card */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Mevzuat Yönetmeliği ile Ağırlıklı Planlama Modeli Karşılaştırması
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Klasik mevzuat öğrenci eşiği (İlkokul: 100/300, Orta/Lise: 150) ile kırsal ve sosyoekonomik çarpanlı model
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Aktif Köy Çarpanı</span>
              <div className="text-sm font-bold font-mono text-indigo-600">{weights.villageTownMultiplier.toFixed(2)}x</div>
            </div>
          </div>

          {/* Visual Bar Comparison */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span className="font-medium">Mevcut Kadrolu Rehber Öğretmen</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900">{formatNum(currentCounselors)} kişi</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div
                  className="bg-slate-700 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(currentCounselors / weightedModelNorm) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span className="font-medium">Mevcut MEB Norm Kadro Yönetmeliği</span>
                <span className="font-mono tabular-nums font-semibold text-amber-700">{formatNum(legislationNorm)} norm (Açık: {formatNum(legislationDeficit)})</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div
                  className="bg-amber-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(legislationNorm / weightedModelNorm) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span className="font-medium">Köy/Kasaba & Çok Faktörlü Ağırlıklı İhtiyaç Modeli</span>
                <span className="font-mono tabular-nums font-semibold text-rose-700">{formatNum(weightedModelNorm)} norm (Net Açık: {formatNum(weightedDeficit)})</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div
                  className="bg-rose-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>

          {/* The Structural Blind Spot Explanation */}
          <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-xs text-slate-700 space-y-2">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Mevzuatın Yapısal Kırsal Körü: Köy Okullarında Rehbersiz Nüfus</span>
            </div>
            <p>
              Mevcut yönetmelikte ortaokul ve liselerde 150, ilkokullarda ise 100 öğrencinin altındaki kurumlara norm tahsis
              edilmemektedir. Türkiye genelinde bulunan <strong>{formatNum(totalVillageSchools)} köy ve kasaba okulunda</strong> eğitim gören
              yaklaşık <strong>{formatNum(totalVillageStudents)} öğrenci</strong> bu eşiği tek başına aşamadığı için okulunda
              kadrolu bir psikolojik danışmana doğrudan erişememektedir.
            </p>
            <div className="flex items-center gap-4 pt-1 font-medium text-indigo-700">
              <button
                onClick={() => onNavigateToTab('rural')}
                className="hover:underline flex items-center gap-1"
              >
                Gezici Rehberlik Hub Simülasyonunu İncele <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: High Risk Provinces Ranking */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">En Acil İhtiyaç Duyulan İller</h3>
              <p className="text-xs text-slate-500">PDR doluluk oranı en düşük 5 il</p>
            </div>
            <button
              onClick={() => onNavigateToTab('map')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Tümünü Gör
            </button>
          </div>

          <div className="space-y-3">
            {provinces
              .slice()
              .sort((a, b) => a.coverageRate - b.coverageRate)
              .slice(0, 5)
              .map((p) => (
                <div key={p.plateCode} className="p-2.5 rounded border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{p.name} ({p.plateCode})</span>
                    <span className="font-mono tabular-nums font-semibold text-rose-600">%{p.coverageRate} Doluluk</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Öğrenci: {formatNum(p.totalStudents)}</span>
                    <span>Açık: <strong className="text-slate-800 font-mono tabular-nums">{formatNum(p.weightedDeficit)}</strong></span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    1 PDR / {p.studentsPerCounselor} Öğrenci · {p.villageSchoolsCount} Köy Okulu
                  </div>
                </div>
              ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
            <span>Kritik İl Sayısı: <strong className="text-rose-600">{criticalProvinces.length} il</strong></span>
            <span>Yüksek Öncelik: <strong className="text-amber-600">{highPriorityProvinces.length} il</strong></span>
          </div>
        </div>
      </div>

      {/* Educational Tiers Breakdown (İlköğretim, Ortaöğretim, Meslek Liseleri) */}
      <EducationalTiersComparisonPanel />

      {/* Calculation Transparency & Regulation Triggers Panel */}
      <CalculationTransparencyPanel />

      {/* Discrete Norm Ladder & School Calculator Component */}
      <DiscreteNormLadder weights={weights} />

      {/* Sensitivity Analysis (±%10 Multiplier Elasticity Matrix) */}
      <SensitivityAnalysisPanel />

      {/* Model Weight Parameters Quick-Summary */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Analizde Uygulanan Politika Ağırlık Katsayıları & Metodoloji
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <div className="text-slate-500">Köy/Kasaba Çarpanı</div>
            <div className="text-lg font-bold font-mono text-slate-900 mt-1">{weights.villageTownMultiplier.toFixed(2)}x</div>
            <div className="text-[11px] text-slate-500 mt-1">Taşımalı ve kırsal bölge</div>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <div className="text-slate-500">Özel Eğitim / RAM</div>
            <div className="text-lg font-bold font-mono text-slate-900 mt-1">{weights.specialEducationMultiplier.toFixed(2)}x</div>
            <div className="text-[11px] text-slate-500 mt-1">Bireysel takip ihtiyacı</div>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <div className="text-slate-500">MTAL Mesleki Eğitim</div>
            <div className="text-lg font-bold font-mono text-slate-900 mt-1">{weights.mtalVocationalMultiplier.toFixed(2)}x</div>
            <div className="text-[11px] text-slate-500 mt-1">Staj, iş sağlığı, ergenlik</div>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <div className="text-slate-500">İlkokul Erken Müdahale</div>
            <div className="text-lg font-bold font-mono text-slate-900 mt-1">{weights.primarySchoolEarlyInterventionMultiplier.toFixed(2)}x</div>
            <div className="text-[11px] text-slate-500 mt-1">100 taban eşiği ile</div>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <div className="text-slate-500">SEGE Dezavantaj Çarpanı</div>
            <div className="text-lg font-bold font-mono text-slate-900 mt-1">{weights.disadvantagedSegeMultiplier.toFixed(2)}x</div>
            <div className="text-[11px] text-slate-500 mt-1">5. ve 6. Kademe iller</div>
          </div>
        </div>
      </div>
    </div>
  );
};
