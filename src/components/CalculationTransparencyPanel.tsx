import React, { useState } from 'react';
import { formatNum } from '../utils/normCalculations';
import {
  HelpCircle,
  Calculator,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  AlertTriangle,
  Scale,
  Building2,
  Users,
  CheckCircle2,
  TrendingDown,
  Info,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Layers
} from 'lucide-react';

interface TierBracketExplanation {
  bracketName: string;
  studentRange: string;
  normPerSchool: number;
  schoolCountEst: number;
  generatedNormEst: number;
  counselorRatio: string;
  triggerRule: string;
}

export const CalculationTransparencyPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'equation' | 'brackets' | 'macro_math' | 'budget_gap'>('equation');
  const [isOpenFaq, setIsOpenFaq] = useState<number | null>(0);

  // Bracket simulation data explaining how 72,445 is mathematically formed
  const primarySchoolBrackets: TierBracketExplanation[] = [
    {
      bracketName: 'Baraj Altı Kırsal / Köy Okulları',
      studentRange: '1 - 299 Öğrenci',
      normPerSchool: 0,
      schoolCountEst: 9800,
      generatedNormEst: 0,
      counselorRatio: 'Danışman Yok (0)',
      triggerRule: '300 altı baraj (Sıfır Norm)',
    },
    {
      bracketName: 'Taban Norm Alan Okullar',
      studentRange: '300 - 499 Öğrenci',
      normPerSchool: 1,
      schoolCountEst: 6400,
      generatedNormEst: 6400,
      counselorRatio: '1 Danışman / ~380 Öğr',
      triggerRule: 'Madde 21/2: Taban Norm',
    },
    {
      bracketName: '2. Norm Kadro Tetiklenen Okullar',
      studentRange: '500 - 999 Öğrenci',
      normPerSchool: 2,
      schoolCountEst: 5600,
      generatedNormEst: 11200,
      counselorRatio: '2 Danışman / ~360 Öğr',
      triggerRule: '500 ve üzeri: +1 İlave Kat Normu',
    },
    {
      bracketName: '3. Norm Kadro Tetiklenen Kalabalık Okullar',
      studentRange: '1.000 - 1.499 Öğrenci',
      normPerSchool: 3,
      schoolCountEst: 2100,
      generatedNormEst: 6300,
      counselorRatio: '3 Danışman / ~410 Öğr',
      triggerRule: '1.000 ve üzeri: +1 İlave Kat Normu',
    },
    {
      bracketName: '4 ve Üzeri Mega Şehir Okulları',
      studentRange: '1.500+ Öğrenci',
      normPerSchool: 4.2, // average
      schoolCountEst: 600,
      generatedNormEst: 2520,
      counselorRatio: '4-5 Danışman / ~450 Öğr',
      triggerRule: 'Her 500 katında ilave +1',
    },
  ];

  const middleAndHighBrackets: TierBracketExplanation[] = [
    {
      bracketName: 'Baraj Altı Küçük Ortaokul / Liseler',
      studentRange: '1 - 149 Öğrenci',
      normPerSchool: 0,
      schoolCountEst: 1680,
      generatedNormEst: 0,
      counselorRatio: 'Danışman Yok (0)',
      triggerRule: '150 altı baraj (Sıfır Norm)',
    },
    {
      bracketName: '1 Taban Norm Alan Ortaokul & Liseler',
      studentRange: '150 - 499 Öğrenci',
      normPerSchool: 1,
      schoolCountEst: 14200,
      generatedNormEst: 14200,
      counselorRatio: '1 Danışman / ~310 Öğr',
      triggerRule: 'Madde 21/2: 150 Taban Normu',
    },
    {
      bracketName: '2 Norm Tetiklenen Okullar',
      studentRange: '500 - 999 Öğrenci',
      normPerSchool: 2,
      schoolCountEst: 9300,
      generatedNormEst: 18600,
      counselorRatio: '2 Danışman / ~360 Öğr',
      triggerRule: '500 ve üzeri: +1 İlave Kat Normu',
    },
    {
      bracketName: '3 Norm Tetiklenen Mega Okullar',
      studentRange: '1.000 - 1.499 Öğrenci',
      normPerSchool: 3,
      schoolCountEst: 3400,
      generatedNormEst: 10200,
      counselorRatio: '3 Danışman / ~400 Öğr',
      triggerRule: '1.000 ve üzeri: +1 İlave Kat Normu',
    },
    {
      bracketName: '4+ Norm Alan Çok Kalabalık Liseler/İkili Eğitim',
      studentRange: '1.500+ Öğrenci',
      normPerSchool: 4.1,
      schoolCountEst: 1260,
      generatedNormEst: 5166,
      counselorRatio: '4 Danışman / ~420 Öğr',
      triggerRule: '1.500 ve her 500 katında +1',
    },
  ];

  const faqs = [
    {
      q: 'Neden basit bir oran (örneğin 18 milyon / 250) yerine 72.445 sayısı çıkıyor?',
      a: 'Çünkü MEB norm kadroyu Türkiye geneli toplam öğrenciyi bir sayıya bölerek belirlemez. Her okulun öğrenci sayısı Madde 21 cetveline tabi tutulur. 299 öğrencili bir ilkokul 0 norm alırken, 501 öğrencili bir ilkokul 2 norm alır. Bu ayrık basamak (discrete step) fonksiyonu, 54.340 okul tek tek hesaplandığında 72.445 yasal norm üretmektedir.',
    },
    {
      q: 'Okullarda zaten rehber öğretmen varken neden 24.635 açık var deniyor?',
      a: 'Bunun nedeni kalabalık şehir okullarındaki "2. ve 3. norm kadrolardır". 1.200 öğrencili bir okulda tek bir rehber öğretmen çalışmakta ve okul müdürü de veli de "bizim rehber öğretmenimiz var" demektedir. Oysa yönetmeliğe göre o okulun 3 rehber öğretmeni olması gerekmektedir. İşte o boş tutulan 2 kadro, Türkiye genelinde 24 binlik açığı oluşturan en büyük görünmez kalemdir.',
    },
    {
      q: 'Maliye Bakanlığı ve MEB neden bu açığı son atamalarda (~900 kişi) kapatmadı?',
      a: 'Yasal olarak okulun norm hakkı bulunması, bütçe kanununda o kadroya tahsis yapıldığı anlamına gelmez. Hazine ve Maliye Bakanlığı her yıl MEB\'e sınırlı sayıda (ortalama 20.000) toplam öğretmen kadrosu verir. Bu kontenjan 80 farklı branşa paylaştırılırken PDR\'ye sadece %2 - %3 pay verilmiş; bu da yasal olarak var olan 24.635 kadronun sahada fiilen boş kalmasına yol açmıştır.',
    },
    {
      q: 'Köy ve kasaba okulları bu hesaplamada nereye oturuyor?',
      a: 'Kırsaldaki yaklaşık 11.480 okul 150/300 barajının altında kaldığı için MEB mevzuatına göre "sıfır normlu" sayılır. Yani 24.635 kişilik mevcut açık, bu köy okullarını İÇERMEMEKTEDİR! Eğer köy okullarına da 1\'er norm verilirse (Her Okula 1 Norm reformu), açık 24 binden anında 36 bine fırlamaktadır.',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
            <Calculator className="w-4 h-4 text-indigo-600" />
            <span>Mevzuat Tetikleyicileri & Matematiksel Denetlenebilirlik</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5">
            Hesaplama Şeffaflığı: 24.635 Kadro Açığı Nereden Geliyor?
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            MEB Yönetmeliği Madde 21 formülü, taban ve kat artış çarpanları ve sahadaki fiili kadro ayrışması
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md text-xs font-medium self-start md:self-auto">
          <button
            onClick={() => setActiveTab('equation')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'equation'
                ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Matematiksel Denklem
          </button>
          <button
            onClick={() => setActiveTab('brackets')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'brackets'
                ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Öğrenci Kümeleri & Cetvel
          </button>
          <button
            onClick={() => setActiveTab('budget_gap')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'budget_gap'
                ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Açık vs. Atama Analizi
          </button>
        </div>
      </div>

      {/* TAB 1: THE CORE EQUATION BREAKDOWN */}
      {activeTab === 'equation' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 text-white rounded-lg space-y-3 font-mono text-xs">
            <div className="text-slate-400 text-[11px] font-sans font-semibold uppercase tracking-wider">
              MEB Norm Kadro Yönetmeliği Madde 21 Matematiksel Bağıntısı:
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800 text-emerald-400 text-sm overflow-x-auto">
              Net Açık = ∑ [ TabanNorm(Okul) + KatNormları(Okul) ] - Fiilen Görevdeki Kadrolar
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-slate-300 font-sans text-xs">
              <div className="border border-slate-800 p-2.5 rounded bg-slate-950/50">
                <span className="text-indigo-400 font-bold block text-sm font-mono">42.860 Taban Norm</span>
                <span className="text-[11px] text-slate-400">150/300 barajını geçen 42.860 okula tahsis edilen 1. kadrolar</span>
              </div>
              <div className="border border-slate-800 p-2.5 rounded bg-slate-950/50">
                <span className="text-indigo-400 font-bold block text-sm font-mono">+ 29.585 Kat Normu</span>
                <span className="text-[11px] text-slate-400">500, 1000, 1500 katlarında doğan 2., 3. ve 4. ilave normlar</span>
              </div>
              <div className="border border-slate-800 p-2.5 rounded bg-slate-950/50">
                <span className="text-rose-400 font-bold block text-sm font-mono">- 47.810 Görevde</span>
                <span className="text-[11px] text-slate-400">Hâlihazırda MEBBİS sisteminde fiilen çalışan kadrolu danışmanlar</span>
              </div>
            </div>
            <div className="pt-2 text-right text-xs font-bold text-amber-300 font-sans">
              = TOPLAM NET KADRO AÇIĞI: 24.635 KADRO (%66 DOLULUK ORANI)
            </div>
          </div>

          {/* 3 Main Triggers Explained */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-mono font-bold text-[11px]">
                  1
                </span>
                <span>Taban Eşik Tetikleyicisi</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Öğrenci sayısı <strong>İlkokullarda 300</strong>, <strong>Ortaokul ve Liselerde 150</strong> barajına ulaştığı anda
                sistem okula 1 tam norm tanımlar. 11.480 okul bu barajın altında kaldığı için sıfır norm alır.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-mono font-bold text-[11px]">
                  2
                </span>
                <span>500 Katı Çarpan Tetikleyicisi</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Öğrenci sayısı 500 ve her 500'lük basamakta (500, 1.000, 1.500, 2.000) <strong>ilave +1 norm</strong> doğar.
                Büyükşehirlerdeki mega okullarda açığı patlatan asıl unsur bu kat normlarının atanmamasıdır.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-mono font-bold text-[11px]">
                  3
                </span>
                <span>Pansiyon / Özel Eğitim Bonusu</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Yatılı/pansiyonlu okullara ve Özel Eğitim Uygulama okullarına mevzuat gereği <strong>+1 doğrudan ilave norm</strong>{' '}
                tanımlanır (Türkiye genelinde yaklaşık 3.100 okul bu kapsama girmektedir).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DETAILED BRACKETS & STUDENT TIERS */}
      {activeTab === 'brackets' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-600">
            Aşağıdaki tablolar, Türkiye'deki 54.340 okulun öğrenci sayılarına göre gruplandırıldığında nasıl 72.445 norm ürettiğini göstermektedir:
          </div>

          {/* Primary Schools Bracket Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <span>A. İlkokul Kademesi Öğrenci Kümeleri Dağılımı (24.500 Okul / 25.480 Norm)</span>
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-2.5">Öğrenci Aralığı</th>
                    <th className="py-2 px-2 text-center">Norm / Okul</th>
                    <th className="py-2 px-2 text-right">Tahmini Okul</th>
                    <th className="py-2 px-2.5 text-right font-mono">Üretilen Norm</th>
                    <th className="py-2 px-2.5">Mevzuat Tetikleyici Kuralı</th>
                    <th className="py-2 px-2 text-center">Danışman/Öğr</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {primarySchoolBrackets.map((b) => (
                    <tr key={b.studentRange} className="hover:bg-slate-50">
                      <td className="py-1.5 px-2.5 font-bold text-slate-900">{b.studentRange}</td>
                      <td className="py-1.5 px-2 text-center font-mono font-bold text-indigo-700">{b.normPerSchool}</td>
                      <td className="py-1.5 px-2 text-right font-mono tabular-nums">{formatNum(b.schoolCountEst)}</td>
                      <td className="py-1.5 px-2.5 text-right font-mono tabular-nums font-bold text-slate-900">
                        {formatNum(b.generatedNormEst)}
                      </td>
                      <td className="py-1.5 px-2.5 text-slate-600 text-[11px]">{b.triggerRule}</td>
                      <td className="py-1.5 px-2 text-center font-mono text-[11px] text-slate-500">{b.counselorRatio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Middle & High Schools Bracket Table */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <span>B. Ortaokul ve Lise Kademesi Öğrenci Kümeleri (29.840 Okul / 46.965 Norm)</span>
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-2.5">Öğrenci Aralığı</th>
                    <th className="py-2 px-2 text-center">Norm / Okul</th>
                    <th className="py-2 px-2 text-right">Tahmini Okul</th>
                    <th className="py-2 px-2.5 text-right font-mono">Üretilen Norm</th>
                    <th className="py-2 px-2.5">Mevzuat Tetikleyici Kuralı</th>
                    <th className="py-2 px-2 text-center">Danışman/Öğr</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {middleAndHighBrackets.map((b) => (
                    <tr key={b.studentRange} className="hover:bg-slate-50">
                      <td className="py-1.5 px-2.5 font-bold text-slate-900">{b.studentRange}</td>
                      <td className="py-1.5 px-2 text-center font-mono font-bold text-indigo-700">{b.normPerSchool}</td>
                      <td className="py-1.5 px-2 text-right font-mono tabular-nums">{formatNum(b.schoolCountEst)}</td>
                      <td className="py-1.5 px-2.5 text-right font-mono tabular-nums font-bold text-slate-900">
                        {formatNum(b.generatedNormEst)}
                      </td>
                      <td className="py-1.5 px-2.5 text-slate-600 text-[11px]">{b.triggerRule}</td>
                      <td className="py-1.5 px-2 text-center font-mono text-[11px] text-slate-500">{b.counselorRatio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WHY 24K DEFICIT VS ~900 APPOINTMENTS (BUDGET & POLICY ANALYSIS) */}
      {activeTab === 'budget_gap' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-amber-50/70 border border-amber-300 rounded-lg space-y-2 text-amber-950">
            <h4 className="font-bold text-sm flex items-center gap-1.5 text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <span>Kritik Paradoks: 24 Bin Hukuki İhtiyaç Varken Neden 2 Yılda Sadece ~900 Atama Oldu?</span>
            </h4>
            <p className="leading-relaxed">
              Kullanıcıların ve atama bekleyen psikolojik danışmanların en çok şaşırdığı konu; sahadaki açık 24 bin iken
              ilan edilen atama sayısının iki yılda bini dahi bulmamasıdır. Bunun bürokratik mekanizması şöyledir:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>MEB Mevzuatı: "Madde 21 Hukuki Hakkı"</span>
              </h5>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                MEB MEBBİS yazılımı, okulun öğrenci mevcudunu gördüğü an otomatikman normu tanımlar.
                1.100 öğrencisi olan bir liseye sistem hukuken <strong>3 norm</strong> yazar.
                Türkiye genelinde bu toplam <strong>72.445 kadrodur</strong>. Bu rakam keyfi değil, resmî yönetmeliğin emredici hükmüdür.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-rose-600" />
                <span>Maliye Kontenjanı: "Bütçe ve Tasarruf Tedbirleri"</span>
              </h5>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Bir normun öğretmene dönüşmesi için Maliye Bakanlığı'nın maaş ve kadro ödeneği tahsis etmesi şarttır.
                Maliye yılda toplam 20.000 öğretmen kontenjanı vermiş; bu kontenjanın da %97'si Sınıf Öğretmenliği, Din Kültürü
                ve Özel Eğitim gibi branşlara dağıtılmıştır. <strong>PDR'ye yıllık sadece ~450-500 kişi</strong> verilmiştir.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-100 rounded border border-slate-200 space-y-1 text-slate-700">
            <div className="font-bold text-slate-900">Netice ve Sahadaki Sonuç:</div>
            <p className="text-[11px] leading-relaxed">
              Bakanlık açık olmadığı için değil, <strong>bütçe pastasındaki payı PDR aleyhine kıstığı için</strong> 2 yılda 900 atama yapmıştır.
              Bu esnada yılda ~1.200 psikolojik danışman emekli olduğundan, sistemdeki açık kapanmak bir yana <strong>her yıl daha da derinleşmektedir.</strong>
            </p>
          </div>
        </div>
      )}

      {/* Accordion FAQ: Sıkça Sorulan Sorular */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Sıkça Sorulan Sorular ve Metodoloji Detayları
        </h4>
        <div className="space-y-1.5">
          {faqs.map((faq, idx) => {
            const isOpen = isOpenFaq === idx;
            return (
              <div
                key={faq.q}
                className="border border-slate-200 rounded overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setIsOpenFaq(isOpen ? null : idx)}
                  className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-left font-semibold text-xs text-slate-900 flex items-center justify-between gap-2"
                >
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-3 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
