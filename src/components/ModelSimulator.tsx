import React from 'react';
import { PolicyWeights, ProvinceData, SchoolRecord } from '../types/pdr';
import { DEFAULT_POLICY_WEIGHTS, formatNum } from '../utils/normCalculations';
import { Sliders, RotateCcw, TrendingUp, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { MEBReformScenarios } from './MEBReformScenarios';
import { SensitivityAnalysisPanel } from './SensitivityAnalysisPanel';

interface ModelSimulatorProps {
  weights: PolicyWeights;
  onUpdateWeights: (updated: Partial<PolicyWeights>) => void;
  onResetWeights: () => void;
  provinces: ProvinceData[];
  schools: SchoolRecord[];
  onNavigateToTab?: (tab: 'code' | 'map' | 'rural' | 'schools' | 'overview') => void;
}

export const ModelSimulator: React.FC<ModelSimulatorProps> = ({
  weights,
  onUpdateWeights,
  onResetWeights,
  provinces,
  schools,
  onNavigateToTab,
}) => {
  // Aggregate stats under current weights
  const totalNationalNorm = provinces.reduce((acc, p) => acc + p.weightedModelNorm, 0);
  const totalLegislationNorm = provinces.reduce((acc, p) => acc + p.legislationNorm, 0);
  const currentCounselors = provinces.reduce((acc, p) => acc + p.currentCounselors, 0);
  const totalNationalDeficit = Math.max(0, totalNationalNorm - currentCounselors);
  const incrementalNeeds = Math.max(0, totalNationalNorm - totalLegislationNorm);

  // Financial estimation
  const averageAnnualSalaryTL = 68000 * 12; // ~816,000 TL per counselor/year
  const totalDeficitBudgetMillionTL = Math.round((totalNationalDeficit * averageAnnualSalaryTL) / 1_000_000);

  // Preset scenarios
  const applyPreset = (preset: 'default' | 'strict_legislation' | 'maximum_equity' | 'rural_focus') => {
    switch (preset) {
      case 'strict_legislation':
        onUpdateWeights({
          villageTownMultiplier: 1.0,
          specialEducationMultiplier: 1.0,
          mtalVocationalMultiplier: 1.0,
          primarySchoolEarlyInterventionMultiplier: 1.0,
          disadvantagedSegeMultiplier: 1.0,
          minPrimaryThreshold: 300,
          minSecondaryThreshold: 150,
        });
        break;
      case 'maximum_equity':
        onUpdateWeights({
          villageTownMultiplier: 1.80,
          specialEducationMultiplier: 2.50,
          mtalVocationalMultiplier: 1.50,
          primarySchoolEarlyInterventionMultiplier: 1.40,
          disadvantagedSegeMultiplier: 1.45,
          minPrimaryThreshold: 100,
          minSecondaryThreshold: 120,
        });
        break;
      case 'rural_focus':
        onUpdateWeights({
          villageTownMultiplier: 2.0,
          specialEducationMultiplier: 2.0,
          mtalVocationalMultiplier: 1.25,
          primarySchoolEarlyInterventionMultiplier: 1.2,
          disadvantagedSegeMultiplier: 1.5,
          minPrimaryThreshold: 100,
          minSecondaryThreshold: 150,
        });
        break;
      case 'default':
      default:
        onResetWeights();
        break;
    }
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
              <span>Personel İhtiyaç Planlama Simülatörü</span>
              <span aria-hidden="true">·</span>
              <span>Dinamik Politika Katsayıları</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Ağırlıklı Katsayılarla PDR Norm Kadro İhtiyaç Simülasyonu
            </h2>
            <p className="mt-1 text-xs text-slate-600 max-w-3xl">
              Okul türleri, kırsal yerleşim ve bölgesel sosyoekonomik faktörleri değiştirerek Türkiye geneli ve 81 ildeki
              PDR kadro ihtiyacını anlık olarak simüle edin.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => applyPreset('default')}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
            >
              Önerilen Model
            </button>
            <button
              onClick={() => applyPreset('rural_focus')}
              className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
            >
              Köy/Kırsal Öncelikli
            </button>
            <button
              onClick={() => applyPreset('maximum_equity')}
              className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors"
            >
              Maksimum Kapsayıcılık
            </button>
            <button
              onClick={() => applyPreset('strict_legislation')}
              className="px-3 py-1.5 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 rounded transition-colors"
            >
              Klasik Mevzuat Tabanı
            </button>
          </div>
        </div>
      </div>

      {/* MEB Reform Rumors & Draft Scenarios Forecasting Matrix */}
      <MEBReformScenarios
        onApplyScenarioToWeights={onUpdateWeights}
        onNavigateToCode={() => onNavigateToTab?.('code')}
      />

      {/* Main Simulation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              Politika Katsayıları & Ağırlık Ayarları
            </h3>
            <button
              onClick={onResetWeights}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Sıfırla
            </button>
          </div>

          <div className="space-y-5 text-xs">
            {/* Slider 1: Village & Town Multiplier */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-800">
                  1. Köy ve Kasaba Okulları Çarpanı (Kırsal Ağırlık):
                </label>
                <span className="font-mono tabular-nums font-bold text-indigo-600 text-sm">
                  {weights.villageTownMultiplier.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.5"
                step="0.05"
                value={weights.villageTownMultiplier}
                onChange={(e) => onUpdateWeights({ villageTownMultiplier: parseFloat(e.target.value) })}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>1.0x (Mevcut Standart)</span>
                <span>1.55x (Tavsiye Edilen)</span>
                <span>2.5x (Maksimum Gezici Kadro)</span>
              </div>
            </div>

            {/* Slider 2: Special Education Multiplier */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-800">
                  2. Özel Eğitim & RAM Çarpanı:
                </label>
                <span className="font-mono tabular-nums font-bold text-indigo-600 text-sm">
                  {weights.specialEducationMultiplier.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.1"
                value={weights.specialEducationMultiplier}
                onChange={(e) => onUpdateWeights({ specialEducationMultiplier: parseFloat(e.target.value) })}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>1.0x</span>
                <span>2.2x (Yoğun Bireysel Takip)</span>
                <span>3.0x</span>
              </div>
            </div>

            {/* Slider 3: MTAL Multiplier */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-800">
                  3. Mesleki ve Teknik Anadolu Lisesi (MTAL) Çarpanı:
                </label>
                <span className="font-mono tabular-nums font-bold text-indigo-600 text-sm">
                  {weights.mtalVocationalMultiplier.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.0"
                step="0.05"
                value={weights.mtalVocationalMultiplier}
                onChange={(e) => onUpdateWeights({ mtalVocationalMultiplier: parseFloat(e.target.value) })}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>1.0x (Eşit Norm)</span>
                <span>1.35x (Staj, İSG ve Kariyer Yönlendirme)</span>
                <span>2.0x</span>
              </div>
            </div>

            {/* Slider 4: Primary School Early Intervention */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-800">
                  4. İlkokul Erken Müdahale & Karakter Gelişimi Çarpanı:
                </label>
                <span className="font-mono tabular-nums font-bold text-indigo-600 text-sm">
                  {weights.primarySchoolEarlyInterventionMultiplier.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.0"
                step="0.05"
                value={weights.primarySchoolEarlyInterventionMultiplier}
                onChange={(e) => onUpdateWeights({ primarySchoolEarlyInterventionMultiplier: parseFloat(e.target.value) })}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>1.0x</span>
                <span>1.25x (İlkokulda Önleyici PDR)</span>
                <span>2.0x</span>
              </div>
            </div>

            {/* Slider 5: SEGE Disadvantage Multiplier */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-800">
                  5. SEGE 5. ve 6. Kademe (Dezavantajlı Bölge) İlleri Çarpanı:
                </label>
                <span className="font-mono tabular-nums font-bold text-indigo-600 text-sm">
                  {weights.disadvantagedSegeMultiplier.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.0"
                step="0.05"
                value={weights.disadvantagedSegeMultiplier}
                onChange={(e) => onUpdateWeights({ disadvantagedSegeMultiplier: parseFloat(e.target.value) })}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>1.0x (Bölgesel Fark Yok)</span>
                <span>1.30x (Güneydoğu ve Doğu Takviyesi)</span>
                <span>2.0x</span>
              </div>
            </div>

            {/* Threshold toggle */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800">İlkokul Taban Norm Eşiği (Öğrenci Sayısı):</span>
                <p className="text-[11px] text-slate-500">Mevzuat değişikliği ile 300'den 100'e çekilen eşik</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateWeights({ minPrimaryThreshold: 100 })}
                  className={`px-2.5 py-1 text-xs rounded font-medium ${
                    weights.minPrimaryThreshold === 100
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  100 Öğrenci (Yeni MEB)
                </button>
                <button
                  onClick={() => onUpdateWeights({ minPrimaryThreshold: 300 })}
                  className={`px-2.5 py-1 text-xs rounded font-medium ${
                    weights.minPrimaryThreshold === 300
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  300 Öğrenci (Eski)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Dynamic Output & Policy KPI Impact (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Simülasyon Sonuçları & Ulusal Kadro İhtiyacı
              </h3>
              <p className="text-xs text-slate-500">
                Seçilen katsayılarla anlık olarak hesaplanan personel gereksinimi
              </p>
            </div>

            {/* Big Metrics */}
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 rounded border border-slate-200 flex justify-between items-center">
                <div>
                  <div className="text-xs text-slate-500">Toplam Hedef Norm Kadrosu</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                    {formatNum(totalNationalNorm)}
                  </div>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <div>Mevzuat: {formatNum(totalLegislationNorm)}</div>
                  <div className="text-indigo-600 font-semibold font-mono tabular-nums mt-0.5">
                    +{formatNum(incrementalNeeds)} ilave norm
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-rose-50/60 rounded border border-rose-200 flex justify-between items-center">
                <div>
                  <div className="text-xs text-rose-800">Net Kadro Açığı (İhtiyaç)</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-rose-600 mt-0.5">
                    {formatNum(totalNationalDeficit)}
                  </div>
                </div>
                <div className="text-right text-xs text-rose-700">
                  <div>Mevcut: {formatNum(currentCounselors)}</div>
                  <div className="text-[11px] font-semibold mt-0.5">
                    %{Math.round((currentCounselors / totalNationalNorm) * 100)} Karşılama
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50/60 rounded border border-emerald-200 flex justify-between items-center">
                <div>
                  <div className="text-xs text-emerald-800">Tahmini Yıllık Bütçe Gereksinimi</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-emerald-700 mt-0.5">
                    ~{formatNum(totalDeficitBudgetMillionTL)} Milyon TL
                  </div>
                </div>
                <div className="text-right text-xs text-emerald-700">
                  <div>Açığın Tam Kapanması</div>
                  <div className="text-[11px] font-semibold mt-0.5">5 Yıllık Yayılım Önerisi</div>
                </div>
              </div>
            </div>

            {/* Strategic Implications */}
            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700 space-y-1.5">
              <div className="font-semibold text-slate-900">Planlama Önerisi:</div>
              <p>
                Bu simülasyon modeline göre, 2026-2030 yılları arasında her yıl ortalama{' '}
                <strong>{formatNum(Math.round(totalNationalDeficit / 4.5))} yeni PDR kadrosu</strong> ihdas edilmeli ve
                atama kontenjanının en az %35'i köy ve dezavantajlı bölge koordinasyon merkezlerine tahsis edilmelidir.
              </p>
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-400">
            * Hesaplamalar MEB güncel öğrenci mevcudu ve 81 il okul dağılımına dayanmaktadır.
          </div>
        </div>
      </div>

      {/* Sensitivity Analysis (±%10 Multiplier Elasticity Matrix) */}
      <SensitivityAnalysisPanel />
    </div>
  );
};

