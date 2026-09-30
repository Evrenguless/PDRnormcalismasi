import React, { useState } from 'react';
import { PolicyWeights } from '../types/pdr';
import { formatNum } from '../utils/normCalculations';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Building2,
  CheckCircle2,
  HelpCircle,
  FileText,
  Layers,
  Scale
} from 'lucide-react';

export interface ReformScenario {
  id: string;
  name: string;
  codeName: string;
  tag: string;
  description: string;
  ruleSummary: string;
  primaryThreshold: number;
  secondaryThreshold: number;
  stepSize: number;
  zeroThreshold: boolean;
  totalNorm: number;
  totalDeficit: number;
  incrementalDeficit: number;
  coverageRate: number;
  zeroNormSchools: number;
  studentsPerCounselor: number;
  annualBudgetDeltaBillionTL: number;
  feasibility: 'Yüksek' | 'Orta' | 'Düşük Maliyet/Kolay' | 'Yüksek Bütçe Gerektirir';
  unionSupport: string;
}

export const REFORM_SCENARIOS: ReformScenario[] = [
  {
    id: 'baseline',
    name: 'Mevcut Durum (Yürürlükteki Madde 21)',
    codeName: 'BASELINE_CURRENT',
    tag: 'Yürürlükte',
    description: 'Resmî Gazete’de yayımlanan yürürlükteki mevzuat: İlkokulda 300, ortaokul/lisede 150 tabanı ve 500 katları.',
    ruleSummary: 'İlkokul: 300 taban + her 500 katı | Ortaokul/Lise: 150 taban + her 500 katı',
    primaryThreshold: 300,
    secondaryThreshold: 150,
    stepSize: 500,
    zeroThreshold: false,
    totalNorm: 72445,
    totalDeficit: 24635,
    incrementalDeficit: 0,
    coverageRate: 66,
    zeroNormSchools: 11480,
    studentsPerCounselor: 393,
    annualBudgetDeltaBillionTL: 0,
    feasibility: 'Yüksek',
    unionSupport: 'Mevcut mevzuat; yetersiz bulunduğu için sendikalarca dava konusu edilmektedir.',
  },
  {
    id: 'scenario_1',
    name: 'Senaryo 1: Her Okula 1 Norm + 250’nin Katları',
    codeName: 'SCENARIO_UNIVERSAL_250',
    tag: 'En Kapsamlı / Radikal Reform',
    description: 'Öğrenci sayısı ne olursa olsun (köy okulları dahil) tüm bağımsız okullara 1 norm; sonrasında her 250 öğrencide +1 ilave norm.',
    ruleSummary: 'Sıfır Baraj (Her okula 1 taban) + Her 250 öğrencide +1 ilave norm',
    primaryThreshold: 1,
    secondaryThreshold: 1,
    stepSize: 250,
    zeroThreshold: true,
    totalNorm: 102500,
    totalDeficit: 54690,
    incrementalDeficit: 30055,
    coverageRate: 47,
    zeroNormSchools: 0,
    studentsPerCounselor: 183,
    annualBudgetDeltaBillionTL: 24.5,
    feasibility: 'Yüksek Bütçe Gerektirir',
    unionSupport: 'PDR dernekleri ve eğitim sendikalarının azami ideali; köy okullarını tamamen kapsar.',
  },
  {
    id: 'scenario_2',
    name: 'Senaryo 2: 100 Tabanı + 250’nin Katları',
    codeName: 'SCENARIO_100_BASE_250_STEP',
    tag: 'Sendikaların Ortak Teklifi',
    description: 'Tüm kademelerde taban 100 öğrenciye çekilir (küçük köy okulları hariç beldeler ve kasabalar girer); artış katı 250 olur.',
    ruleSummary: 'Tüm Kademeler: 100 taban + her 250 öğrencide +1 ilave norm',
    primaryThreshold: 100,
    secondaryThreshold: 100,
    stepSize: 250,
    zeroThreshold: false,
    totalNorm: 94800,
    totalDeficit: 46990,
    incrementalDeficit: 22355,
    coverageRate: 50,
    zeroNormSchools: 4540,
    studentsPerCounselor: 198,
    annualBudgetDeltaBillionTL: 18.2,
    feasibility: 'Orta',
    unionSupport: 'Eğitim-Bir-Sen, Türk Eğitim-Sen ve Eğitim-İş’in MEB görüşmelerindeki ortak revizyon teklifi.',
  },
  {
    id: 'scenario_3',
    name: 'Senaryo 3: İlkokul 150 Tabanı + 300’ün Katları',
    codeName: 'SCENARIO_150_BASE_300_STEP',
    tag: 'Bakanlık Kulis Taslağı (Ölçülü)',
    description: 'İlkokul tabanı 300’den 150’ye indirilerek ortaokulla eşitlenir; 500 kat basamağı 300’e çekilir.',
    ruleSummary: 'İlkokul & Ortaokul: 150 taban + her 300 öğrencide +1 ilave norm',
    primaryThreshold: 150,
    secondaryThreshold: 150,
    stepSize: 300,
    zeroThreshold: false,
    totalNorm: 86200,
    totalDeficit: 38390,
    incrementalDeficit: 13755,
    coverageRate: 55,
    zeroNormSchools: 7200,
    studentsPerCounselor: 218,
    annualBudgetDeltaBillionTL: 11.2,
    feasibility: 'Yüksek',
    unionSupport: 'Maliye Bakanlığı kadro sınırları ve MEB bürokrasisinin üzerinde çalıştığı uzlaşma formülü.',
  },
  {
    id: 'scenario_4',
    name: 'Senaryo 4: OECD Standardı (1/250) + Gezici Hub',
    codeName: 'SCENARIO_OECD_HUB',
    tag: 'Uluslararası Standart',
    description: 'Okul türünden bağımsız her 250 öğrenciye 1 danışman tavanı + baraj altı kalan kırsal okullara 3 okula 1 Gezici Koordinatör.',
    ruleSummary: '1 Rehber / 250 Öğrenci (Öğrenci Tavanı) + 3 Köy Okuluna 1 Gezici Hub',
    primaryThreshold: 100,
    secondaryThreshold: 100,
    stepSize: 250,
    zeroThreshold: false,
    totalNorm: 79000,
    totalDeficit: 31190,
    incrementalDeficit: 6555,
    coverageRate: 61,
    zeroNormSchools: 0,
    studentsPerCounselor: 238,
    annualBudgetDeltaBillionTL: 5.3,
    feasibility: 'Düşük Maliyet/Kolay',
    unionSupport: 'Akademik PDR çevreleri ve kalkınma planı hedeflerine en uygun pedagojik model.',
  },
  {
    id: 'scenario_5',
    name: 'Senaryo 5: Her Okula 1 Norm + 500’ün Katları',
    codeName: 'SCENARIO_ZERO_THRESHOLD_500_STEP',
    tag: 'Kırsal Baraj İptali',
    description: 'Mevcut 500 kat artış basamağı korunur; yalnızca 150 ve 300 barajları kaldırılarak her bağımsız kuruma en az 1 norm verilir.',
    ruleSummary: 'Sıfır Baraj (Her köye/okula 1 norm) + Her 500 öğrencide +1 kat',
    primaryThreshold: 1,
    secondaryThreshold: 1,
    stepSize: 500,
    zeroThreshold: true,
    totalNorm: 83920,
    totalDeficit: 36110,
    incrementalDeficit: 11475,
    coverageRate: 57,
    zeroNormSchools: 0,
    studentsPerCounselor: 224,
    annualBudgetDeltaBillionTL: 9.4,
    feasibility: 'Orta',
    unionSupport: 'Köy okullarını canlandırma ve birleştirilmiş sınıflara doğrudan destek projesi.',
  },
];

