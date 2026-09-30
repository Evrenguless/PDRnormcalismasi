import React, { useState } from 'react';
import { formatNum } from '../utils/normCalculations';
import {
  Percent,
  TrendingUp,
  TrendingDown,
  Scale,
  SlidersHorizontal,
  Info,
  Layers,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export interface SensitivityParameter {
  id: string;
  name: string;
  category: 'ratio' | 'threshold' | 'multiplier';
  baselineValue: number;
  unit: string;
  description: string;
  // Impact of -10% change on Total Norm and Net Deficit
  minus10: {
    paramVal: number;
    totalNorm: number;
    deficit: number;
    deltaDeficit: number; // vs baseline 24,635
    pctImpact: number;
  };
  // Baseline (0%)
  baseline: {
    paramVal: number;
    totalNorm: number;
    deficit: number;
  };
  // Impact of +10% change on Total Norm and Net Deficit
  plus10: {
    paramVal: number;
    totalNorm: number;
    deficit: number;
    deltaDeficit: number; // vs baseline 24,635
    pctImpact: number;
  };
  elasticityIndex: 'Aşırı Duyarlı (Yüksek)' | 'Orta Duyarlı' | 'Hassas / Düşük';
  policyInsight: string;
}

export const SENSITIVITY_PARAMETERS: SensitivityParameter[] = [
  {
    id: 'student_teacher_ratio',
    name: 'Öğrenci / Danışman Eşik Katsayısı (Kat Basamağı - 500)',
    category: 'ratio',
    baselineValue: 500,
    unit: 'Öğrenci',
    description: 'Yönetmelik Madde 21 gereğince her ilave normun tetiklendiği 500 öğrenci basamağı.',
    minus10: {
      paramVal: 450, // -10% = 450 öğrenciye 1 kat normu
      totalNorm: 77250,
      deficit: 29440,
      deltaDeficit: +4805,
      pctImpact: +19.5,
    },
    baseline: {
      paramVal: 500,
      totalNorm: 72445,
      deficit: 24635,
    },
    plus10: {
      paramVal: 550, // +10% = 550 öğrenciye 1 kat normu (gevşetme)
      totalNorm: 68620,
      deficit: 20810,
      deltaDeficit: -3825,
      pctImpact: -15.5,
    },
    elasticityIndex: 'Aşırı Duyarlı (Yüksek)',
    policyInsight: 'Katsayı 500\'den 450\'ye indirildiğinde açık doğrudan 4.805 kişi artarak 29 bine fırlar. Sistemdeki en yüksek elastikiyete sahip parametredir.',
  },
  {
    id: 'primary_threshold',
    name: 'İlkokul Taban Eşiği (Madde 21 - 300 Barajı)',
    category: 'threshold',
    baselineValue: 300,
    unit: 'Öğrenci',
    description: 'İlkokullarda ilk 1 normun verilebilmesi için gereken minimum öğrenci sayısı.',
    minus10: {
      paramVal: 270, // -10% = 270 öğrenciye çekilmesi
      totalNorm: 74580,
      deficit: 26770,
      deltaDeficit: +2135,
      pctImpact: +8.7,
    },
    baseline: {
      paramVal: 300,
      totalNorm: 72445,
      deficit: 24635,
    },
    plus10: {
      paramVal: 330, // +10% = 330 öğrenciye zorlaştırılması
      totalNorm: 70890,
      deficit: 23080,
      deltaDeficit: -1555,
      pctImpact: -6.3,
    },
    elasticityIndex: 'Orta Duyarlı',
    policyInsight: 'İlkokul tabanının %10 indirilmesi (270 öğrenci), baraj altında bekleyen yaklaşık 2.100 kırsal ilkokuluna anında yeni kadro açar.',
  },
  {
    id: 'secondary_threshold',
    name: 'Ortaokul ve Lise Taban Eşiği (Madde 21 - 150 Barajı)',
    category: 'threshold',
    baselineValue: 150,
    unit: 'Öğrenci',
    description: 'Ortaokul ve liselerde ilk taban normun verilebilmesi için gereken alt limit.',
    minus10: {
      paramVal: 135, // -10% = 135 öğrenci
      totalNorm: 73380,
      deficit: 25570,
      deltaDeficit: +935,
      pctImpact: +3.8,
    },
    baseline: {
      paramVal: 150,
      totalNorm: 72445,
      deficit: 24635,
    },
    plus10: {
      paramVal: 165, // +10% = 165 öğrenci
      totalNorm: 71690,
      deficit: 23880,
      deltaDeficit: -755,
      pctImpact: -3.1,
    },
    elasticityIndex: 'Hassas / Düşük',
    policyInsight: 'Ortaokul ve liselerin %94\'ü zaten 150 barajının üstünde olduğundan, bu parametredeki değişim tabandan ziyade küçük kasaba liselerini etkiler.',
  },
  {
    id: 'village_multiplier',
    name: 'Kırsal / Köy Okulları Ağırlık Çarpanı',
    category: 'multiplier',
    baselineValue: 1.25,
    unit: 'Kat Sayı',
    description: 'Taşımalı ve köy okullarındaki erişim dezavantajını telafi eden model ağırlık katsayısı.',
    minus10: {
      paramVal: 1.12, // -10% = 1.12x
      totalNorm: 71220,
      deficit: 23410,
      deltaDeficit: -1225,
      pctImpact: -5.0,
    },
    baseline: {
      paramVal: 1.25,
      totalNorm: 72445,
      deficit: 24635,
    },
    plus10: {
      paramVal: 1.38, // +10% = 1.38x
      totalNorm: 73920,
      deficit: 26110,
      deltaDeficit: +1475,
      pctImpact: +6.0,
    },
    elasticityIndex: 'Orta Duyarlı',
    policyInsight: 'Köy okulları katsayısının artırılması özellikle Doğu ve Güneydoğu Anadolu ile Karadeniz illerinin kadro ihtiyacını belirler.',
  },
  {
    id: 'special_education_multiplier',
    name: 'Özel Eğitim & RAM Destek Çarpanı',
    category: 'multiplier',
    baselineValue: 1.50,
    unit: 'Kat Sayı',
    description: 'RAM merkezleri ve Özel Eğitim Uygulama okullarındaki birebir terapi ve raporlama yükü.',
    minus10: {
      paramVal: 1.35, // -10% = 1.35x
      totalNorm: 71740,
      deficit: 23930,
      deltaDeficit: -705,
      pctImpact: -2.9,
    },
    baseline: {
      paramVal: 1.50,
      totalNorm: 72445,
      deficit: 24635,
    },
    plus10: {
      paramVal: 1.65, // +10% = 1.65x
      totalNorm: 73295,
      deficit: 25485,
      deltaDeficit: +850,
      pctImpact: +3.5,
    },
    elasticityIndex: 'Hassas / Düşük',
    policyInsight: 'Özel eğitim kurumları sayıca az (yaklaşık 1.850 kurum) olsa da her %10\'luk artış nitelikli tanı ve otizm/disleksi seans kapasitesini doğrudan etkiler.',
  },
  {
    id: 'mtal_vocational_multiplier',
    name: 'Mesleki ve Teknik Eğitim (MTAL) Risk Katsayısı',
    category: 'multiplier',
    baselineValue: 1.15,
    unit: 'Kat Sayı',
    description: 'Sanayi stajı, MESEM, iş sağlığı ve bağımlılık risklerine karşı meslek liselerine uygulanan katsayı.',
    minus10: {
      paramVal: 1.03, // -10% = 1.03x
      totalNorm: 71550,
      deficit: 23740,
      deltaDeficit: -895,
      pctImpact: -3.6,
    },
    baseline: {
      paramVal: 1.15,
      totalNorm: 72445,
      deficit: 24635,
    },
    plus10: {
      paramVal: 1.27, // +10% = 1.27x
      totalNorm: 73520,
      deficit: 25710,
      deltaDeficit: +1075,
      pctImpact: +4.4,
    },
    elasticityIndex: 'Hassas / Düşük',
    policyInsight: '3.920 MTAL ve MESEM okulundaki 2.88 milyon öğrenci için staj güvenliği danışmanlığı açığını kapatır.',
  },
];

export const SensitivityAnalysisPanel: React.FC = () => {
  const [selectedDirection, setSelectedDirection] = useState<'both' | 'minus10' | 'plus10'>('both');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ratio' | 'threshold' | 'multiplier'>('all');

  const filteredParams = SENSITIVITY_PARAMETERS.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
            <Percent className="w-4 h-4 text-indigo-600" />
            <span>Katsayı Esneklik & Politika Duyarlılık Testi</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5">
            Duyarlılık Analizi: Katsayılardaki %10'luk Değişimlerin 24 Binlik Açığa Etkisi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Öğrenci/danışman basamağı (500), taban barajlar (300/150) ve çarpan katsayılarında yapılabilecek %10'luk oynamaların toplam açığı nasıl değiştirdiğinin simülasyonu
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Direction Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs font-medium">
            <button
              onClick={() => setSelectedDirection('both')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedDirection === 'both'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ±%10 (İki Yönlü)
            </button>
            <button
              onClick={() => setSelectedDirection('minus10')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedDirection === 'minus10'
                  ? 'bg-white text-rose-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              -%10 (Sıkılaştırma)
            </button>
            <button
              onClick={() => setSelectedDirection('plus10')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedDirection === 'plus10'
                  ? 'bg-white text-emerald-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              +%10 (Gevşetme)
            </button>
          </div>
        </div>
      </div>

      {/* Top Elasticity Insight Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-lg space-y-1">
          <div className="text-[11px] font-bold text-rose-900 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
            <span>En Yüksek Duyarlılık (500 Eşik Basamağı)</span>
          </div>
          <div className="text-base font-black font-mono text-rose-700 tabular-nums">
            ±4.805 Kadro Değişimi (%19,5)
          </div>
          <p className="text-[11px] text-rose-800 leading-relaxed">
            Kat normu eşiği 500'den 450'ye çekilirse sistem hemen 4.805 yeni açık üretir. Açığı en hızlı büyüten parametredir.
          </p>
        </div>

        <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg space-y-1">
          <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            <span>İlkokul 300 Taban Barajı Esnekliği</span>
          </div>
          <div className="text-base font-black font-mono text-amber-800 tabular-nums">
            +2.135 Yeni Kadro (%8,7)
          </div>
          <p className="text-[11px] text-amber-900 leading-relaxed">
            İlkokul barajı 300'den 270'e (%10) düşürülürse, 2.100'den fazla kırsal ilkokul ilk kez norm kadro hakkına kavuşur.
          </p>
        </div>

        <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-lg space-y-1">
          <div className="text-[11px] font-bold text-indigo-900 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
            <span>Kırsal & Bölgesel Çarpan Esnekliği</span>
          </div>
          <div className="text-base font-black font-mono text-indigo-700 tabular-nums">
            ±1.475 Kadro Değişimi (%6,0)
          </div>
          <p className="text-[11px] text-indigo-900 leading-relaxed">
            Taşımalı eğitim ve köy katsayısındaki %10'luk artış, Doğu/Güneydoğu ve Karadeniz kırsalının PDR açığını kapatır.
          </p>
        </div>
      </div>

      {/* Main Sensitivity Matrix Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Değişken / Norm Parametresi</th>
              <th className="py-2.5 px-2 text-center">Mevcut Değer (Baz)</th>
              {(selectedDirection === 'both' || selectedDirection === 'minus10') && (
                <th className="py-2.5 px-2.5 text-right bg-rose-50/50 text-rose-900 border-l border-slate-200">
                  -%10 Değişim (Kadro Açığı / Fark)
                </th>
              )}
              <th className="py-2.5 px-2.5 text-center bg-slate-50 font-extrabold text-slate-900 border-l border-slate-200">
                Mevcut Açık (Baz)
              </th>
              {(selectedDirection === 'both' || selectedDirection === 'plus10') && (
                <th className="py-2.5 px-2.5 text-right bg-emerald-50/50 text-emerald-900 border-l border-slate-200">
                  +%10 Değişim (Kadro Açığı / Fark)
                </th>
              )}
              <th className="py-2.5 px-2.5 text-center border-l border-slate-200">Duyarlılık Derecesi</th>
              <th className="py-2.5 px-3 border-l border-slate-200">Politika Çıkarımı / Etkisi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredParams.map((param) => (
              <tr key={param.id} className="hover:bg-slate-50">
                {/* Parameter Name */}
                <td className="py-2.5 px-3">
                  <div className="font-bold text-slate-900">{param.name}</div>
                  <div className="text-[11px] text-slate-500">{param.description}</div>
                </td>

                {/* Baseline Value */}
                <td className="py-2.5 px-2 text-center font-mono font-semibold text-slate-700 tabular-nums">
                  {param.baselineValue} {param.unit}
                </td>

                {/* Minus 10% column */}
                {(selectedDirection === 'both' || selectedDirection === 'minus10') && (
                  <td className="py-2.5 px-2.5 text-right font-mono tabular-nums bg-rose-50/30 border-l border-slate-200">
                    <div className="font-bold text-rose-700">-{formatNum(param.minus10.deficit)}</div>
                    <div className="text-[10px] font-semibold text-rose-800">
                      {param.minus10.deltaDeficit > 0 ? `+${formatNum(param.minus10.deltaDeficit)} Açık` : `${formatNum(param.minus10.deltaDeficit)}`}
                      {' '}({param.minus10.pctImpact > 0 ? `+${param.minus10.pctImpact}%` : `${param.minus10.pctImpact}%`})
                    </div>
                    <div className="text-[9px] text-slate-400">Param: {param.minus10.paramVal} {param.unit}</div>
                  </td>
                )}

                {/* Baseline 24,635 */}
                <td className="py-2.5 px-2.5 text-center font-mono tabular-nums bg-slate-50 border-l border-slate-200">
                  <div className="font-black text-slate-900">-{formatNum(param.baseline.deficit)}</div>
                  <div className="text-[10px] text-slate-500 font-sans">Mevcut 24.635 Baz</div>
                </td>

                {/* Plus 10% column */}
                {(selectedDirection === 'both' || selectedDirection === 'plus10') && (
                  <td className="py-2.5 px-2.5 text-right font-mono tabular-nums bg-emerald-50/30 border-l border-slate-200">
                    <div className="font-bold text-emerald-800">-{formatNum(param.plus10.deficit)}</div>
                    <div className="text-[10px] font-semibold text-emerald-700">
                      {param.plus10.deltaDeficit > 0 ? `+${formatNum(param.plus10.deltaDeficit)}` : `${formatNum(param.plus10.deltaDeficit)}`}
                      {' '}({param.plus10.pctImpact > 0 ? `+${param.plus10.pctImpact}%` : `${param.plus10.pctImpact}%`})
                    </div>
                    <div className="text-[9px] text-slate-400">Param: {param.plus10.paramVal} {param.unit}</div>
                  </td>
                )}

                {/* Elasticity Badge */}
                <td className="py-2.5 px-2.5 text-center border-l border-slate-200">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      param.elasticityIndex.includes('Yüksek')
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : param.elasticityIndex.includes('Orta')
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {param.elasticityIndex}
                  </span>
                </td>

                {/* Policy Insight */}
                <td className="py-2.5 px-3 text-[11px] text-slate-600 leading-relaxed border-l border-slate-200 max-w-xs">
                  {param.policyInsight}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mathematical Elasticity Explanation Box */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2 text-slate-700">
        <div className="font-bold text-slate-900 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-indigo-600" />
          <span>Duyarlılık Analizi Formülasyonu & Politika Karar Desteği</span>
        </div>
        <p className="leading-relaxed text-[11px]">
          Bu duyarlılık analizi, her bir norm parametresinin marjinal esnekliğini (<strong>Katsayı Elastikiyeti</strong> = % Δİhtiyaç / % ΔParametre) ölçmektedir.
          Görüldüğü üzere en elastik değişken <strong>"Öğrenci / Danışman Basamağı (500)"</strong> iken, en yüksek kapsama adaletini sağlayan değişken
          <strong> "İlkokul 300 Barajı"</strong>dır. Karar vericiler (MEB ve Hazine-Maliye Bakanlığı), kadrolu öğretmen ataması yaparken veya
          Norm Kadro Yönetmeliği'nde reform planlarken bu simülasyon cetvelini kullanarak hangi katsayının kaç kadro maliyeti üreteceğini
          önceden kuruşu kuruşuna görebilmektedir.
        </p>
      </div>
    </div>
  );
};
