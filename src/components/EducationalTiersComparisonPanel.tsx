import React, { useState } from 'react';
import { formatNum } from '../utils/normCalculations';
import {
  GraduationCap,
  School,
  Briefcase,
  AlertTriangle,
  Users,
  CheckCircle2,
  TrendingDown,
  Info,
  ShieldAlert,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export interface EducationalTierData {
  id: string;
  category: 'ilkogretim' | 'ortaogretim' | 'mesleki';
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  schoolCount: number;
  studentCount: number;
  currentCounselors: number;
  legislationNorm: number;
  deficit: number;
  coverageRate: number;
  studentsPerCounselor: number;
  oecdComparison: number; // vs 250
  zeroNormSchools: number;
  zeroNormPercentage: number;
  legalThresholdRule: string;
  criticalChallenge: string;
  urgencyLevel: 'Aşırı Yüksek' | 'Yüksek' | 'Kritik Acil';
}

export const EDUCATIONAL_TIER_DATA: EducationalTierData[] = [
  {
    id: 'primary-elementary',
    category: 'ilkogretim',
    title: 'İlköğretim: İlkokullar (1 - 4. Sınıf)',
    subtitle: 'Temel Eğitim, Erken Çocukluk & Okul Öncesi',
    badge: 'En Büyük Açık Payı (%46)',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    schoolCount: 24500,
    studentCount: 5420000,
    currentCounselors: 14200,
    legislationNorm: 25480,
    deficit: 11280,
    coverageRate: 56,
    studentsPerCounselor: 382,
    oecdComparison: 153, // %153 of 250
    zeroNormSchools: 9800,
    zeroNormPercentage: 40,
    legalThresholdRule: 'Yönetmelik Madde 21: 300 Öğrenciye 1 Norm (500 katları ilave)',
    criticalChallenge:
      '300 öğrenci taban barajı nedeniyle 9.800 köy ve kasaba ilkokulu yasal olarak tek bir danışman dahi alamamaktadır. Disleksi, DEHB ve otizm gibi özel eğitim ihtiyaçları 1. sınıfta erken teşhis edilememektedir.',
    urgencyLevel: 'Kritik Acil',
  },
  {
    id: 'primary-middle',
    category: 'ilkogretim',
    title: 'İlköğretim: Ortaokullar (5 - 8. Sınıf)',
    subtitle: 'LGS Hazırlık, Ergenliğe Geçiş & Akran Zorbalığı',
    badge: 'Açık Payı: %34',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    schoolCount: 19100,
    studentCount: 5210000,
    currentCounselors: 17850,
    legislationNorm: 26150,
    deficit: 8300,
    coverageRate: 68,
    studentsPerCounselor: 292,
    oecdComparison: 117,
    zeroNormSchools: 1250,
    zeroNormPercentage: 7,
    legalThresholdRule: 'Yönetmelik Madde 21: 150 Öğrenciye 1 Norm (500 katları ilave)',
    criticalChallenge:
      '150 barajını aşan ancak 800 - 1.500 mevcutlu mega ortaokullarda yasal olarak 2 veya 3 norm hakkı varken, Maliye kadro kısıtı sebebiyle yalnızca 1 danışman görev yapmaktadır. LGS sınav stresi ve siber zorbalık tırmanıştadır.',
    urgencyLevel: 'Aşırı Yüksek',
  },
  {
    id: 'secondary-general',
    category: 'ortaogretim',
    title: 'Ortaöğretim: Genel Liseler (Anadolu, Fen, Sosyal Bilimler)',
    subtitle: 'YKS Kariyer Rehberliği, Gençlik Ruh Sağlığı & Kimlik',
    badge: 'Açık Payı: %12',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    schoolCount: 6820,
    studentCount: 5280000,
    currentCounselors: 10840,
    legislationNorm: 13745,
    deficit: 2905,
    coverageRate: 79,
    studentsPerCounselor: 487,
    oecdComparison: 195,
    zeroNormSchools: 280,
    zeroNormPercentage: 4,
    legalThresholdRule: 'Yönetmelik Madde 21: 150 Öğrenciye 1 Norm (500 katları ilave)',
    criticalChallenge:
      '2.000 öğrencili köklü Anadolu liselerinde 1 danışmana 500 öğrenci düşmektedir. YKS tercihi, üniversiteye geçiş, depresyon ve gelecek kaygısı seanslarında bireysel danışma randevuları aylar sonrasına kalmaktadır.',
    urgencyLevel: 'Yüksek',
  },
  {
    id: 'secondary-vocational',
    category: 'mesleki',
    title: 'Mesleki ve Teknik Liseler (MTAL & MESEM)',
    subtitle: 'Staj Güvenliği, Erken İş Hayatı, Madde Bağımlılığı & Sosyoekonomik Risk',
    badge: 'Açık Payı: %8 (Yüksek Risk)',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    schoolCount: 3920,
    studentCount: 2880000,
    currentCounselors: 4920,
    legislationNorm: 7070,
    deficit: 2150,
    coverageRate: 70,
    studentsPerCounselor: 585,
    oecdComparison: 234,
    zeroNormSchools: 150,
    zeroNormPercentage: 4,
    legalThresholdRule: 'Yönetmelik Madde 21: 150 Öğrenciye 1 Norm (Atölye/Staj Çarpanı Yok)',
    criticalChallenge:
      'Sanayide staj yapan, iş kazası ve erken ergenlik risklerine açık meslek lisesi öğrencilerinde devamsızlık ve okul terki en üst seviyededir. Mevzuatta MTAL okullarına özel risk çarpanı bulunmamaktadır.',
    urgencyLevel: 'Kritik Acil',
  },
];

export const EducationalTiersComparisonPanel: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ilkogretim' | 'ortaogretim' | 'mesleki'>('all');

  const filteredData =
    selectedCategory === 'all'
      ? EDUCATIONAL_TIER_DATA
      : EDUCATIONAL_TIER_DATA.filter((d) => d.category === selectedCategory);

  const totalDeficit = EDUCATIONAL_TIER_DATA.reduce((sum, d) => sum + d.deficit, 0);
  const primaryDeficit = EDUCATIONAL_TIER_DATA.filter((d) => d.category === 'ilkogretim').reduce((s, d) => s + d.deficit, 0);
  const generalSecDeficit = EDUCATIONAL_TIER_DATA.find((d) => d.id === 'secondary-general')?.deficit || 0;
  const vocationalDeficit = EDUCATIONAL_TIER_DATA.find((d) => d.id === 'secondary-vocational')?.deficit || 0;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
      {/* Header with Title and Filter Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Kademeler Bazında Karşılaştırmalı Döküm Paneli</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5">
            İlköğretim, Ortaöğretim ve Meslek Liseleri PDR İhtiyaç & Açık Dağılımı
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Türkiye genelindeki <strong>{formatNum(totalDeficit)} kişilik hukuki kadro açığının</strong> okul kademelerine göre net analizi
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md text-xs font-medium self-start md:self-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded transition-colors ${
              selectedCategory === 'all'
                ? 'bg-white text-slate-900 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tüm Kademeler (4)
          </button>
          <button
            onClick={() => setSelectedCategory('ilkogretim')}
            className={`px-3 py-1.5 rounded transition-colors ${
              selectedCategory === 'ilkogretim'
                ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            İlköğretim (İlkokul+Orta)
          </button>
          <button
            onClick={() => setSelectedCategory('ortaogretim')}
            className={`px-3 py-1.5 rounded transition-colors ${
              selectedCategory === 'ortaogretim'
                ? 'bg-white text-blue-700 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Genel Ortaöğretim
          </button>
          <button
            onClick={() => setSelectedCategory('mesleki')}
            className={`px-3 py-1.5 rounded transition-colors ${
              selectedCategory === 'mesleki'
                ? 'bg-white text-purple-700 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Meslek Liseleri (MTAL)
          </button>
        </div>
      </div>

      {/* Macro Ratio Bar: 24K Deficit Allocation Breakdown */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-slate-900">
          <span>24.635 Açığın Kademeler Arası Pasta Payı:</span>
          <span className="font-mono text-slate-600">Toplam: {formatNum(totalDeficit)} Kadro Açığı (%100)</span>
        </div>

        {/* Multi-segment proportional bar */}
        <div className="w-full h-4 bg-slate-200 rounded-md overflow-hidden flex text-[10px] font-bold text-white text-center leading-4">
          <div
            style={{ width: `${(11280 / totalDeficit) * 100}%` }}
            className="bg-rose-600 hover:opacity-90 transition-opacity flex items-center justify-center overflow-hidden"
            title="İlkokullar: 11.280 Açık (%46)"
          >
            İlkokul %46
          </div>
          <div
            style={{ width: `${(8300 / totalDeficit) * 100}%` }}
            className="bg-amber-500 hover:opacity-90 transition-opacity flex items-center justify-center overflow-hidden"
            title="Ortaokullar: 8.300 Açık (%34)"
          >
            Ortaokul %34
          </div>
          <div
            style={{ width: `${(2905 / totalDeficit) * 100}%` }}
            className="bg-blue-600 hover:opacity-90 transition-opacity flex items-center justify-center overflow-hidden"
            title="Genel Liseler: 2.905 Açık (%12)"
          >
            Lise %12
          </div>
          <div
            style={{ width: `${(2150 / totalDeficit) * 100}%` }}
            className="bg-purple-600 hover:opacity-90 transition-opacity flex items-center justify-center overflow-hidden"
            title="Meslek Liseleri (MTAL): 2.150 Açık (%8)"
          >
            MTAL %8
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0" />
            <span className="text-slate-700">İlkokul: <strong>{formatNum(11280)} Açık (%46)</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span className="text-slate-700">Ortaokul: <strong>{formatNum(8300)} Açık (%34)</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
            <span className="text-slate-700">Genel Lise: <strong>{formatNum(generalSecDeficit)} Açık (%12)</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />
            <span className="text-slate-700">Meslek (MTAL): <strong>{formatNum(vocationalDeficit)} Açık (%8)</strong></span>
          </div>
        </div>
      </div>

      {/* Comparative Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredData.map((tier) => (
          <div
            key={tier.id}
            className="border border-slate-200 rounded-lg p-5 bg-white hover:border-slate-300 transition-shadow hover:shadow-xs space-y-4"
          >
            {/* Tier Card Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${tier.badgeColor}`}>
                  {tier.badge}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{tier.title}</h3>
                <p className="text-[11px] text-slate-500">{tier.subtitle}</p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] text-slate-400 font-medium">Net İhtiyaç</div>
                <div className="text-lg font-black font-mono text-rose-700 tabular-nums">
                  -{formatNum(tier.deficit)}
                </div>
              </div>
            </div>

            {/* Metrics 4-Box Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <div className="text-[10px] text-slate-500">Okul / Öğrenci</div>
                <div className="font-bold text-slate-900 mt-0.5 tabular-nums font-mono text-xs">
                  {formatNum(tier.schoolCount)}
                </div>
                <div className="text-[10px] text-slate-500">{formatNum(tier.studentCount)} öğr.</div>
              </div>

              <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <div className="text-[10px] text-slate-500">Fiilen Görevde</div>
                <div className="font-bold text-slate-900 mt-0.5 tabular-nums font-mono text-xs">
                  {formatNum(tier.currentCounselors)}
                </div>
                <div className="text-[10px] text-emerald-700 font-medium font-mono">Norm: {formatNum(tier.legislationNorm)}</div>
              </div>

              <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <div className="text-[10px] text-slate-500">Doluluk Oranı</div>
                <div className="font-bold text-slate-900 mt-0.5 tabular-nums font-mono text-xs">
                  %{tier.coverageRate}
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      tier.coverageRate < 60
                        ? 'bg-rose-600'
                        : tier.coverageRate < 75
                        ? 'bg-amber-500'
                        : 'bg-emerald-600'
                    }`}
                    style={{ width: `${tier.coverageRate}%` }}
                  />
                </div>
              </div>

              <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <div className="text-[10px] text-slate-500">1 Danışman Başına</div>
                <div className="font-bold text-slate-900 mt-0.5 tabular-nums font-mono text-xs">
                  {tier.studentsPerCounselor} Öğr.
                </div>
                <div className="text-[10px] text-slate-500 font-mono">OECD: 250</div>
              </div>
            </div>

            {/* Zero Norm (Mahrumiyet) Alert Box */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-800">
                <span className="flex items-center gap-1 text-amber-700">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Baraj Altı Normsuz Kurumlar:
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {formatNum(tier.zeroNormSchools)} Okul (%{tier.zeroNormPercentage})
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                {tier.legalThresholdRule}
              </div>
            </div>

            {/* Critical Field Problem Description */}
            <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50/50 p-2.5 rounded border border-slate-100">
              <strong className="text-slate-900 font-medium">Sahadaki Kritik Engel: </strong>
              {tier.criticalChallenge}
            </p>
          </div>
        ))}
      </div>

      {/* Synthesis Footnote comparing Why 24k vs 900 Appointments */}
      <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-lg text-xs text-indigo-950 space-y-2">
        <div className="font-bold flex items-center gap-1.5 text-xs text-indigo-900">
          <Info className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Kademeler Analizinin Politika Özeti: Neden Bu Dağılım Hayatidir?</span>
        </div>
        <p className="leading-relaxed text-[11px] text-indigo-900">
          Bu karşılaştırma tablosu, MEB ve Maliye Bakanlığı arasındaki en büyük planlama kör noktasını açıkça kanıtlamaktadır:
          Açığın <strong>%80'i (19.580 kadro) ilköğretimde (ilkokul ve ortaokullarda)</strong> birikmiştir.
          Son 2 yılda yapılan ~900 küsür PDR ataması, yalnızca emekli olan psikolojik danışmanların yerini dahi doldurmaya yetmemiştir.
          Özellikle <strong>ilkokullardaki 11.280 kadro açığı</strong> ve <strong>meslek liselerindeki staj/bağımlılık riskleri</strong>,
          2026/2027 atama döneminde branş kontenjanının en az <strong>6.500 - 8.000 kadrolu PDR öğretmenine</strong> yükseltilmesini zorunlu kılmaktadır.
        </p>
      </div>
    </div>
  );
};
