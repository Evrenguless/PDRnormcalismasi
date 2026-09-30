import React, { useState } from 'react';
import { SchoolType, PolicyWeights } from '../types/pdr';
import {
  getNormBracketDetail,
  getDiscreteLadderSteps,
  formatNum,
  MEB_REGULATION_ARTICLE_21_TEXT,
  DEFAULT_POLICY_WEIGHTS,
} from '../utils/normCalculations';
import {
  Calculator,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  HelpCircle,
  School,
  FileCheck2,
  Building,
  Bed,
} from 'lucide-react';

interface DiscreteNormLadderProps {
  weights?: PolicyWeights;
}

export const DiscreteNormLadder: React.FC<DiscreteNormLadderProps> = ({
  weights = DEFAULT_POLICY_WEIGHTS,
}) => {
  const [selectedType, setSelectedType] = useState<SchoolType>('Ortaokul');
  const [testStudentCount, setTestStudentCount] = useState<number>(480);
  const [isBoarding, setIsBoarding] = useState<boolean>(false);
  const [showLegalText, setShowLegalText] = useState<boolean>(false);

  const isPrimary =
    selectedType === 'İlkokul' || selectedType === 'Birleştirilmiş Sınıflı Köy İlkokulu';
  const isSpecialEd = selectedType === 'Özel Eğitim Uygulama / RAM';

  const categoryKey = isSpecialEd ? 'ozel_egitim' : isPrimary ? 'ilkokul' : 'ortaokul_lise';

  const bracketDetail = getNormBracketDetail(selectedType, testStudentCount, isBoarding);
  const ladderSteps = getDiscreteLadderSteps(categoryKey);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <span>Resmî Gazete: 18/6/2014 - 29034 (Değişiklik: 25/11/2016 - 29899)</span>
            <span aria-hidden="true">·</span>
            <span>Madde 21 Rehberlik Alan Öğretmeni</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            MEB Yönetmeliği Madde 21: Okul Düzeyinde Norm ve Kat Artış Cetveli
          </h2>
          <p className="mt-1 text-xs text-slate-600 max-w-3xl">
            Norm kadro toplam il mevcudundan değil; her okulun öğrenci sayısının yönetmelikteki
            <strong> taban eşik (300 / 150 / 25) ve her 500 / 100 öğrencilik ilave katlarına</strong> göre teker teker hesaplanır.
          </p>
        </div>

        <button
          onClick={() => setShowLegalText(!showLegalText)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors self-start sm:self-auto whitespace-nowrap shadow-xs"
        >
          <FileCheck2 className="w-3.5 h-3.5 text-indigo-600" />
          <span>{showLegalText ? 'Mevzuat Metnini Gizle' : 'Yönetmelik Madde 21 Metni'}</span>
        </button>
      </div>

      {/* Verbatim Legal Text Dropdown / Drawer */}
      {showLegalText && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 text-xs leading-relaxed text-slate-700">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="font-bold text-slate-900">{MEB_REGULATION_ARTICLE_21_TEXT.title}</span>
            <span className="text-[11px] text-slate-400 font-mono">{MEB_REGULATION_ARTICLE_21_TEXT.reference}</span>
          </div>
          <div className="space-y-2">
            {MEB_REGULATION_ARTICLE_21_TEXT.paragraphs.map((p, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="font-mono font-bold text-indigo-700 shrink-0">{p.clause}</span>
                <span className="text-slate-800">{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive School Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
          <div className="font-bold text-slate-900 flex items-center gap-2 text-sm">
            <Calculator className="w-4 h-4 text-indigo-600" />
            <span>Okul Norm Katı Hesaplayıcı</span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Okul Türü:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as SchoolType)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-medium text-slate-800"
            >
              <option value="İlkokul">İlkokul (Madde 21/2-b: Taban 300, Kat 500)</option>
              <option value="Ortaokul">Ortaokul (Madde 21/2-b: Taban 150, Kat 500)</option>
              <option value="Anadolu Lisesi">Ortaöğretim / Lise (Madde 21/2-c: Taban 150, Kat 500)</option>
              <option value="Mesleki ve Teknik Anadolu Lisesi (MTAL)">Mesleki ve Teknik Anadolu Lisesi (MTAL)</option>
              <option value="Birleştirilmiş Sınıflı Köy İlkokulu">Birleştirilmiş Sınıflı Köy İlkokulu (Kırsal)</option>
              <option value="Özel Eğitim Uygulama / RAM">Özel Eğitim Kurumu (Madde 21/2-a: Taban 25, Kat 100)</option>
            </select>
          </div>

          {/* Boarding School Checkbox (Madde 21/2-ç) */}
          <div className="p-2.5 bg-white border border-slate-200 rounded">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
              <input
                type="checkbox"
                checked={isBoarding}
                onChange={(e) => setIsBoarding(e.target.checked)}
                className="rounded text-indigo-600 accent-indigo-600"
              />
              <span className="flex items-center gap-1.5">
                <Bed className="w-3.5 h-3.5 text-indigo-600" />
                <span>Yatılı veya Pansiyonlu Okul (Madde 21/2-ç)</span>
              </span>
            </label>
            <span className="block text-[11px] text-slate-500 mt-1 pl-5">
              *Öğrenci sayısına bakılmaksızın her birine doğrudan en az 1 norm verilir.
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-700">Okulun Öğrenci Sayısı:</label>
              <span className="font-mono text-sm font-bold text-indigo-700 tabular-nums">
                {formatNum(testStudentCount)} Öğrenci
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="2800"
              step="10"
              value={testStudentCount}
              onChange={(e) => setTestStudentCount(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
              <span>10 (Köy)</span>
              <span>150 (Ortaokul Tabanı)</span>
              <span>300 (İlkokul Tabanı)</span>
              <span>500 (2. Norm)</span>
              <span>1.000 (3. Norm)</span>
              <span>2.500</span>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="pt-2 border-t border-slate-200">
            <span className="text-[11px] text-slate-500 block mb-1.5">Kritik Eşik Değerleri Test Et:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setTestStudentCount(120)}
                className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] hover:bg-slate-100"
              >
                120 (Baraj Altı)
              </button>
              <button
                onClick={() => setTestStudentCount(150)}
                className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] hover:bg-slate-100"
              >
                150 (Tam 1. Norm)
              </button>
              <button
                onClick={() => setTestStudentCount(300)}
                className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] hover:bg-slate-100"
              >
                300 (İlkokul Tabanı)
              </button>
              <button
                onClick={() => setTestStudentCount(490)}
                className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] hover:bg-slate-100"
              >
                490 (Hâlâ 1 Norm)
              </button>
              <button
                onClick={() => setTestStudentCount(500)}
                className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] hover:bg-slate-100 font-semibold text-indigo-700"
              >
                500 (2. Norm Katı!)
              </button>
              <button
                onClick={() => setTestStudentCount(1000)}
                className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] hover:bg-slate-100 font-semibold text-indigo-700"
              >
                1.000 (3. Norm Katı!)
              </button>
            </div>
          </div>
        </div>

        {/* Calculation Result (7 cols) */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs text-slate-500">Mevzuat Hesaplama Çıktısı</span>
              <span className="text-xs font-mono font-semibold text-indigo-700">{bracketDetail.articleCitation}</span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-xs text-slate-500">MEB Norm Kadrosu:</div>
                <div className={`text-3xl font-extrabold font-mono tabular-nums ${
                  bracketDetail.normCount === 0 ? 'text-amber-600' : 'text-indigo-600'
                }`}>
                  {bracketDetail.normCount} Rehber Öğretmen
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2.5 py-1 rounded font-semibold ${
                  bracketDetail.isBelowThreshold
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {bracketDetail.isBelowThreshold ? 'Baraj Altı / Kadro Verilemez' : 'Norm Kadro Hak Eden Kurum'}
                </span>
              </div>
            </div>

            {/* Bracket Explanation */}
            <div className="text-xs text-slate-600 space-y-1.5 pt-1">
              <div>
                Mevzuattaki Kat Aralığı: <strong className="text-slate-900 font-mono">{bracketDetail.currentBracketRange}</strong>
              </div>
              <div className="text-slate-500">
                Uygulanan Kural: <span className="text-slate-800 font-medium">{bracketDetail.ruleExplanation}</span>
              </div>
              {!bracketDetail.isBelowThreshold && (
                <div className="text-slate-500">
                  Bir üst norma ({bracketDetail.normCount + 1}. Norm) geçiş için:{' '}
                  <strong className="text-slate-900 font-mono">{formatNum(bracketDetail.nextThreshold)} öğrenciye</strong> ulaşılmalıdır.{' '}
                  (Gereken ilave mevcud: <span className="text-indigo-600 font-mono font-bold">+{bracketDetail.neededForNextNorm} öğrenci</span>)
                </div>
              )}
              {bracketDetail.isBelowThreshold && (
                <div className="text-amber-900 bg-amber-50 p-2.5 rounded border border-amber-200">
                  <strong>Madde 21'in Yapısal Sonucu:</strong> Bu okul {bracketDetail.threshold} öğrenci barajının
                  altında kaldığı için yönetmeliğe göre 0 norm kadroya sahiptir. Kırsal okullarda bu boşluğu kapatmak üzere
                  simülatörümüzde <strong>Gezici Hub Modeli</strong> önerilmektedir.
                </div>
              )}
            </div>
          </div>

          {/* Crucial Special Rules from Article 21 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
              <div className="font-bold text-slate-900">İlçe Merkezi İstisnası (Madde 21/2-d):</div>
              <p className="text-slate-600 text-[11px]">
                İlçe merkezindeki okullarda öğrenci yetersizliği nedeniyle hiçbir okula norm verilemiyorsa,
                öğrenci sayısı <strong>en fazla olan okula 1 norm</strong> verilir.
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
              <div className="font-bold text-slate-900">Müteakip Atama Kuralı (Madde 21/4):</div>
              <p className="text-slate-600 text-[11px]">
                Bir yerleşim yerindeki her okulda en az 1 rehber öğretmen normu doldurulmadan,
                büyük okullara <strong>2. ve sonraki normlara atama yapılamaz</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metropolitan Paradox Case Study Box */}
      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg space-y-3 text-xs text-slate-800">
        <div className="flex items-center gap-2 font-bold text-amber-950 text-sm border-b border-amber-200/60 pb-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Büyükşehir Dağılım Paradoksu: İstanbul'da Toplam Öğretmen Sayısı Neden Açığı Gizler?</span>
        </div>
        <p className="leading-relaxed">
          <strong>"Toplam öğrenciye oranla öğretmen sayısı yüksekse açık yoktur" varsayımı tamamen yanlıştır.</strong>{' '}
          Çünkü MEB atama sisteminde öğretmenler il havuzuna değil, <strong>münferit okul kadrosuna</strong> atanır.
          Kadıköy veya Beşiktaş'taki bir okulda öğretmen ihtiyacı tam veya norm fazlası olsa dahi, bu öğretmen Esenyurt veya
          Bağcılar'daki 3.000 öğrencili bir ilkokulun öğrencilerine danışmanlık yapamaz.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
          <div className="p-2.5 bg-white border border-amber-200 rounded">
            <div className="font-bold text-slate-900">Kadıköy Anadolu Lisesi</div>
            <div className="text-slate-500 mt-0.5">1.150 Öğrenci (Ortaöğretim)</div>
            <div className="font-mono mt-1 text-slate-700">Norm: <strong>3</strong> · Mevcut: <strong>3</strong></div>
            <div className="text-emerald-700 font-semibold mt-0.5">Açık: 0 (Dengeli / Tam Kadro)</div>
          </div>
          <div className="p-2.5 bg-white border border-rose-300 rounded bg-rose-50/20">
            <div className="font-bold text-slate-900">Esenyurt Örnek İlkokulu</div>
            <div className="text-slate-500 mt-0.5">2.850 Öğrenci (Mega İlkokul)</div>
            <div className="font-mono mt-1 text-slate-700">Norm (Madde 21): <strong>6</strong> · Mevcut: <strong>2</strong></div>
            <div className="text-rose-700 font-bold mt-0.5">Reel Açık: -4 Danışman Eksik!</div>
          </div>
          <div className="p-2.5 bg-white border border-slate-200 rounded">
            <div className="font-bold text-slate-900">Silivri Köy İlkokulu</div>
            <div className="text-slate-500 mt-0.5">75 Öğrenci (Baraj Altı)</div>
            <div className="font-mono mt-1 text-slate-700">Norm: <strong>0</strong> · Mevcut: <strong>0</strong></div>
            <div className="text-amber-700 font-medium mt-0.5">Rehbersiz Nüfus (0 Norm)</div>
          </div>
        </div>
        <div className="text-[11px] text-amber-900 bg-amber-100/60 p-2 rounded">
          <strong>Sonuç:</strong> İstanbul genelinde toplamda 8.450 rehber öğretmen görev yapmasına rağmen;
          özellikle yoğun göç alan ve sınıf mevcudu 40'ı aşan dış ilçelerdeki mega okullarda <strong>1.200'ü aşkın resmî norm açığı</strong>,
          okul bazlı incelendiğinde ise <strong>2.000'den fazla kadro boşluğu</strong> bulunmaktadır.
        </div>
      </div>

      {/* Regulation Step Ladder Table */}
      <div className="pt-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          <span>
            {selectedType} İçin Yönetmelik Kat Basamakları (Taban + 500 ve Katları)
          </span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
          {ladderSteps.map((step) => {
            const isCurrentStep = step.norm === bracketDetail.normCount;
            return (
              <div
                key={step.norm}
                className={`p-2.5 rounded border text-center transition-all ${
                  isCurrentStep
                    ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className={`font-mono text-lg font-bold ${
                  step.norm === 0 ? 'text-slate-400' : 'text-slate-900'
                }`}>
                  {step.norm} Norm
                </div>
                <div className="font-mono text-[11px] text-slate-600 mt-0.5">
                  {step.range} öğr
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-medium">
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
