import React, { useState } from 'react';
import { ProvinceData, SchoolRecord } from '../types/pdr';
import { TURKEY_PROVINCES_GEO, ProvinceMapNode } from '../utils/turkeyMapSvg';
import { formatNum } from '../utils/normCalculations';
import { Info, MapPin, Search, ArrowRight, Building, Users, AlertCircle, Download, FileSpreadsheet } from 'lucide-react';
import { exportProvincesToCSV } from '../utils/exportHelpers';

interface InteractiveMapProps {
  provinces: ProvinceData[];
  schools: SchoolRecord[];
  onSelectProvinceForSchools: (provinceName: string) => void;
}

type MapMetric = 'deficit' | 'coverage' | 'ratio' | 'village';

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  provinces,
  schools,
  onSelectProvinceForSchools,
}) => {
  const [metric, setMetric] = useState<MapMetric>('coverage');
  const [selectedProvince, setSelectedProvince] = useState<ProvinceData | null>(
    provinces.find(p => p.name === 'Şanlıurfa') || provinces[0]
  );
  const [hoveredProvince, setHoveredProvince] = useState<ProvinceData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Map provinces by name/plate for quick lookup
  const provinceMap = new Map<number, ProvinceData>();
  provinces.forEach((p) => provinceMap.set(p.plateCode, p));

  // Determine color based on metric
  const getProvinceColor = (prov: ProvinceData): string => {
    switch (metric) {
      case 'coverage':
        // Lower coverage is worse (red/orange)
        if (prov.coverageRate < 55) return '#e11d48'; // rose-600
        if (prov.coverageRate < 70) return '#f97316'; // orange-500
        if (prov.coverageRate < 85) return '#eab308'; // yellow-500
        return '#10b981'; // emerald-500

      case 'deficit':
        // High deficit is red
        if (prov.weightedDeficit > 600) return '#be123c'; // rose-700
        if (prov.weightedDeficit > 300) return '#f43f5e'; // rose-500
        if (prov.weightedDeficit > 150) return '#fb923c'; // orange-400
        if (prov.weightedDeficit > 50) return '#fde047'; // yellow-300
        return '#86efac'; // green-300

      case 'ratio':
        // Higher student per counselor is worse
        if (prov.studentsPerCounselor > 600) return '#be123c';
        if (prov.studentsPerCounselor > 450) return '#f97316';
        if (prov.studentsPerCounselor > 320) return '#facc15';
        return '#34d399';

      case 'village':
        // High village school count
        if (prov.villageSchoolsCount > 500) return '#4f46e5'; // deep indigo
        if (prov.villageSchoolsCount > 250) return '#6366f1';
        if (prov.villageSchoolsCount > 120) return '#a5b4fc';
        return '#e0e7ff';
    }
  };

  const filteredProvincesList = provinces.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.plateCode.toString().includes(searchQuery)
  );

  // Associated schools in selected province
  const provinceSchools = selectedProvince
    ? schools.filter((s) => s.province === selectedProvince.name)
    : [];

  const [tableSort, setTableSort] = useState<'deficit_desc' | 'counselors_asc' | 'coverage_asc' | 'plate_asc'>('deficit_desc');
  const [tableSearch, setTableSearch] = useState('');

  const sortedTableProvinces = provinces
    .filter((p) =>
      p.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      p.plateCode.toString().includes(tableSearch) ||
      p.region.toLowerCase().includes(tableSearch.toLowerCase())
    )
    .sort((a, b) => {
      switch (tableSort) {
        case 'deficit_desc':
          return b.deficit - a.deficit;
        case 'counselors_asc':
          return a.currentCounselors - b.currentCounselors;
        case 'coverage_asc':
          return a.coverageRate - b.coverageRate;
        case 'plate_asc':
        default:
          return a.plateCode - b.plateCode;
      }
    });

  return (
    <div className="space-y-6">
      {/* Visual Reading Guide Banner */}
      <div className="bg-indigo-900 text-white rounded-lg p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-200">
          <Info className="w-4 h-4 text-indigo-300" />
          <span>Kılavuz: İllerdeki Norm ve Eksik Öğretmen Verilerini Nasıl Okumalısınız?</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white/10 rounded border border-white/10">
            <div className="text-indigo-200 font-semibold">1. Mevcut Öğretmen:</div>
            <div className="text-white mt-1">
              O ildeki okullarda şu an <strong>fiilen görev yapan</strong> kadrolu psikolojik danışman sayısıdır.
            </div>
          </div>
          <div className="p-3 bg-white/10 rounded border border-white/10">
            <div className="text-indigo-200 font-semibold">2. Mevzuat Normu (Olması Gereken):</div>
            <div className="text-white mt-1">
              Yönetmelik Madde 21'e göre okulların mevcuduna (300/150 tabanı + her 500 öğrenciye +1) göre <strong>resmî tahsis edilen toplam kadro</strong>dur.
            </div>
          </div>
          <div className="p-3 bg-rose-500/20 rounded border border-rose-300/30">
            <div className="text-rose-200 font-semibold">3. Net Eksik (Açık):</div>
            <div className="text-white mt-1">
              <strong>Mevzuat Normu - Mevcut Öğretmen</strong> formülü ile hesaplanan açık öğretmen sayısıdır.
            </div>
          </div>
          <div className="p-3 bg-emerald-500/20 rounded border border-emerald-300/30">
            <div className="text-emerald-200 font-semibold">4. Doluluk Oranı (%):</div>
            <div className="text-white mt-1">
              İldeki ihtiyacın yüzde kaçının karşılandığını gösterir (Mevcut / Norm × 100).
            </div>
          </div>
        </div>
      </div>

      {/* Header and Controls */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Türkiye 81 İl PDR Norm & İhtiyaç Haritası
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              İl üzerine gelerek verileri inceleyin veya tıklayarak detaylı ilçe/köy ve okul kırılımlarını görüntüleyin.
            </p>
          </div>

          {/* Metric Selector Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setMetric('coverage')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                metric === 'coverage'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Doluluk Oranı (%)
            </button>
            <button
              onClick={() => setMetric('deficit')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                metric === 'deficit'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Norm Açığı (Kişi)
            </button>
            <button
              onClick={() => setMetric('ratio')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                metric === 'ratio'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Öğrenci / PDR
            </button>
            <button
              onClick={() => setMetric('village')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                metric === 'village'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Köy Okulu Yoğunluğu
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-slate-500 font-medium">Harita Skalası:</span>
            {metric === 'coverage' && (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-[#e11d48]" /> &lt;%55 Kritik</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-[#f97316]" /> %55 - %70 Yüksek Öncelik</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-[#eab308]" /> %70 - %85 Kısmi Yetersiz</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-[#10b981]" /> &gt;%85 Yeterli</span>
              </div>
            )}
            {metric === 'deficit' && (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-[#be123c]" /> &gt;600 Açık</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-[#f43f5e]" /> 300 - 600</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-[#fb923c]" /> 150 - 300</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-[#86efac]" /> &lt;50 Açık</span>
              </div>
            )}
            {metric === 'ratio' && (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-[#be123c]" /> &gt;600 Öğr / PDR</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-[#f97316]" /> 450 - 600</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-[#facc15]" /> 320 - 450</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-[#34d399]" /> &lt;320 Yeterli</span>
              </div>
            )}
            {metric === 'village' && (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-[#4f46e5]" /> &gt;500 Köy Okulu</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-[#6366f1]" /> 250 - 500</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-[#a5b4fc]" /> 120 - 250</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-[#e0e7ff]" /> &lt;120 Köy Okulu</span>
              </div>
            )}
          </div>

          <div className="text-slate-400">
            Tıklanan İl: <strong className="text-slate-800">{selectedProvince ? selectedProvince.name : 'Seçilmedi'}</strong>
          </div>
        </div>
      </div>

      {/* Map & Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Viewport (8 Columns) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between relative overflow-hidden">
          {/* Active Hover / Info Banner */}
          {hoveredProvince && (
            <div className="absolute top-4 left-4 z-10 bg-slate-900/90 text-white backdrop-blur-xs rounded-md px-3 py-2 text-xs shadow-md pointer-events-none space-y-0.5">
              <div className="font-bold text-sm">{hoveredProvince.name} ({hoveredProvince.plateCode}) - {hoveredProvince.region}</div>
              <div className="text-slate-300">
                Doluluk: <span className="font-mono tabular-nums text-white font-semibold">%{hoveredProvince.coverageRate}</span> · 
                Açık: <span className="font-mono tabular-nums text-amber-300 font-semibold">{formatNum(hoveredProvince.weightedDeficit)}</span> · 
                Köy Okulu: <span className="font-mono tabular-nums text-white">{hoveredProvince.villageSchoolsCount}</span>
              </div>
            </div>
          )}

          {/* SVG Canvas */}
          <div className="w-full aspect-[960/440] relative flex items-center justify-center">
            <svg
              viewBox="0 0 960 440"
              className="w-full h-full select-none"
              style={{ maxHeight: '520px' }}
            >
              {/* Province Polygons */}
              {TURKEY_PROVINCES_GEO.map((geo) => {
                const prov = provinceMap.get(geo.plateCode);
                if (!prov) return null;
                const isSelected = selectedProvince?.plateCode === geo.plateCode;
                const fillColor = getProvinceColor(prov);

                return (
                  <g
                    key={geo.plateCode}
                    className="cursor-pointer transition-transform duration-150"
                    onMouseEnter={() => setHoveredProvince(prov)}
                    onMouseLeave={() => setHoveredProvince(null)}
                    onClick={() => setSelectedProvince(prov)}
                  >
                    <path
                      d={geo.path}
                      fill={fillColor}
                      stroke={isSelected ? '#0f172a' : '#ffffff'}
                      strokeWidth={isSelected ? 2.5 : 1}
                      strokeLinejoin="round"
                      opacity={isSelected ? 1 : 0.9}
                      className="hover:opacity-100 hover:brightness-105 transition-all"
                    />
                    {/* Province Name / Plate Label */}
                    <text
                      x={geo.x}
                      y={geo.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-[10px] font-bold pointer-events-none fill-slate-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
                      style={{ fontSize: '9px', fontWeight: 600 }}
                    >
                      {geo.name.length > 7 ? geo.name.slice(0, 6) + '..' : geo.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-2 text-right text-[11px] text-slate-400">
            * Haritada iller coğrafi merkez ve komşuluk ilişkilerine göre vektörel olarak şematize edilmiştir.
          </div>
        </div>

        {/* Selected Province Detailed Inspector (4 Columns) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between space-y-5">
          {selectedProvince ? (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    {selectedProvince.region} Bölgesi · Plaka: {selectedProvince.plateCode}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                    {selectedProvince.name} İl Raporu
                  </h3>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    selectedProvince.priorityLevel === 'Kritik Acil' ? 'bg-rose-100 text-rose-800' :
                    selectedProvince.priorityLevel === 'Yüksek Öncelik' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {selectedProvince.priorityLevel}
                  </span>
                </div>
              </div>

              {/* Core Deficit Highlight Banner */}
              <div className="p-3.5 bg-slate-900 text-white rounded-lg space-y-2 text-xs">
                <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                  Mevcut Durum & Net İhtiyaç Özeti
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-300">Fiilen Görev Yapan PDR:</span>
                  <span className="font-mono text-sm font-bold text-emerald-400 tabular-nums">
                    {formatNum(selectedProvince.currentCounselors)} Kişi
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-300">Yönetmeliğe Göre Olması Gereken:</span>
                  <span className="font-mono text-sm font-bold text-amber-300 tabular-nums">
                    {formatNum(selectedProvince.legislationNorm)} Norm
                  </span>
                </div>
                <div className="flex items-center justify-between pt-0.5">
                  <span className="font-semibold text-rose-300">Resmî Kadro Eksikliği (Açık):</span>
                  <span className="font-mono text-base font-extrabold text-rose-400 tabular-nums">
                    {selectedProvince.deficit > 0 ? `-${formatNum(selectedProvince.deficit)} Eksik` : 'Açık Yok'}
                  </span>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <div className="text-slate-500">Toplam Öğrenci</div>
                  <div className="text-base font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
                    {formatNum(selectedProvince.totalStudents)}
                  </div>
                  <div className="text-[11px] text-slate-500">{selectedProvince.totalSchools} Okul</div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <div className="text-slate-500">Mevcut PDR Kadrosu</div>
                  <div className="text-base font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
                    {formatNum(selectedProvince.currentCounselors)}
                  </div>
                  <div className="text-[11px] text-slate-500">Doluluk: %{selectedProvince.coverageRate}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <div className="text-slate-500">Yönetmelik Normu</div>
                  <div className="text-base font-bold font-mono text-amber-700 mt-0.5 tabular-nums">
                    {formatNum(selectedProvince.legislationNorm)}
                  </div>
                  <div className="text-[11px] text-amber-600">Açık: {formatNum(selectedProvince.deficit)}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <div className="text-slate-500">Model Hedef Normu</div>
                  <div className="text-base font-bold font-mono text-rose-700 mt-0.5 tabular-nums">
                    {formatNum(selectedProvince.weightedModelNorm)}
                  </div>
                  <div className="text-[11px] text-rose-600">Net İhtiyaç: {formatNum(selectedProvince.weightedDeficit)}</div>
                </div>
              </div>

              {/* Rural & Village Spotlight */}
              <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-md text-xs space-y-2">
                <div className="font-semibold text-indigo-950 flex items-center justify-between">
                  <span>Köy & Kasaba Okulları Durumu</span>
                  <span className="font-mono tabular-nums font-bold text-indigo-700">
                    {selectedProvince.villageSchoolsCount} Okul
                  </span>
                </div>
                <div className="text-slate-600">
                  İldeki köy okullarında toplam <strong>{formatNum(selectedProvince.villageStudentsCount)} öğrenci</strong> bulunmaktadır.
                  Mevcut mevzuatta öğrenci sayısı eşiğin altında kalan köy okullarına bağımsız norm düşmemektedir.
                </div>
                <div className="text-[11px] text-indigo-800 font-medium">
                  Önerilen Gezici Norm Hub İhtiyacı: ~{Math.ceil(selectedProvince.villageSchoolsCount / 3.2)} Gezici Danışman
                </div>
              </div>

              {/* Sample Schools from this province */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <span>İldeki Örnek Kurumlar ({provinceSchools.length})</span>
                  <button
                    onClick={() => onSelectProvinceForSchools(selectedProvince.name)}
                    className="text-indigo-600 hover:text-indigo-800 text-[11px] font-medium flex items-center gap-0.5"
                  >
                    Tüm Okulları Listele <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {provinceSchools.length > 0 ? (
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {provinceSchools.map((sch) => (
                      <div
                        key={sch.id}
                        className="p-2 border border-slate-100 rounded text-xs hover:bg-slate-50 transition-colors"
                      >
                        <div className="font-medium text-slate-900 truncate">{sch.name}</div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                          <span>{sch.schoolType} ({sch.studentCount} öğr)</span>
                          <span className={sch.weightedDeficit > 0 ? 'text-rose-600 font-semibold' : 'text-emerald-600 font-semibold'}>
                            {sch.currentCounselors} / {sch.weightedModelNorm} norm ({sch.weightedDeficit > 0 ? `-${sch.weightedDeficit}` : 'Tam'})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center border border-dashed border-slate-200 rounded text-xs text-slate-500">
                    Örnek veritabanında bu il için detaylı okul listesi görüntülemek için "Okul Veri Bankası" sekmesini ziyaret edin.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Detayları görmek için haritadan bir il seçin.
            </div>
          )}

          {/* Search bar to pick any of 81 provinces easily */}
          <div className="pt-3 border-t border-slate-100">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="İl adı veya plaka ara (örn: Şanlıurfa, 63)..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            {searchQuery && (
              <div className="mt-1 max-h-32 overflow-y-auto border border-slate-200 rounded bg-white shadow-sm text-xs divide-y divide-slate-100">
                {filteredProvincesList.slice(0, 6).map((p) => (
                  <button
                    key={p.plateCode}
                    onClick={() => {
                      setSelectedProvince(p);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>{p.name} ({p.plateCode})</span>
                    <span className="text-slate-400 font-mono tabular-nums">%{p.coverageRate}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full 81 Provinces Deficit & Cadre Master Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-0.5">
              <span>81 İl Karşılaştırmalı Döküm</span>
              <span aria-hidden="true">·</span>
              <span>Yönetmelik Madde 21 Esaslı</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              81 İlin Mevcut Öğretmen, Mevzuat Normu ve Net Eksik Kadro Cetveli
            </h3>
            <p className="text-xs text-slate-500">
              Hangi ilde kaç rehber öğretmen var, yönetmeliğe göre kaç olması gerekiyor ve net açık kaç kişidir?
            </p>
          </div>

          {/* Table Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Tabloda il ara..."
                className="pl-8 pr-3 py-1.5 border border-slate-200 rounded bg-slate-50 focus:bg-white text-xs"
              />
            </div>

            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded">
              <button
                onClick={() => setTableSort('deficit_desc')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  tableSort === 'deficit_desc' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                En Çok Açık
              </button>
              <button
                onClick={() => setTableSort('coverage_asc')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  tableSort === 'coverage_asc' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                En Düşük Doluluk
              </button>
              <button
                onClick={() => setTableSort('plate_asc')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  tableSort === 'plate_asc' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Plaka No
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => exportProvincesToCSV(sortedTableProvinces, ';')}
                title="Görüntülenen il verilerini Excel uyumlu CSV olarak indir"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded font-semibold text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>İlleri Excel / CSV İndir ({sortedTableProvinces.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* High-Density 81 Provinces Data Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">İl Adı & Plaka</th>
                <th className="py-2.5 px-3">Bölge</th>
                <th className="py-2.5 px-3 text-right">Öğrenci Nüfusu</th>
                <th className="py-2.5 px-3 text-center bg-indigo-50/40">Mevcut Öğretmen</th>
                <th className="py-2.5 px-3 text-center bg-amber-50/40">Mevzuat Normu</th>
                <th className="py-2.5 px-3 text-right bg-rose-50/50">Net Eksik (Açık)</th>
                <th className="py-2.5 px-3 text-center">Doluluk (%)</th>
                <th className="py-2.5 px-3 text-center">Baraj Altı Okul</th>
                <th className="py-2.5 px-3 text-center">İncele</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sortedTableProvinces.map((p) => {
                const isSelected = selectedProvince?.plateCode === p.plateCode;
                return (
                  <tr
                    key={p.plateCode}
                    className={`hover:bg-slate-50 transition-colors ${
                      isSelected ? 'bg-indigo-50/60 font-medium' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      {p.name} <span className="text-slate-400 font-mono font-normal">({p.plateCode})</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{p.region}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-900">
                      {formatNum(p.totalStudents)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono tabular-nums font-bold text-indigo-700 bg-indigo-50/30">
                      {formatNum(p.currentCounselors)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono tabular-nums font-semibold text-amber-800 bg-amber-50/30">
                      {formatNum(p.legislationNorm)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-extrabold text-rose-600 bg-rose-50/40 whitespace-nowrap">
                      {p.deficit > 0 ? `-${formatNum(p.deficit)} Eksik` : 'Açık Yok'}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono tabular-nums">
                      <span className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                        p.coverageRate < 60 ? 'bg-rose-100 text-rose-800' :
                        p.coverageRate < 75 ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        %{p.coverageRate}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono tabular-nums text-slate-500">
                      {p.schoolsBelowThresholdCount} okul
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedProvince(p);
                          window.scrollTo({ top: 120, behavior: 'smooth' });
                        }}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition-colors"
                      >
                        Haritada Seç
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* National Totals Summary Footer */}
            <tfoot className="bg-slate-900 text-white font-semibold border-t-2 border-slate-700">
              <tr>
                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="font-extrabold text-sm text-white">
                    TÜRKİYE GENELİ TOPLAMI
                  </div>
                  <div className="text-[11px] font-normal text-slate-400">
                    ({sortedTableProvinces.length} İl Kapsamı)
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-300 text-xs">
                  81 İl / 7 Bölge
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-white text-sm font-bold">
                  {formatNum(sortedTableProvinces.reduce((acc, p) => acc + p.totalStudents, 0))}
                </td>
                <td className="py-3 px-3 text-center font-mono tabular-nums text-emerald-400 text-sm font-bold bg-slate-800/80">
                  {formatNum(sortedTableProvinces.reduce((acc, p) => acc + p.currentCounselors, 0))}
                </td>
                <td className="py-3 px-3 text-center font-mono tabular-nums text-amber-300 text-sm font-bold bg-slate-800/80">
                  {formatNum(sortedTableProvinces.reduce((acc, p) => acc + p.legislationNorm, 0))}
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-rose-400 text-sm font-extrabold bg-slate-800/90 whitespace-nowrap">
                  -{formatNum(sortedTableProvinces.reduce((acc, p) => acc + p.deficit, 0))} Eksik
                </td>
                <td className="py-3 px-3 text-center font-mono tabular-nums text-sm font-bold">
                  %{Math.round(
                    (sortedTableProvinces.reduce((acc, p) => acc + p.currentCounselors, 0) /
                      Math.max(1, sortedTableProvinces.reduce((acc, p) => acc + p.legislationNorm, 0))) *
                      100
                  )}
                </td>
                <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-300 text-xs">
                  {formatNum(sortedTableProvinces.reduce((acc, p) => acc + p.schoolsBelowThresholdCount, 0))} Okul
                </td>
                <td className="py-3 px-3 text-center text-slate-400 text-[11px] font-normal">
                  Resmî Bilanço
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
