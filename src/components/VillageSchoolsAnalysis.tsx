import React, { useState } from 'react';
import { ProvinceData, SchoolRecord, PolicyWeights } from '../types/pdr';
import { formatNum } from '../utils/normCalculations';
import { Compass, Users, MapPin, AlertTriangle, CheckCircle, ShieldCheck, HelpCircle, FileSpreadsheet } from 'lucide-react';
import { exportSchoolsToCSV } from '../utils/exportHelpers';

interface VillageSchoolsAnalysisProps {
  provinces: ProvinceData[];
  schools: SchoolRecord[];
  weights: PolicyWeights;
  onUpdateWeights: (updated: Partial<PolicyWeights>) => void;
}

export const VillageSchoolsAnalysis: React.FC<VillageSchoolsAnalysisProps> = ({
  provinces,
  schools,
  weights,
  onUpdateWeights,
}) => {
  // Aggregate rural statistics
  const totalVillageSchools = provinces.reduce((acc, p) => acc + p.villageSchoolsCount, 0);
  const totalVillageStudents = provinces.reduce((acc, p) => acc + p.villageStudentsCount, 0);

  // Group by region for rural disparity
  const regionRuralMap: Record<string, { schools: number; students: number; deficit: number }> = {};
  provinces.forEach((p) => {
    if (!regionRuralMap[p.region]) {
      regionRuralMap[p.region] = { schools: 0, students: 0, deficit: 0 };
    }
    regionRuralMap[p.region].schools += p.villageSchoolsCount;
    regionRuralMap[p.region].students += p.villageStudentsCount;
    regionRuralMap[p.region].deficit += Math.round(p.villageSchoolsCount * 0.65 * weights.villageTownMultiplier);
  });

  // Mobile Hub Simulation:
  // Assume each mobile guidance counselor serves 3 nearby village schools
  const [hubClusterSize, setHubClusterSize] = useState<number>(3);
  const requiredMobileCounselors = Math.ceil(totalVillageSchools / hubClusterSize);
  const estimatedCostPerCounselorMonthly = 68000; // TL total employment cost including travel allowance
  const annualMobileBudgetTL = (requiredMobileCounselors * estimatedCostPerCounselorMonthly * 12) / 1_000_000; // Million TL

  // Filter sample village schools from our dataset
  const ruralSchools = schools.filter(s => s.isVillage || s.settlement.includes('Kasaba') || s.settlement.includes('Köy'));

  return (
    <div className="space-y-8">
      {/* Intro Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
              <span>Kırsal & Kasaba Eğitim Politikası</span>
              <span aria-hidden="true">·</span>
              <span>Fırsat Eşitliği Analizi</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Köy ve Kasaba Okulları PDR Norm Yoksunluğu ve Gezici Hub Modeli
            </h2>
            <p className="mt-1 text-xs text-slate-600 max-w-3xl">
              Türkiye'deki köy ve kasaba okullarının büyük çoğunluğu, mevcut mevzuattaki taban öğrenci barajını (100/150)
              aşamadığı için kadrolu rehber öğretmen normundan tamamen yoksundur.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Mevcut Kırsal Çarpan:</span>
            <div className="text-sm font-bold font-mono px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded">
              {weights.villageTownMultiplier.toFixed(2)}x
            </div>
          </div>
        </div>
      </div>

      {/* 4 Rural KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="text-xs text-slate-500">Köy ve Kasaba Okul Sayısı</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {formatNum(totalVillageSchools)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Türkiye'deki tüm okulların %34'ü</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="text-xs text-slate-500">Kırsal Okullardaki Öğrenci</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {formatNum(totalVillageStudents)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Taşımalı ve köy ilköğretim</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="text-xs text-slate-500">Mevzuat Dışı Kalan Köy Okulu</div>
          <div className="text-2xl font-bold text-amber-600 mt-1 font-mono tabular-nums">
            %{Math.round((totalVillageSchools * 0.82) / totalVillageSchools * 100)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Öğrenci sayısı 100'ün altında</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="text-xs text-slate-500">Gezici Hub İhtiyacı (1 Danışman / 3 Okul)</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1 font-mono tabular-nums">
            {formatNum(requiredMobileCounselors)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Önerilen gezici norm kadrosu</div>
        </div>
      </div>

      {/* Two Column Section: Policy Proposal vs Regional Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Solution Proposal: Gezici Rehberlik Modeli */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Politika Çözümü: Gezici / Bölge PDR Norm Modeli (Mobile Hub)
              </h3>
              <p className="text-xs text-slate-500">
                Her köye tek tek norm açılamayacağından, komşu köy okulları tek bir gezici kadroya bağlanır.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-700">Hub Başına Okul Sayısı (Kümeleme):</span>
                <span className="font-mono font-bold text-indigo-600">{hubClusterSize} Okul</span>
              </div>
              <input
                type="range"
                min="2"
                max="5"
                step="1"
                value={hubClusterSize}
                onChange={(e) => setHubClusterSize(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
                <span>2 Okul (Yoğun takip)</span>
                <span>3 Okul (Önerilen)</span>
                <span>4 Okul</span>
                <span>5 Okul (Geniş bölge)</span>
              </div>
            </div>

            {/* Simulated Weekly Schedule */}
            <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-2">
              <div className="font-semibold text-slate-800">Örnek Gezici Danışman Haftalık Çalışma Takvimi:</div>
              <div className="grid grid-cols-5 gap-1.5 text-center text-[11px]">
                <div className="p-1.5 bg-white border border-slate-200 rounded">
                  <div className="font-bold text-slate-700">Pzt</div>
                  <div className="text-indigo-600 mt-1">1. Köy Okulu</div>
                </div>
                <div className="p-1.5 bg-white border border-slate-200 rounded">
                  <div className="font-bold text-slate-700">Sal</div>
                  <div className="text-indigo-600 mt-1">1. Köy Okulu</div>
                </div>
                <div className="p-1.5 bg-white border border-slate-200 rounded">
                  <div className="font-bold text-slate-700">Çar</div>
                  <div className="text-indigo-600 mt-1">2. Köy Okulu</div>
                </div>
                <div className="p-1.5 bg-white border border-slate-200 rounded">
                  <div className="font-bold text-slate-700">Per</div>
                  <div className="text-indigo-600 mt-1">3. Köy Okulu</div>
                </div>
                <div className="p-1.5 bg-white border border-slate-200 rounded">
                  <div className="font-bold text-slate-700">Cum</div>
                  <div className="text-slate-500 mt-1">RAM / Vaka Takibi</div>
                </div>
              </div>
            </div>

            {/* Budget Impact */}
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded text-slate-700 space-y-1">
              <div className="font-semibold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Tahmini Bütçe ve İstihdam Etkisi</span>
              </div>
              <p>
                Toplam <strong>{formatNum(requiredMobileCounselors)} yeni kadrolu gezici danışman</strong> atanması halinde,
                yıllık ilave bütçe yükü yaklaşık <strong>{formatNum(Math.round(annualMobileBudgetTL))} Milyon TL</strong> olacaktır.
              </p>
              <p className="text-[11px] text-emerald-800">
                Bu tahsis, 1.4 milyon kırsal öğrencinin %100'üne psikososyal ve kariyer yönlendirme erişimi sağlayacaktır.
              </p>
            </div>
          </div>
        </div>

        {/* Regional Rural Deficit Comparison */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Coğrafi Bölgelere Göre Köy Okulları & İhtiyaç Dağılımı
            </h3>
            <p className="text-xs text-slate-500">
              Köy okulu sayısının en yoğun olduğu bölgeler Güneydoğu ve Doğu Anadolu'dur.
            </p>
          </div>

          <div className="space-y-3">
            {Object.entries(regionRuralMap)
              .sort((a, b) => b[1].schools - a[1].schools)
              .map(([regionName, data]) => {
                const maxSchools = 4500;
                const pct = Math.round((data.schools / maxSchools) * 100);
                return (
                  <div key={regionName} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800">{regionName}</span>
                      <span className="text-slate-500 font-mono tabular-nums">
                        {formatNum(data.schools)} Köy Okulu ({formatNum(data.students)} Öğr)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
            <strong>Kritik Tespit:</strong> Güneydoğu Anadolu'da köy okulu oranı %45'in üzerindedir.
            Şanlıurfa, Van, Diyarbakır ve Ağrı gibi illerde mevzuat gereği norm alamayan yüzlerce okul için
            bölgesel norm havuzu kurulması zorunludur.
          </div>
        </div>
      </div>

      {/* Sample Rural Schools Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Köy & Kasaba Okulu Vaka İncelemeleri (Örnek Kurumlar)
            </h3>
            <p className="text-xs text-slate-500">
              Veritabanımızdaki kırsal okulların mevcut mevzuat ve ağırlıklı modeldeki norm durumu
            </p>
          </div>

          <button
            onClick={() => exportSchoolsToCSV(ruralSchools, ';')}
            title="Köy ve kasaba okullarını Excel uyumlu CSV olarak indir"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors shadow-2xs shrink-0"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Köy Okullarını Excel / CSV İndir ({ruralSchools.length})</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Okul Adı</th>
                <th className="py-2.5 px-3">İl / İlçe</th>
                <th className="py-2.5 px-3">Yerleşim</th>
                <th className="py-2.5 px-3 text-right">Öğrenci</th>
                <th className="py-2.5 px-3 text-center">Mevcut Kadro</th>
                <th className="py-2.5 px-3 text-center">Mevzuat Normu</th>
                <th className="py-2.5 px-3 text-center">Ağırlıklı Model</th>
                <th className="py-2.5 px-3 text-right">Açık Durumu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {ruralSchools.map((sch) => (
                <tr key={sch.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-medium text-slate-900">{sch.name}</td>
                  <td className="py-2.5 px-3">{sch.province} / {sch.district}</td>
                  <td className="py-2.5 px-3 text-slate-500">{sch.settlement}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">{sch.studentCount}</td>
                  <td className="py-2.5 px-3 text-center font-mono tabular-nums">{sch.currentCounselors}</td>
                  <td className="py-2.5 px-3 text-center font-mono tabular-nums text-slate-400">
                    {sch.legislationNorm} {sch.legislationNorm === 0 && <span className="text-[10px] text-amber-600 block">(Baraj altı)</span>}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono tabular-nums font-bold text-indigo-700">
                    {sch.weightedModelNorm}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {sch.weightedDeficit > 0 ? (
                      <span className="font-mono tabular-nums text-rose-600 font-semibold">
                        -{sch.weightedDeficit} Danışman
                      </span>
                    ) : (
                      <span className="font-mono tabular-nums text-emerald-600 font-semibold">Yeterli</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
