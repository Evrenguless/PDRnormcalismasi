import React from 'react';
import { PolicyWeights, ProvinceData } from '../types/pdr';
import { formatNum } from '../utils/normCalculations';
import { X, Printer, Download, CheckCircle2, AlertTriangle, FileText, Building2 } from 'lucide-react';

interface PolicyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  provinces: ProvinceData[];
  weights: PolicyWeights;
}

export const PolicyReportModal: React.FC<PolicyReportModalProps> = ({
  isOpen,
  onClose,
  provinces,
  weights,
}) => {
  if (!isOpen) return null;

  const totalStudents = provinces.reduce((acc, p) => acc + p.totalStudents, 0);
  const totalSchools = provinces.reduce((acc, p) => acc + p.totalSchools, 0);
  const totalVillageSchools = provinces.reduce((acc, p) => acc + p.villageSchoolsCount, 0);
  const totalVillageStudents = provinces.reduce((acc, p) => acc + p.villageStudentsCount, 0);
  const currentCounselors = provinces.reduce((acc, p) => acc + p.currentCounselors, 0);
  const legislationNorm = provinces.reduce((acc, p) => acc + p.legislationNorm, 0);
  const weightedModelNorm = provinces.reduce((acc, p) => acc + p.weightedModelNorm, 0);
  const legislationDeficit = Math.max(0, legislationNorm - currentCounselors);
  const weightedDeficit = Math.max(0, weightedModelNorm - currentCounselors);

  // Top 10 critical provinces
  const criticalProvinces = provinces
    .slice()
    .sort((a, b) => b.weightedDeficit - a.weightedDeficit)
    .slice(0, 10);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-white border border-slate-200 rounded-lg max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:max-h-none print:shadow-none print:border-none">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>MEB Politika Geliştirici ve Karar Verici Yönetici Raporu</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Yazdır / PDF Olarak Kaydet</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 text-xs leading-relaxed print:p-6">
          {/* Official Letterhead */}
          <div className="text-center border-b border-slate-200 pb-5 space-y-1">
            <div className="font-bold text-sm tracking-wider uppercase text-slate-900">
              T.C. MİLLÎ EĞİTİM BAKANLIĞI
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Strateji Geliştirme Başkanlığı & Özel Eğitim ve Rehberlik Hizmetleri Genel Müdürlüğü
            </div>
            <h1 className="text-lg font-bold text-slate-900 pt-2 tracking-tight">
              TÜRKİYE GENELİ OKUL PDR NORM KADRO İHTİYAÇ VE ATAMA STRATEJİSİ RAPORU
            </h1>
            <div className="text-[11px] text-slate-400 pt-1 font-mono">
              Rapor Kodu: MEB-PDR-2026/09 · Veri Kapsamı: 81 İl, {formatNum(totalSchools)} Kurum
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-100 pb-1">
              1. Yönetici Özeti (Executive Summary)
            </h2>
            <p>
              Türkiye genelinde örgün eğitimde kayıtlı <strong>{formatNum(totalStudents)} öğrenci</strong> için
              mevcut görev yapan kadrolu psikolojik danışman / rehber öğretmen sayısı <strong>{formatNum(currentCounselors)}</strong> kişidir.
              Mevcut MEB Norm Kadro Yönetmeliği’ne göre resmi norm açığı <strong>{formatNum(legislationDeficit)}</strong> iken;
              köy ve kasaba okulları, mesleki teknik eğitim ve özel eğitim kurumları için önerilen ağırlıklı ihtiyaç
              katsayıları dahil edildiğinde gerçek personel gereksinimi <strong>{formatNum(weightedDeficit)} kadroya</strong> ulaşmaktadır.
            </p>

            {/* Quick KPI comparison table */}
            <div className="grid grid-cols-4 gap-3 text-center pt-2">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <div className="text-slate-500 text-[11px]">Toplam Öğrenci</div>
                <div className="font-bold font-mono text-slate-900 text-sm mt-0.5">{formatNum(totalStudents)}</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <div className="text-slate-500 text-[11px]">Görevdeki Kadro</div>
                <div className="font-bold font-mono text-slate-900 text-sm mt-0.5">{formatNum(currentCounselors)}</div>
              </div>
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded">
                <div className="text-amber-800 text-[11px]">Mevzuat Norm Açığı</div>
                <div className="font-bold font-mono text-amber-700 text-sm mt-0.5">{formatNum(legislationDeficit)}</div>
              </div>
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded">
                <div className="text-rose-800 text-[11px]">Gerçek İhtiyaç Açığı</div>
                <div className="font-bold font-mono text-rose-700 text-sm mt-0.5">{formatNum(weightedDeficit)}</div>
              </div>
            </div>
          </div>

          {/* Section 2: Village & Rural Disadvantage */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-100 pb-1">
              2. Kırsal ve Köy Okullarında Yapısal Mevzuat Boşluğu
            </h2>
            <p>
              Türkiye genelinde <strong>{formatNum(totalVillageSchools)} köy ve kasaba okulunda</strong> eğitim gören
              yaklaşık <strong>{formatNum(totalVillageStudents)} öğrencinin %82'si</strong>, okullarındaki öğrenci mevcudu
              yönetmelikteki taban barajın (ilkokul 100, ortaokul/lise 150) altında kaldığı için kadrolu rehberlik
              hizmetine doğrudan erişememektedir.
            </p>
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded text-indigo-950 space-y-1">
              <strong>Önerilen Müdahale (Gezici Hub Modeli):</strong> Komşu 3-4 köy okulunu merkez alan
              ve RAM koordinasyonunda çalışan <strong>~4.600 Gezici Rehber Öğretmen norm kadrosu</strong> ihdas edilmelidir.
              Bu modelle kırsal alandaki akran zorbalığı, devam devamsızlık ve mevsimlik tarım işçiliği kaynaklı
              öğrenme kayıpları engellenecektir.
            </div>
          </div>

          {/* Section 3: High Priority Provinces Ranking */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-100 pb-1">
              3. En Yüksek Kadro Açığı Bulunan 10 İl (Öncelikli Atama Sıralaması)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-slate-200">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">İl Adı</th>
                    <th className="py-2 px-3">Bölge</th>
                    <th className="py-2 px-3 text-right">Öğrenci Nüfusu</th>
                    <th className="py-2 px-3 text-center">Köy Okulu</th>
                    <th className="py-2 px-3 text-center">Mevcut Kadro</th>
                    <th className="py-2 px-3 text-right">Hedef Norm</th>
                    <th className="py-2 px-3 text-right">Net Açık</th>
                    <th className="py-2 px-3 text-right">Doluluk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {criticalProvinces.map((p) => (
                    <tr key={p.plateCode}>
                      <td className="py-2 px-3 font-semibold text-slate-900">{p.name} ({p.plateCode})</td>
                      <td className="py-2 px-3 text-slate-500">{p.region}</td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums">{formatNum(p.totalStudents)}</td>
                      <td className="py-2 px-3 text-center font-mono tabular-nums">{p.villageSchoolsCount}</td>
                      <td className="py-2 px-3 text-center font-mono tabular-nums">{p.currentCounselors}</td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums">{p.weightedModelNorm}</td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums font-bold text-rose-600">
                        {p.weightedDeficit}
                      </td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums">%{p.coverageRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Concrete Policy Directives */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-100 pb-1">
              4. Politika Yapıcılar İçin 4 Temel Mevzuat Düzenleme Önerisi
            </h2>
            <div className="space-y-2 text-slate-700">
              <div className="flex items-start gap-2">
                <span className="font-bold text-indigo-700 min-w-[20px]">4.1.</span>
                <span>
                  <strong>MEB Norm Kadro Yönetmeliği Madde 21 Düzenlemesi:</strong> Köy ve kasaba okullarında
                  öğrenci sayısı 100'ün altında kalsa dahi, ilçe milli eğitim müdürlüğü bünyesinde "Gezici Köy Okulu PDR Normu"
                  tanımlanmalı ve 3 köye 1 kadro atanmalıdır.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-indigo-700 min-w-[20px]">4.2.</span>
                <span>
                  <strong>Mesleki Eğitim (MTAL) ve Özel Eğitim Ağırlık Katsayısı:</strong> MTAL kurumlarında
                  öğrencilerin staj, atölye güvenliği ve ergenlik krizleri dikkate alınarak her 350 öğrenciye bir norm
                  verilecek şekilde katsayı (1.35x) getirilmelidir.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-indigo-700 min-w-[20px]">4.3.</span>
                <span>
                  <strong>Sosyoekonomik Teşvik ve Doğu/Güneydoğu Rotasyonu:</strong> SEGE 5. ve 6. kademe illerde
                  (Şanlıurfa, Van, Ağrı, Muş, vb.) görev yapan psikolojik danışmanlara ek hizmet puanı ve lojman/ulaşım
                  desteği verilerek atama sonrası tutundurma oranı artırılmalıdır.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-indigo-700 min-w-[20px]">4.4.</span>
                <span>
                  <strong>2026-2030 Beş Yıllık Kademeli Kadro Tahsisi:</strong> Yıllık 6.500 ile 8.000 arası
                  düzenli PDR mezunu istihdamı sağlanarak 2030 yılında OECD ortalaması olan 1 rehber / 250 öğrenci
                  hedeflenmelidir.
                </span>
              </div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-center text-slate-600">
            <div>
              <div className="font-semibold text-slate-800">Analitik Modelleme Heyeti</div>
              <div className="text-[11px] text-slate-500">Eğitim Ekonomisi & PDR Uzmanları</div>
            </div>
            <div>
              <div className="font-semibold text-slate-800">Personel Genel Müdürlüğü</div>
              <div className="text-[11px] text-slate-500">Norm Kadro & İhtiyaç Dairesi</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