interface MEBReformScenariosProps {
  onApplyScenarioToWeights?: (weights: Partial<PolicyWeights>) => void;
  onNavigateToCode?: () => void;
}

export const MEBReformScenarios: React.FC<MEBReformScenariosProps> = ({
  onApplyScenarioToWeights,
  onNavigateToCode,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scenario_2');
  const activeScenario = REFORM_SCENARIOS.find((s) => s.id === selectedScenarioId) || REFORM_SCENARIOS[1];

  const handleApply = (scenario: ReformScenario) => {
    if (!onApplyScenarioToWeights) return;
    if (scenario.id === 'baseline') {
      onApplyScenarioToWeights({
        minPrimaryThreshold: 300,
        minSecondaryThreshold: 150,
        incrementalStepPrimary: 500,
        incrementalStepSecondary: 500,
        villageTownMultiplier: 1.0,
      });
    } else if (scenario.id === 'scenario_1') {
      onApplyScenarioToWeights({
        minPrimaryThreshold: 1,
        minSecondaryThreshold: 1,
        incrementalStepPrimary: 250,
        incrementalStepSecondary: 250,
        villageTownMultiplier: 1.9,
      });
    } else if (scenario.id === 'scenario_2') {
      onApplyScenarioToWeights({
        minPrimaryThreshold: 100,
        minSecondaryThreshold: 100,
        incrementalStepPrimary: 250,
        incrementalStepSecondary: 250,
        villageTownMultiplier: 1.6,
      });
    } else if (scenario.id === 'scenario_3') {
      onApplyScenarioToWeights({
        minPrimaryThreshold: 150,
        minSecondaryThreshold: 150,
        incrementalStepPrimary: 300,
        incrementalStepSecondary: 300,
        villageTownMultiplier: 1.4,
      });
    } else if (scenario.id === 'scenario_4') {
      onApplyScenarioToWeights({
        minPrimaryThreshold: 100,
        minSecondaryThreshold: 100,
        incrementalStepPrimary: 250,
        incrementalStepSecondary: 250,
        villageTownMultiplier: 1.5,
      });
    } else if (scenario.id === 'scenario_5') {
      onApplyScenarioToWeights({
        minPrimaryThreshold: 1,
        minSecondaryThreshold: 1,
        incrementalStepPrimary: 500,
        incrementalStepSecondary: 500,
        villageTownMultiplier: 1.7,
      });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
            <Scale className="w-4 h-4 text-indigo-600" />
            <span>MEB Norm Reformu ve Kulis Senaryoları Karşılaştırma Matrisi</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            "Yönetmelik Değişirse Ne Kadar Açık Oluşur?" (Kulis ve Taslak Yordaması)
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Millî Eğitim Bakanlığı ve sendikalar arasında tartışılan 5 farklı norm formülünün
            yaratacağı ilave kadro açığı, bütçe yükü ve köy okulları etkisi.
          </p>
        </div>

        {onNavigateToCode && (
          <button
            onClick={onNavigateToCode}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>R ve Python Kodunu Aç</span>
          </button>
        )}
      </div>

      {/* Scenario Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {REFORM_SCENARIOS.map((sc) => {
          const isSelected = sc.id === selectedScenarioId;
          return (
            <button
              key={sc.id}
              onClick={() => setSelectedScenarioId(sc.id)}
              className={`text-left p-2.5 rounded-lg border text-xs transition-all relative ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="text-[10px] font-semibold text-slate-500 truncate">{sc.tag}</div>
              <div className={`font-bold mt-0.5 text-xs ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
                {sc.name.split(':')[0]}
              </div>
              <div className="mt-1 font-mono text-[11px] font-bold text-slate-700">
                {formatNum(sc.totalNorm)} Kadro
              </div>
              <div className={`text-[10px] font-medium mt-0.5 ${
                sc.incrementalDeficit > 0 ? 'text-rose-600' : 'text-slate-500'
              }`}>
                {sc.incrementalDeficit > 0 ? `+${formatNum(sc.incrementalDeficit)} Ek Açık` : 'Mevcut Baz'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Scenario Detail Card */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded font-bold bg-indigo-100 text-indigo-800">
                {activeScenario.tag}
              </span>
              <h3 className="text-base font-bold text-slate-900">{activeScenario.name}</h3>
            </div>
            <p className="text-xs text-slate-600 mt-1">{activeScenario.description}</p>
          </div>

          {onApplyScenarioToWeights && (
            <button
              onClick={() => handleApply(activeScenario)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-sm transition-colors shrink-0"
            >
              <span>Bu Senaryoyu Simülatöre Yükle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 4 Key Numerical Impacts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded">
            <div className="text-slate-500 text-[11px]">Toplam Yasal Norm</div>
            <div className="text-lg font-extrabold font-mono text-slate-900 mt-0.5 tabular-nums">
              {formatNum(activeScenario.totalNorm)}
            </div>
            <div className="text-[11px] text-slate-500">Mevcut: 72.445 Norm</div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded">
            <div className="text-slate-500 text-[11px]">Toplam Kadro Açığı</div>
            <div className="text-lg font-extrabold font-mono text-rose-600 mt-0.5 tabular-nums">
              -{formatNum(activeScenario.totalDeficit)}
            </div>
            <div className="text-[11px] text-slate-500">Mevcut çalışan: 47.810</div>
          </div>

          <div className="p-3 bg-white border border-rose-200 bg-rose-50/20 rounded">
            <div className="text-rose-900 font-semibold text-[11px]">Mevcut Açığa İlave Fark</div>
            <div className="text-lg font-extrabold font-mono text-rose-700 mt-0.5 tabular-nums">
              {activeScenario.incrementalDeficit > 0 ? `+${formatNum(activeScenario.incrementalDeficit)} Kişi` : '0 (Mevcut)'}
            </div>
            <div className="text-[11px] text-rose-600 font-medium">Yeni atama ihtiyacı</div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded">
            <div className="text-slate-500 text-[11px]">Baraj Altı Okul (0 Norm)</div>
            <div className="text-lg font-extrabold font-mono text-amber-700 mt-0.5 tabular-nums">
              {activeScenario.zeroNormSchools === 0 ? '0 Okul (Tam Kapsama)' : `${formatNum(activeScenario.zeroNormSchools)} Okul`}
            </div>
            <div className="text-[11px] text-slate-500">
              {activeScenario.zeroNormSchools === 0
                ? 'Tüm köy okulları norm kazandı!'
                : `${formatNum(11480 - activeScenario.zeroNormSchools)} okula yeni norm`}
            </div>
          </div>
        </div>

        {/* Narrative & Practical Impact Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-3 bg-white border border-slate-200 rounded space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Uygulanacak Kural & Matematik Formülü:</span>
            </div>
            <p className="text-slate-700 font-mono text-[11px] bg-slate-50 p-2 rounded border border-slate-100">
              {activeScenario.ruleSummary}
            </p>
            <div className="text-[11px] text-slate-600">
              <strong>Danışman Başına Öğrenci:</strong> 1 Rehber / {activeScenario.studentsPerCounselor} Öğrenci (OECD Standardı: 1/250)
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Kulis Durumu & Bütçe Uygulanabilirliği:</span>
            </div>
            <div className="text-[11px] text-slate-700">
              <strong>Sendika Duruşu:</strong> {activeScenario.unionSupport}
            </div>
            <div className="text-[11px] text-slate-700">
              <strong>Maliye Yıllık Ek Maliyet:</strong>{' '}
              <span className="font-mono font-bold text-indigo-900">
                {activeScenario.annualBudgetDeltaBillionTL > 0
                  ? `~${activeScenario.annualBudgetDeltaBillionTL} Milyar TL / Yıl`
                  : '0 TL (Mevcut Bütçe)'}
              </span>{' '}
              · Uygulanabilirlik: <strong>{activeScenario.feasibility}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Scenario Comparison Table */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          <span>Tüm Senaryoların Karşılaştırmalı Bilanço Tablosu</span>
        </h3>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Senaryo / Kural</th>
                <th className="py-2.5 px-2.5 text-center">Taban Eşiği</th>
                <th className="py-2.5 px-2.5 text-center">Kat Artışı</th>
                <th className="py-2.5 px-3 text-right">Toplam Norm</th>
                <th className="py-2.5 px-3 text-right text-rose-700">Toplam Açık</th>
                <th className="py-2.5 px-3 text-right text-indigo-700 font-bold">Mevcut Açığa İlave Fark</th>
                <th className="py-2.5 px-2.5 text-center">Doluluk</th>
                <th className="py-2.5 px-3 text-center">0 Normlu Okul</th>
                <th className="py-2.5 px-2.5 text-center">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {REFORM_SCENARIOS.map((sc) => {
                const isSelected = sc.id === selectedScenarioId;
                return (
                  <tr
                    key={sc.id}
                    onClick={() => setSelectedScenarioId(sc.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-50/80 font-medium'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{sc.name}</div>
                      <div className="text-[11px] text-slate-500">{sc.tag}</div>
                    </td>
                    <td className="py-2.5 px-2.5 text-center font-mono tabular-nums">
                      {sc.zeroThreshold ? 'Sıfır Baraj' : `${sc.primaryThreshold} Öğrenci`}
                    </td>
                    <td className="py-2.5 px-2.5 text-center font-mono tabular-nums font-semibold">
                      +{sc.stepSize} Öğrenci
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-slate-900">
                      {formatNum(sc.totalNorm)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-rose-700">
                      -{formatNum(sc.totalDeficit)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-extrabold text-indigo-900 whitespace-nowrap">
                      {sc.incrementalDeficit > 0 ? `+${formatNum(sc.incrementalDeficit)} Yeni Açık` : 'Mevcut Baz'}
                    </td>
                    <td className="py-2.5 px-2.5 text-center font-mono tabular-nums">
                      %{sc.coverageRate}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono tabular-nums text-slate-600">
                      {sc.zeroNormSchools === 0 ? (
                        <span className="text-emerald-700 font-bold">0 Okul (Tam Kapsama)</span>
                      ) : (
                        `${formatNum(sc.zeroNormSchools)} Okul`
                      )}
                    </td>
                    <td className="py-2.5 px-2.5 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedScenarioId(sc.id);
                          handleApply(sc);
                        }}
                        className="px-2 py-1 text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-100/70 hover:bg-indigo-200/80 rounded transition-colors"
                      >
                        Uygula
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
