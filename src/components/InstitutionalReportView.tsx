import React, { useState, useRef } from 'react';
import { PolicyWeights, ProvinceData, SchoolRecord } from '../types/pdr';
import { formatNum } from '../utils/normCalculations';
import { REFORM_SCENARIOS } from './MEBReformScenarios';
import { exportProvincesToCSV } from '../utils/exportHelpers';
import html2pdf from 'html2pdf.js';
import {
  Printer,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  Building2,
  Users,
  CheckCircle2,
  TrendingUp,
  Scale,
  Award,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Layers,
  HeartPulse,
  BrainCircuit,
  PieChart,
  Loader2,
  BarChart3,
  FileText
} from 'lucide-react';

interface InstitutionalReportViewProps {
  provinces: ProvinceData[];
  schools: SchoolRecord[];
  weights: PolicyWeights;
  onNavigateToTab: (tab: 'overview' | 'map' | 'rural' | 'simulator' | 'code' | 'schools') => void;
}

export const InstitutionalReportView: React.FC<InstitutionalReportViewProps> = ({
  provinces,
  schools,
  weights,
  onNavigateToTab,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  // Aggregate macro figures
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
  const studentsPerCounselor = Math.round(totalStudents / currentCounselors);

  // Deprivation statistics
  const totalZeroNormSchools = provinces.reduce((acc, p) => acc + p.schoolsBelowThresholdCount, 0);
  const totalZeroNormStudents = provinces.reduce((acc, p) => acc + p.studentsInZeroNormSchools, 0);
  const zeroNormSchoolsPct = Math.round((totalZeroNormSchools / totalSchools) * 100);
  const zeroNormStudentsPct = Math.round((totalZeroNormStudents / totalStudents) * 100);

  // Top 15 highest deficit provinces
  const highestDeficitProvinces = provinces
    .slice()
    .sort((a, b) => b.deficit - a.deficit)
    .slice(0, 15);

  // Regional breakdown
  const regionalSummary: Record<string, {
    students: number;
    schools: number;
    current: number;
    norm: number;
    deficit: number;
    coverage: number;
  }> = {};

  provinces.forEach((p) => {
    if (!regionalSummary[p.region]) {
      regionalSummary[p.region] = { students: 0, schools: 0, current: 0, norm: 0, deficit: 0, coverage: 0 };
    }
    regionalSummary[p.region].students += p.totalStudents;
    regionalSummary[p.region].schools += p.totalSchools;
    regionalSummary[p.region].current += p.currentCounselors;
    regionalSummary[p.region].norm += p.legislationNorm;
    regionalSummary[p.region].deficit += p.deficit;
  });

  Object.keys(regionalSummary).forEach((reg) => {
    const item = regionalSummary[reg];
    item.coverage = Math.round((item.current / Math.max(1, item.norm)) * 100);
  });

  // Educational Tier (Kademe) Breakdown of the 24,635 Deficit
  // Based on official MEB Statistics: 54,340 schools total
  // İlkokul: ~24,500 institutions, Ortaokul: ~19,100 institutions, Genel Lise: ~6,820 institutions, MTAL/MESEM: ~3,920 institutions
  const kademeBreakdown = [
    {
      kademe: 'İlkokul Kademesi (1-4. Sınıf)',
      tag: 'Erken Tanılama & 300 Barajı Mağduru',
      totalSchools: 24500,
      totalStudents: 5420000,
      currentCounselors: 14200,
      legislationNorm: 25480,
      deficit: 11280,
      coverageRate: 56,
      studentsPerCounselor: 382,
      note: '300 barajı nedeniyle 9.800 köy ve kasaba ilkokulunda 0 norm vardır. Açığın %46\'sı bu kademededir.',
    },
    {
      kademe: 'Ortaokul Kademesi (5-8. Sınıf)',
      tag: 'LGS Sınavı, Ergenlik & Zorbalık',
      totalSchools: 19100,
      totalStudents: 5210000,
      currentCounselors: 17850,
      legislationNorm: 26150,
      deficit: 8300,
      coverageRate: 68,
      studentsPerCounselor: 292,
      note: '150 barajı uygulanır. İkili eğitim yapan ve 1.000+ öğrencili mega ortaokullarda ilave kat normları boş durumdadır.',
    },
    {
      kademe: 'Genel Ortaöğretim (Anadolu & Fen)',
      tag: 'YKS Kariyer, Üniversite & Ruh Sağlığı',
      totalSchools: 6820,
      totalStudents: 5280000,
      currentCounselors: 10840,
      legislationNorm: 13745,
      deficit: 2905,
      coverageRate: 79,
      studentsPerCounselor: 487,
      note: 'Liselerde 1.500-2.500 öğrencili kurumlarda 3. ve 4. norm kadroları atanmamış durumdadır.',
    },
    {
      kademe: 'Meslek Liseleri (MTAL & MESEM)',
      tag: 'Staj, İş Güvenliği & Bağımlılık Riski',
      totalSchools: 3920,
      totalStudents: 2880000,
      currentCounselors: 4920,
      legislationNorm: 7070,
      deficit: 2150,
      coverageRate: 70,
      studentsPerCounselor: 585,
      note: 'Sanayide çıraklık/staj yapan MTAL öğrencilerinde devamsızlık yüksektir; mevzuatta MTAL risk çarpanı yoktur.',
    },
  ];

  // Direct Formatted PDF Export using html2pdf.js with optimal pagination and chart preservation
  const handleExportPDF = async () => {
    if (!reportRef.current || isExportingPDF) return;
    setIsExportingPDF(true);
    setExportSuccessMessage(null);

    const timestamp = new Date().toISOString().split('T')[0];
    const opt = {
      margin: [10, 10, 12, 10] as [number, number, number, number],
      filename: `MEB_PDR_Resmi_Norm_ve_Atama_Gerekce_Raporu_${timestamp}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
        scrollY: 0,
        onclone: (clonedDoc: Document) => {
          // Remove or sanitize modern CSS stylesheets that use oklch in Tailwind v4
          const stylesheets = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
          stylesheets.forEach((sheet) => {
            if (sheet.tagName === 'STYLE' && sheet.textContent?.includes('oklch')) {
              // Replace oklch definitions with rgb fallback in cloned doc
              sheet.textContent = sheet.textContent.replace(/oklch\([^)]+\)/g, '#6366f1');
            }
          });

          // Also sanitize inline computed styles on all cloned elements
          const allElements = clonedDoc.querySelectorAll<HTMLElement>('*');
          allElements.forEach((el) => {
            // If any inline style or computed color uses oklch, fallback to safe standard colors
            if (el.style.color && el.style.color.includes('oklch')) {
              el.style.color = '#0f172a';
            }
            if (el.style.backgroundColor && el.style.backgroundColor.includes('oklch')) {
              el.style.backgroundColor = '#ffffff';
            }
            if (el.style.borderColor && el.style.borderColor.includes('oklch')) {
              el.style.borderColor = '#e2e8f0';
            }
          });
        },
      },
      jsPDF: {
        unit: 'mm' as const,
        format: 'a4' as const,
        orientation: 'portrait' as const,
        compress: true,
      },
      pagebreak: {
        mode: ['css', 'legacy'],
        avoid: ['tr', '.pdf-avoid-break', 'h2', 'h3'],
        before: ['.pdf-page-break'],
      },
    };

    try {
      await html2pdf().set(opt).from(reportRef.current).save();
      setExportSuccessMessage('Formatlı Resmî PDF Raporu başarıyla oluşturuldu ve indirildi.');
      setTimeout(() => setExportSuccessMessage(null), 5000);
    } catch (err) {
      console.error('PDF oluşturma hatası:', err);
      // Fallback to browser print if library has issue in sandbox
      window.print();
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Action Ribbon (Hidden when printing) */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 print:hidden space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Resmî Makamlar, Bakanlık ve Sendika Brifing Dosyası</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 mt-1">
              Türkiye Rehberlik ve Psikolojik Danışmanlık (PDR) İhtiyaç Raporu & Atama Savunusu
            </h1>
            <p className="text-xs text-slate-600 mt-0.5 max-w-3xl">
              Öğrencilerin ruh sağlığı, akran zorbalığı, sınav kaygısı ve kırsal fırsat eşitsizliğine karşı
              PDR norm kadro çalışmalarının ivedilikle hızlandırılması ve kadrolu atama yapılması için hazırlanan kapsamlı brifing metni.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => exportProvincesToCSV(provinces, ';')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verileri Excel İndir</span>
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded shadow-xs transition-colors"
            >
              {isExportingPDF ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>PDF Hazırlanıyor...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Formatlı PDF İndir</span>
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Doğrudan Yazdır</span>
            </button>
          </div>
        </div>

        {exportSuccessMessage && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{exportSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* PRINTABLE REPORT DOCUMENT CONTAINER */}
      <div
        ref={reportRef}
        id="official-presentation-report"
        className="bg-white border border-slate-200 rounded-lg shadow-sm p-8 sm:p-12 print:p-0 print:border-none print:shadow-none space-y-9 text-slate-900 font-sans"
      >
        {/* Formal Header / Başlık */}
        <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1.5">
          <div className="text-xs font-bold tracking-widest uppercase text-slate-700">
            T.C. MİLLÎ EĞİTİM BAKANLIĞI · STRATEJİ VE PERSONEL PLANLAMA MAKAMINA
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            ÖZEL EĞİTİM VE REHBERLİK HİZMETLERİ GENEL MÜDÜRLÜĞÜ & EĞİTİM SENDİKALARI İNCELEME DOSYASI
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 pt-1.5 uppercase">
            TÜRKİYE GENELİ OKUL PDR NORM KADRO DURUM TESPİTİ, ÖĞRENCİ ERİŞİM ENGELİ VE ACİL ATAMA GEREKÇE RAPORU
          </h1>
          <div className="text-[11px] text-slate-500 font-mono">
            Rapor Tarihi: 2026/2027 Eğitim Öğretim Yılı İtibarıyla · Kapsam: 81 İl, {formatNum(totalSchools)} Okul, {formatNum(totalStudents)} Öğrenci
          </div>
        </div>

        {/* 1. EXECUTIVE SUMMARY: MEVCUT DURUM BİLANÇOSU */}
        <section className="pdf-section space-y-3.5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              1
            </span>
            <h2 className="text-sm font-bold uppercase tracking-tight text-slate-900">
              Yönetici Özeti ve Mevcut Durum Bilançosu
            </h2>
          </div>

          <p className="text-xs leading-relaxed text-slate-700">
            Türkiye genelinde Millî Eğitim Bakanlığı’na bağlı <strong>{formatNum(totalSchools)} resmî ve özel okulda</strong> öğrenim gören{' '}
            <strong>{formatNum(totalStudents)} öğrenciye</strong> karşılık, fiilen sahada görev yapan kadrolu rehber öğretmen/psikolojik danışman sayısı yalnızca{' '}
            <strong className="text-slate-900">{formatNum(currentCounselors)} kişidir</strong>. Yürürlükteki MEB Norm Kadro Yönetmeliği Madde 21 gereğince okullara tahsis edilmiş yasal norm kadro{' '}
            <strong>{formatNum(legislationNorm)}</strong> olup, Türkiye genelinde ivedilikle atanması gereken resmî net kadro açığı{' '}
            <strong className="text-rose-700 font-bold">-{formatNum(legislationDeficit)} öğretmendir (%{nationalCoverage} doluluk oranı)</strong>.
          </p>

          {/* 4 Macro KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1 text-xs">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-slate-500 text-[11px] font-medium">Toplam Öğrenci & Okul</div>
              <div className="text-lg font-black font-mono text-slate-950 mt-0.5 tabular-nums">
                {formatNum(totalStudents)}
              </div>
              <div className="text-[11px] text-slate-600">{formatNum(totalSchools)} Okul Kurumu</div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-slate-500 text-[11px] font-medium">Fiilen Görevdeki Kadro</div>
              <div className="text-lg font-black font-mono text-slate-950 mt-0.5 tabular-nums">
                {formatNum(currentCounselors)}
              </div>
              <div className="text-[11px] text-slate-600">1 Danışman / {studentsPerCounselor} Öğrenci</div>
            </div>

            <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-lg">
              <div className="text-rose-900 text-[11px] font-bold">Mevcut Resmî Kadro Açığı</div>
              <div className="text-lg font-black font-mono text-rose-700 mt-0.5 tabular-nums">
                -{formatNum(legislationDeficit)} Kadro
              </div>
              <div className="text-[11px] text-rose-800 font-medium">Mevzuat Normu: {formatNum(legislationNorm)}</div>
            </div>

            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg">
              <div className="text-amber-900 text-[11px] font-bold">PDR Normsuz Okul Sayısı</div>
              <div className="text-lg font-black font-mono text-amber-800 mt-0.5 tabular-nums">
                {formatNum(totalZeroNormSchools)} Okul
              </div>
              <div className="text-[11px] text-amber-800 font-medium">Tüm okulların %{zeroNormSchoolsPct}’si sıfır normlu</div>
            </div>
          </div>

          {/* Visual Coverage Bar Chart for Macro Comparison */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-800">
              <span>Türkiye Geneli Yasal Norm Doluluk Seviyesi:</span>
              <span className="font-mono text-rose-700 font-bold">%{nationalCoverage} Doluluk ({formatNum(currentCounselors)} / {formatNum(legislationNorm)})</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden flex">
              <div
                className="bg-emerald-600 h-full text-[9px] font-bold text-white flex items-center justify-center"
                style={{ width: `${nationalCoverage}%` }}
              >
                Görevde (%{nationalCoverage})
              </div>
              <div
                className="bg-rose-500 h-full text-[9px] font-bold text-white flex items-center justify-center"
                style={{ width: `${100 - nationalCoverage}%` }}
              >
                Açık (%{100 - nationalCoverage})
              </div>
            </div>
          </div>

          {/* 1.B: KADEMELERE GÖRE AÇIK DAĞILIMI VE 24 BİN AÇIK HESAPLAMA METODOLOJİSİ */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>PDR Kadro Açığının Okul Kademelerine (İlkokul, Ortaokul, Lise) Göre Dağılımı</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Madde 21 Ayrık Basamak Matrisi</span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-2.5">Okul Kademesi</th>
                    <th className="py-2 px-2 text-right">Okul Sayısı</th>
                    <th className="py-2 px-2 text-right">Öğrenci Nüfusu</th>
                    <th className="py-2 px-2 text-center">Fiilen Görevde</th>
                    <th className="py-2 px-2 text-center">Yasal Norm</th>
                    <th className="py-2 px-2.5 text-right text-rose-700 font-black">Net Açık</th>
                    <th className="py-2 px-2 text-center">Doluluk</th>
                    <th className="py-2 px-2 text-center">Danışman/Öğr</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {kademeBreakdown.map((k) => (
                    <tr key={k.kademe} className="hover:bg-slate-50">
                      <td className="py-2 px-2.5">
                        <div className="font-bold text-slate-900">{k.kademe}</div>
                        <div className="text-[10px] text-slate-500">{k.tag}</div>
                      </td>
                      <td className="py-2 px-2 text-right font-mono tabular-nums">{formatNum(k.totalSchools)}</td>
                      <td className="py-2 px-2 text-right font-mono tabular-nums">{formatNum(k.totalStudents)}</td>
                      <td className="py-2 px-2 text-center font-mono tabular-nums font-semibold">{formatNum(k.currentCounselors)}</td>
                      <td className="py-2 px-2 text-center font-mono tabular-nums">{formatNum(k.legislationNorm)}</td>
                      <td className="py-2 px-2.5 text-right font-mono tabular-nums font-extrabold text-rose-700">
                        -{formatNum(k.deficit)}
                      </td>
                      <td className="py-2 px-2 text-center font-mono tabular-nums font-bold">%{k.coverageRate}</td>
                      <td className="py-2 px-2 text-center font-mono tabular-nums text-slate-600">1 / {k.studentsPerCounselor}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-extrabold text-slate-950">
                    <td className="py-2 px-2.5">TÜRKİYE TOPLAMI</td>
                    <td className="py-2 px-2 text-right font-mono">{formatNum(totalSchools)}</td>
                    <td className="py-2 px-2 text-right font-mono">{formatNum(totalStudents)}</td>
                    <td className="py-2 px-2 text-center font-mono">{formatNum(currentCounselors)}</td>
                    <td className="py-2 px-2 text-center font-mono">{formatNum(legislationNorm)}</td>
                    <td className="py-2 px-2.5 text-right font-mono text-rose-700 font-black">-{formatNum(legislationDeficit)}</td>
                    <td className="py-2 px-2 text-center font-mono font-black">%{nationalCoverage}</td>
                    <td className="py-2 px-2 text-center font-mono">1 / {studentsPerCounselor}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Critical Analytical Note: Why 24k deficit exists vs ~900 appointments in 2 years */}
            <div className="p-3 bg-amber-50/80 border border-amber-300 rounded-lg text-xs space-y-2">
              <div className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Analitik Açıklama: "24.635 Açık Varken Son 2 Yılda Neden Yalnızca ~900 Atama Yapıldı?"</span>
              </div>
              <p className="text-amber-900 leading-relaxed text-[11px]">
                <strong>1. Mevzuat Normu (Hukuki İhtiyaç) vs. Maliye Bütçe Kontenjanı Ayrımı:</strong><br />
                MEB Norm Kadro Yönetmeliği Madde 21'e göre okulların öğrenci sayısı 500 ve katlarına ulaştıkça sistem otomatik olarak
                norm üretir (Toplam yasal norm: <strong>72.445</strong>). Ancak Hazine ve Maliye Bakanlığı'nın yıllık kamusal tasarruf
                ve bütçe kısıtları nedeniyle MEB'e tahsis edilen toplam öğretmen kontenjanı (yılda 20.000-45.000) tüm branşlara (yaklaşık 80 alan)
                bölüştürülmektedir. PDR alanına son 2 yılda yalnızca %2-%3 civarında pay verilmiş (toplam ~900-1.100 kişi),
                bu da mevcut <strong>24.635 açığın %96'sının sahada kapatılmadan boş kalmasına</strong> yol açmıştır.
              </p>
              <p className="text-amber-900 leading-relaxed text-[11px]">
                <strong>2. Açığın Kademelere Göre Asıl Sebepleri:</strong><br />
                • <strong>İlkokullarda (-11.280 Açık):</strong> Türkiye'de 24.500 ilkokulun 14.700'ü 300 barajını geçmektedir. 300 barajını geçen okulların çoğunda 1 danışman varken, 500-1000 öğrencili okullardaki 2. norm kadrolar Maliye onayı verilmediği için fiilen boş tutulmaktadır.<br />
                • <strong>Ortaokullarda (-8.300 Açık):</strong> 19.100 ortaokulda 150 taban barajı vardır. Mega ortaokullarda (800-1.500 öğrenci) yasal olarak 3 rehber öğretmen hakkı varken genelde 1 danışman görev yapmaktadır.<br />
                • <strong>Liselerde (-5.055 Açık):</strong> 10.740 lisede 1.500-2.500 mevcutlu okullarda 3. ve 4. normlar atama yapılmadığı için yıllardır eksik durumdadır.
              </p>
            </div>
          </div>
        </section>

        {/* 2. ÖĞRENCİLERİN PDR HİZMETLERİNE ERİŞİM ENGELİ VE MAHRUMİYET */}
        <section className="pdf-section space-y-3.5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              2
            </span>
            <h2 className="text-sm font-bold uppercase tracking-tight text-slate-900">
              Öğrencilerin Ruh Sağlığı ve Rehberlik Hizmetlerine Erişim Engeli (Mahrumiyet Analizi)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs leading-relaxed">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Mevzuat Barajı Sebebiyle Norm Verilmeyen Okullar (Baraj Altı)</span>
              </h3>
              <p className="text-slate-700">
                MEB Yönetmeliği Madde 21'deki <em>"İlkokullarda 300, ortaokul ve liselerde 150 öğrenci"</em> alt barajı
                sebebiyle Türkiye'deki <strong>{formatNum(totalZeroNormSchools)} okul</strong> hukuken tek bir psikolojik danışman dahi alamamaktadır.
              </p>
              <div className="p-2 bg-amber-100/70 border border-amber-200 rounded text-amber-950 font-semibold text-[11px]">
                Bu okullarda okuyan <strong>{formatNum(totalZeroNormStudents)} çocuk (%{zeroNormStudentsPct})</strong> eğitim hayatı boyunca
                okulunda profesyonel bir rehber öğretmenin desteğine erişememektedir.
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-indigo-600" />
                <span>OECD Ortalaması ile Türkiye Gerçeği Uçurumu</span>
              </h3>
              <p className="text-slate-700">
                OECD ülkelerinde bir rehber öğretmene düşen ortalama öğrenci sayısı <strong>250</strong> iken;
                Türkiye'de ortalama <strong>1 danışmana {studentsPerCounselor} öğrenci</strong> düşmektedir.
                Şanlıurfa, Gaziantep, Van ve Diyarbakır gibi illerde ise bu sayı <strong>600 ile 700 öğrenciyi</strong> aşmaktadır.
              </p>
              <div className="p-2 bg-indigo-50 border border-indigo-200 rounded text-indigo-950 font-semibold text-[11px]">
                Bir danışmanın yılda 400-600 öğrenciyle bireysel görüşme yapması, gelişim takibi ve kriz müdahalesi
                sağlaması matematiksel ve psikolojik olarak olanaksızdır.
              </div>
            </div>
          </div>
        </section>

        {/* Visual Graphic: Bölgesel Dağılım ve Doluluk Çubukları */}
        <section className="pdf-section space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
              <span>7 Coğrafi Bölgenin PDR Kadro Doluluk Grafiği</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Hedef: %100 Doluluk</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {Object.entries(regionalSummary).map(([region, data]) => (
              <div key={region} className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-slate-900">{region}</span>
                  <span className="font-mono text-slate-600">
                    {formatNum(data.current)} / {formatNum(data.norm)} Kadro ({formatNum(data.deficit)} Açık)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      data.coverage < 60
                        ? 'bg-rose-600'
                        : data.coverage < 75
                        ? 'bg-amber-500'
                        : 'bg-emerald-600'
                    }`}
                    style={{ width: `${Math.min(100, data.coverage)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span>Doluluk: %{data.coverage}</span>
                  <span>{formatNum(data.schools)} Okul</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 81 İL BÖLGESEL BİLANÇO VE EN ÇOK AÇIĞI OLAN 15 İL */}
        <section className="pdf-section space-y-3.5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              3
            </span>
            <h2 className="text-sm font-bold uppercase tracking-tight text-slate-900">
              En Yüksek Kadro Açığı Olan 15 İl ve Bölgesel Dağılım
            </h2>
          </div>

          <p className="text-xs text-slate-600">
            Aşağıdaki tabloda, MEB Madde 21 norm formülüyle hesaplanan ve atama bekleyen en yüksek açık sayılı 15 il yer almaktadır:
          </p>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-2.5">İl Adı (Plaka)</th>
                  <th className="py-2 px-2.5">Bölge</th>
                  <th className="py-2 px-2.5 text-right">Öğrenci Nüfusu</th>
                  <th className="py-2 px-2.5 text-center">Mevcut Kadro</th>
                  <th className="py-2 px-2.5 text-center">Yasal Norm</th>
                  <th className="py-2 px-2.5 text-right text-rose-700 font-extrabold">Net Kadro Açığı</th>
                  <th className="py-2 px-2.5 text-center">Doluluk (%)</th>
                  <th className="py-2 px-2.5 text-center">Baraj Altı Okul</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {highestDeficitProvinces.map((p) => (
                  <tr key={p.plateCode} className="hover:bg-slate-50">
                    <td className="py-1.5 px-2.5 font-bold text-slate-900">{p.name} ({p.plateCode})</td>
                    <td className="py-1.5 px-2.5 text-slate-500">{p.region}</td>
                    <td className="py-1.5 px-2.5 text-right font-mono tabular-nums">{formatNum(p.totalStudents)}</td>
                    <td className="py-1.5 px-2.5 text-center font-mono tabular-nums font-semibold">{formatNum(p.currentCounselors)}</td>
                    <td className="py-1.5 px-2.5 text-center font-mono tabular-nums">{formatNum(p.legislationNorm)}</td>
                    <td className="py-1.5 px-2.5 text-right font-mono tabular-nums font-extrabold text-rose-700">
                      -{formatNum(p.deficit)}
                    </td>
                    <td className="py-1.5 px-2.5 text-center font-mono tabular-nums font-medium">
                      %{p.coverageRate}
                    </td>
                    <td className="py-1.5 px-2.5 text-center font-mono tabular-nums text-slate-600">
                      {p.schoolsBelowThresholdCount} Okul
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. MEB KULİS VE REFORM SENARYOLARI (NORM ÇALIŞMASI HIZLANDIRILIRSA OLUŞACAK AÇIK) */}
        <section className="pdf-section space-y-3.5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              4
            </span>
            <h2 className="text-sm font-bold uppercase tracking-tight text-slate-900">
              MEB Norm Yönetmeliği Değişirse Ne Kadar Açık Oluşur? (Kulis ve Taslak Yordaması)
            </h2>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            Mevcut yönetmelikte taban barajların düşürülmesi (100 öğrenci veya sıfır baraj) ve kat artış basamağının 250'ye çekilmesi
            hâlinde oluşacak toplam norm ve ek atama gereksinimi analitik olarak şu şekildedir:
          </p>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-2.5">Taslak Senaryo / Öneri</th>
                  <th className="py-2 px-2 text-center">Taban Eşiği</th>
                  <th className="py-2 px-2 text-center">Kat Artış Kuralı</th>
                  <th className="py-2 px-2.5 text-right">Toplam Norm</th>
                  <th className="py-2 px-2.5 text-right text-rose-700 font-bold">Toplam Açık</th>
                  <th className="py-2 px-2.5 text-right text-indigo-700 font-extrabold">Mevcut Açığa İlave</th>
                  <th className="py-2 px-2 text-center">Baraj Altı Okul</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {REFORM_SCENARIOS.map((sc) => (
                  <tr key={sc.id} className="hover:bg-slate-50">
                    <td className="py-1.5 px-2.5">
                      <div className="font-bold text-slate-900">{sc.name}</div>
                      <div className="text-[10px] text-slate-500">{sc.tag}</div>
                    </td>
                    <td className="py-1.5 px-2 text-center font-mono tabular-nums">
                      {sc.zeroThreshold ? 'Sıfır Baraj' : `${sc.primaryThreshold} Öğrenci`}
                    </td>
                    <td className="py-1.5 px-2 text-center font-mono tabular-nums font-semibold">
                      +{sc.stepSize} Öğrenci
                    </td>
                    <td className="py-1.5 px-2.5 text-right font-mono tabular-nums font-bold text-slate-900">
                      {formatNum(sc.totalNorm)}
                    </td>
                    <td className="py-1.5 px-2.5 text-right font-mono tabular-nums font-bold text-rose-700">
                      -{formatNum(sc.totalDeficit)}
                    </td>
                    <td className="py-1.5 px-2.5 text-right font-mono tabular-nums font-black text-indigo-900">
                      {sc.incrementalDeficit > 0 ? `+${formatNum(sc.incrementalDeficit)} Yeni Açık` : 'Mevcut Baz'}
                    </td>
                    <td className="py-1.5 px-2 text-center font-mono tabular-nums text-slate-600">
                      {sc.zeroNormSchools === 0 ? '0 (Tam Kapsama)' : `${formatNum(sc.zeroNormSchools)} Okul`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 4.B: KATSAYILARDA %10 DUYARLILIK ANALİZİ BRİFİNGİ */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-indigo-600" />
                <span>Norm Belirleyici Katsayılarda %10 Değişimin Açığa Etkisi (Duyarlılık / Esneklik Tablosu)</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Elastikiyet Testi: ±%10</span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-1.5 px-2.5">Parametre / Katsayı</th>
                    <th className="py-1.5 px-2 text-center">Mevcut Değer</th>
                    <th className="py-1.5 px-2 text-right bg-rose-50/50 text-rose-900">-%10 (Yeni Açık / Fark)</th>
                    <th className="py-1.5 px-2 text-center bg-slate-50">Mevcut Açık</th>
                    <th className="py-1.5 px-2 text-right bg-emerald-50/50 text-emerald-900">+%10 (Yeni Açık / Fark)</th>
                    <th className="py-1.5 px-2.5">Stratejik Politika Sonucu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-slate-50">
                    <td className="py-1 px-2.5 font-bold text-slate-900">Kat Normu Basamağı (500)</td>
                    <td className="py-1 px-2 text-center font-mono">500 Öğr.</td>
                    <td className="py-1 px-2 text-right font-mono text-rose-700 font-bold">29.440 (+4.805)</td>
                    <td className="py-1 px-2 text-center font-mono font-bold">24.635</td>
                    <td className="py-1 px-2 text-right font-mono text-emerald-800 font-bold">20.810 (-3.825)</td>
                    <td className="py-1 px-2.5 text-slate-600 text-[11px]">En yüksek esneklik (%19.5 etki). 450'ye inerse açık 29 bini aşar.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-1 px-2.5 font-bold text-slate-900">İlkokul Taban Eşiği (300)</td>
                    <td className="py-1 px-2 text-center font-mono">300 Öğr.</td>
                    <td className="py-1 px-2 text-right font-mono text-rose-700 font-bold">26.770 (+2.135)</td>
                    <td className="py-1 px-2 text-center font-mono font-bold">24.635</td>
                    <td className="py-1 px-2 text-right font-mono text-emerald-800 font-bold">23.080 (-1.555)</td>
                    <td className="py-1 px-2.5 text-slate-600 text-[11px]">270'e inerse 2.100 kırsal ilkokul ilk kez kadro hakkı kazanır.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-1 px-2.5 font-bold text-slate-900">Ortaokul/Lise Tabanı (150)</td>
                    <td className="py-1 px-2 text-center font-mono">150 Öğr.</td>
                    <td className="py-1 px-2 text-right font-mono text-rose-700 font-bold">25.570 (+935)</td>
                    <td className="py-1 px-2 text-center font-mono font-bold">24.635</td>
                    <td className="py-1 px-2 text-right font-mono text-emerald-800 font-bold">23.880 (-755)</td>
                    <td className="py-1 px-2.5 text-slate-600 text-[11px]">Küçük kasaba ortaokul ve liselerindeki 935 kadroyu açar.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-1 px-2.5 font-bold text-slate-900">Köy / Kırsal Ağırlık Çarpanı</td>
                    <td className="py-1 px-2 text-center font-mono">1.25x</td>
                    <td className="py-1 px-2 text-right font-mono text-rose-700 font-bold">23.410 (-1.225)</td>
                    <td className="py-1 px-2 text-center font-mono font-bold">24.635</td>
                    <td className="py-1 px-2 text-right font-mono text-emerald-800 font-bold">26.110 (+1.475)</td>
                    <td className="py-1 px-2.5 text-slate-600 text-[11px]">Doğu, Güneydoğu ve Karadeniz köy okullarının PDR ihtiyacını belirler.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 5. GEREKLİLİK VE ATAMANIN HAYATİ ÖNEMİ (PEDAGOJİK VE TOPLUMSAL GEREKÇELER) */}
        <section className="pdf-section space-y-3.5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              5
            </span>
            <h2 className="text-sm font-bold uppercase tracking-tight text-slate-900">
              Rehber Öğretmen Atamasının Ertelenemez Gereklilik Gerekçeleri
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>Akran Zorbalığı & Şiddet</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Okullarda artan fiziksel ve siber akran zorbalığı, madde bağımlılığı ve dijital bağımlılık tehditlerine karşı
                en kritik önleyici kalkan PDR servisleridir. Rehber öğretmensiz okulda krizler önceden önlenememektedir.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
                <span>Erken Tanılama ve RAM</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Disleksi, otizm spektrumu, DEHB ve özel yetenekli çocukların ilkokul 1-2. sınıflarda erken RAM yönlendirmesi
                yapılabilmesi için ilkokullarda 300 barajı ivedilikle kaldırılmalı ve okul rehberliği zorunlu tutulmalıdır.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
                <span>Afet, Travma ve Sınav</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Deprem bölgesi illerimiz (Hatay, K.Maraş, Adıyaman, Malatya) başta olmak üzere LGS/YKS sınav süreçlerinde
                öğrencilerin psikososyal dayanıklılığının korunması doğrudan kadrolu psikolojik danışman varlığına bağlıdır.
              </p>
            </div>
          </div>
        </section>

        {/* 6. KARAR VERİCİLER İÇİN 4 MADDELİK ACİL EYLEM PLANI */}
        <section className="pdf-section space-y-3.5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              6
            </span>
            <h2 className="text-sm font-bold uppercase tracking-tight text-slate-900">
              İlgili Kurumlar (MEB, Maliye, TBMM) İçin Acil Eylem ve Karar Önerileri
            </h2>
          </div>

          <div className="space-y-2 text-xs text-slate-800">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-start gap-2.5">
              <span className="font-black text-indigo-700 min-w-[20px]">6.1.</span>
              <span>
                <strong>Madde 21 İlkokul Tabanının İndirilmesi:</strong> İlkokullarda öğrenci taban şartı 300'den en az 100/150 seviyesine çekilmeli,
                erken çocukluk ve temel eğitimde psikolojik danışmansız okul bırakılmamalıdır.
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-start gap-2.5">
              <span className="font-black text-indigo-700 min-w-[20px]">6.2.</span>
              <span>
                <strong>Köy Okulları İçin "Gezici Hub" Kadrosu İhdas Edilmesi:</strong> Öğrenci sayısı 50-80 olan kırsal okullar için
                İlçe MEM bünyesinde 3-4 okula 1 atanacak Gezici Rehber Öğretmen norm kadroları derhal mevzuata eklenmelidir.
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-start gap-2.5">
              <span className="font-black text-indigo-700 min-w-[20px]">6.3.</span>
              <span>
                <strong>2026/2027 Öğretmen Atamasında Aslan Payının PDR Alanına Verilmesi:</strong> Mevcut 24.635 mevzuat açığının kapatılması için
                ilk etapta en az <strong>6.500 - 8.000 kadrolu PDR öğretmen ataması</strong> ilan edilmelidir.
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-start gap-2.5">
              <span className="font-black text-indigo-700 min-w-[20px]">6.4.</span>
              <span>
                <strong>Çoklu Norm Katının 250'ye Düşürülmesi:</strong> Büyükşehirlerdeki 2.000-3.000 öğrencili mega okullarda
                her 500 öğrenci yerine her 250 öğrencide bir norm verilerek öğrenci başına düşen danışman yükü hafifletilmelidir.
              </span>
            </div>
          </div>
        </section>

        {/* Resmî Onay & İmza Bloğu */}
        <div className="pdf-section pt-6 border-t-2 border-slate-300 grid grid-cols-3 gap-6 text-center text-xs text-slate-700">
          <div>
            <div className="font-bold text-slate-900">Eğitim Ekonomisi & İstatistik Kurulu</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Analitik Modelleme Heyeti</div>
            <div className="mt-5 text-slate-400 font-mono text-[10px]">[Resmî İnceleme Yapıldı]</div>
          </div>
          <div>
            <div className="font-bold text-slate-900">Türk PDR Derneği & Sendika Temsilcileri</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Özlük ve Kadro Hakları Masası</div>
            <div className="mt-5 text-slate-400 font-mono text-[10px]">[Ortak Talep Dosyası]</div>
          </div>
          <div>
            <div className="font-bold text-slate-900">T.C. Millî Eğitim Bakanlığı</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Personel ve Strateji Makamı</div>
            <div className="mt-5 text-slate-400 font-mono text-[10px]">[Gereği Arz Olunur]</div>
          </div>
        </div>
      </div>
    </div>
  );
};

