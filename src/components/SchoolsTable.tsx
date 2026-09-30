import React, { useState } from 'react';
import { SchoolRecord } from '../types/pdr';
import { formatNum } from '../utils/normCalculations';
import { exportSchoolsToCSV } from '../utils/exportHelpers';
import { Search, Download, Filter, Building, CheckCircle2, AlertTriangle, Compass, FileSpreadsheet } from 'lucide-react';

interface SchoolsTableProps {
  schools: SchoolRecord[];
  initialProvinceFilter?: string;
  onClearInitialProvinceFilter?: () => void;
}

export const SchoolsTable: React.FC<SchoolsTableProps> = ({
  schools,
  initialProvinceFilter,
  onClearInitialProvinceFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>(initialProvinceFilter || 'all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [onlyVillage, setOnlyVillage] = useState(false);
  const [onlyDeficit, setOnlyDeficit] = useState(false);

  // Extract unique provinces
  const provinceList = Array.from(new Set(schools.map((s) => s.province))).sort();
  // Extract unique school types
  const typeList = Array.from(new Set(schools.map((s) => s.schoolType))).sort();

  // Filter logic
  const filteredSchools = schools.filter((school) => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.province.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProvince = selectedProvince === 'all' || school.province === selectedProvince;
    const matchesType = selectedType === 'all' || school.schoolType === selectedType;
    const matchesVillage = !onlyVillage || school.isVillage || school.settlement.includes('Kasaba') || school.settlement.includes('Köy');
    const matchesDeficit = !onlyDeficit || school.weightedDeficit > 0;

    return matchesSearch && matchesProvince && matchesType && matchesVillage && matchesDeficit;
  });

  const handleExport = (delimiter: ';' | ',' = ';') => {
    exportSchoolsToCSV(filteredSchools, delimiter);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-0.5">
              <span>Kurumsal Düzey Detaylı Veri Seti</span>
              <span aria-hidden="true">·</span>
              <span>Okul Bazlı PDR Yeterlilik Analizi</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Okul Rehberlik Norm ve Öğrenci Veri Bankası
            </h2>
            <p className="text-xs text-slate-500">
              Her okulun öğrenci sayısı, mevcut kadrosu, MEB mevzuat normu ve ağırlıklı model normu karşılaştırması.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport(';')}
              title="Filtrelenen okulları Microsoft Excel uyumlu noktalı virgüllü CSV olarak indir"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Excel / CSV Olarak İndir ({filteredSchools.length} Okul)</span>
            </button>
            <button
              onClick={() => handleExport(',')}
              title="Standart virgül ayrımına sahip CSV indir (R, Python, SPSS için)"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors border border-slate-200"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Standart CSV</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-2 border-t border-slate-100">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Okul adı, il veya ilçe ara..."
              className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Province Filter */}
          <div>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-xs text-slate-700"
            >
              <option value="all">Tüm İller ({provinceList.length} İl)</option>
              {provinceList.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* School Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-xs text-slate-700"
            >
              <option value="all">Tüm Okul Türleri</option>
              {typeList.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={onlyVillage}
                onChange={(e) => setOnlyVillage(e.target.checked)}
                className="rounded text-indigo-600 accent-indigo-600"
              />
              <span>Sadece Köy & Kasaba</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={onlyDeficit}
                onChange={(e) => setOnlyDeficit(e.target.checked)}
                className="rounded text-indigo-600 accent-indigo-600"
              />
              <span>Sadece Açığı Olanlar</span>
            </label>
          </div>
        </div>

        {/* Filter count feedback */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div>
            Gösterilen Kurum Sayısı: <strong className="text-slate-800 font-mono tabular-nums">{filteredSchools.length}</strong> / {schools.length}
          </div>
          {selectedProvince !== 'all' && (
            <button
              onClick={() => {
                setSelectedProvince('all');
                if (onClearInitialProvinceFilter) onClearInitialProvinceFilter();
              }}
              className="text-indigo-600 hover:underline"
            >
              İl Filtresini Temizle ({selectedProvince})
            </button>
          )}
        </div>
      </div>

      {/* High Density Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Okul Adı & Bilgisi</th>
                <th className="py-2.5 px-3">İl / İlçe</th>
                <th className="py-2.5 px-3">Yerleşim</th>
                <th className="py-2.5 px-3 text-right">Öğrenci</th>
                <th className="py-2.5 px-3 text-center">Mevcut Kadro</th>
                <th className="py-2.5 px-3 text-center">Mevzuat Normu</th>
                <th className="py-2.5 px-3 text-center">Model Normu</th>
                <th className="py-2.5 px-3 text-right">Net Açık</th>
                <th className="py-2.5 px-3 text-right">Öğrenci / PDR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSchools.length > 0 ? (
                filteredSchools.map((sch) => {
                  const hasDeficit = sch.weightedDeficit > 0;
                  return (
                    <tr key={sch.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900">{sch.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{sch.schoolType}</span>
                          <span aria-hidden="true">·</span>
                          <span>{sch.classCount} Şube</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="font-medium text-slate-900">{sch.province}</div>
                        <div className="text-[11px] text-slate-500">{sch.district}</div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className={`text-[11px] ${sch.isVillage ? 'text-indigo-700 font-medium' : 'text-slate-600'}`}>
                          {sch.settlement}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="font-mono tabular-nums font-bold text-slate-900">
                          {formatNum(sch.studentCount)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {sch.currentBracketRange}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono tabular-nums font-semibold text-slate-800">
                        {sch.currentCounselors}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="font-mono tabular-nums text-slate-700 font-semibold">
                          {sch.legislationNorm}
                        </div>
                        {sch.isBelowThreshold ? (
                          <span className="block text-[10px] text-amber-600 font-medium">Baraj Altı (0 Norm)</span>
                        ) : sch.neededForNextNorm > 0 ? (
                          <span className="block text-[10px] text-slate-400 font-mono">+{sch.neededForNextNorm} üst norma</span>
                        ) : null}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono tabular-nums font-bold text-indigo-700">
                        {sch.weightedModelNorm}
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        {hasDeficit ? (
                          <span className="font-mono tabular-nums text-rose-600 font-bold">
                            -{sch.weightedDeficit} Danışman
                          </span>
                        ) : (
                          <span className="font-mono tabular-nums text-emerald-600 font-medium">
                            Yeterli
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-500 whitespace-nowrap">
                        {sch.currentCounselors > 0 ? `1 / ${sch.studentPerCounselor}` : 'Rehbersiz'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    Arama kriterlerine uygun okul kaydı bulunamadı. Filtreleri temizlemeyi deneyin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
