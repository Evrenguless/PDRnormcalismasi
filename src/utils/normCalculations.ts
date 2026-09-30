import { PolicyWeights, SchoolRecord, SchoolType, SettlementType } from '../types/pdr';

export const DEFAULT_POLICY_WEIGHTS: PolicyWeights = {
  villageTownMultiplier: 1.55,
  specialEducationMultiplier: 2.20,
  mtalVocationalMultiplier: 1.35,
  primarySchoolEarlyInterventionMultiplier: 1.25,
  disadvantagedSegeMultiplier: 1.30,
  minPrimaryThreshold: 300, // MEB Regulation Article 21/2-b exact threshold
  minSecondaryThreshold: 150, // MEB Regulation Article 21/2-b and 21/2-c exact threshold
  incrementalStepPrimary: 500, // MEB Regulation Article 21/3: 500 ve 500'ün katlarına ulaşması halinde
  incrementalStepSecondary: 500, // MEB Regulation Article 21/3: 500 ve 500'ün katlarına ulaşması halinde
};

/**
 * Calculates official MEB Norm Cadre strictly according to
 * Millî Eğitim Bakanlığına Bağlı Eğitim Kurumları Yönetici ve Öğretmenlerinin
 * Norm Kadrolarına İlişkin Yönetmelik (Madde 21 - Rehberlik Alan Öğretmeni)
 */
export function calculateLegislationNorm(
  schoolType: SchoolType,
  studentCount: number,
  isBoarding: boolean = false
): number {
  if (studentCount <= 0 && !isBoarding) return 0;

  // Madde 21/2-ç: Yatılı veya pansiyonlu eğitim kurumlarının öğrenci sayılarına bakılmaksızın her birine 1 norm
  if (isBoarding && studentCount > 0) {
    const baseBoardingNorm = 1;
    // 500 ve katlarında ilave norm devam eder
    const extraNorm = Math.floor(studentCount / 500);
    return Math.max(1, baseBoardingNorm + extraNorm);
  }

  switch (schoolType) {
    case 'Birleştirilmiş Sınıflı Köy İlkokulu':
    case 'İlkokul': {
      // Madde 21/2-b: "İlkokullarda öğrenci sayısı 300 ve daha fazla olanların her birine 1"
      // Madde 21/3: "öğrenci sayısının 500 ve 500'ün katlarına ulaşması hâlinde her defasında ilave olarak 1 rehberlik alan öğretmeni norm kadrosu daha verilir."
      if (studentCount < 300) return 0;
      // 300 - 499: 1 norm
      // 500 - 999: 1 (taban) + 1 (500'e ulaştı) = 2 norm
      // 1000 - 1499: 1 + 2 = 3 norm
      return 1 + Math.floor(studentCount / 500);
    }

    case 'Ortaokul':
    case 'İmam Hatip Ortaokulu / Lisesi':
    case 'Anadolu Lisesi':
    case 'Fen Lisesi':
    case 'Mesleki ve Teknik Anadolu Lisesi (MTAL)': {
      // Madde 21/2-b ve 21/2-c: "ortaokul ve imam hatip ortaokullarında... ortaöğretim kurumlarından öğrenci sayısı 150 ve daha fazla olanların her birine 1"
      // Madde 21/3: "öğrenci sayısının 500 ve 500'ün katlarına ulaşması hâlinde her defasında ilave olarak 1 rehberlik alan öğretmeni norm kadrosu daha verilir."
      if (studentCount < 150) return 0;
      // 150 - 499: 1 norm
      // 500 - 999: 1 (taban) + 1 (500'e ulaştı) = 2 norm
      // 1000 - 1499: 1 + 2 = 3 norm
      // 1500 - 1999: 1 + 3 = 4 norm
      return 1 + Math.floor(studentCount / 500);
    }

    case 'Özel Eğitim Uygulama / RAM': {
      // Madde 21/2-a: "özel eğitim kurumlarına... toplam öğrenci sayısı 25 ve daha fazlası için 1"
      // Madde 21/3: "özel eğitim kurumlarında öğrenci sayısının 100 ve 100’ün katlarına ulaşması hâlinde her defasında ilave olarak 1... verilir."
      if (studentCount < 25) return 0;
      // 25 - 99: 1 norm
      // 100 - 199: 1 + 1 = 2 norm
      // 200 - 299: 1 + 2 = 3 norm
      return 1 + Math.floor(studentCount / 100);
    }

    default: {
      if (studentCount < 150) return 0;
      return 1 + Math.floor(studentCount / 500);
    }
  }
}

/**
 * Calculates weighted multi-factor policy norm considering:
 * - Rural / Village / Town status (Gezici norm ihtiyacı)
 * - School risk category (Vocational, Special Education)
 * - Socio-economic disadvantage level (SEGE)
 * - Early psychological intervention in primary schools
 */
export function calculateWeightedModelNorm(
  schoolType: SchoolType,
  studentCount: number,
  settlement: SettlementType,
  segeTier: number,
  weights: PolicyWeights = DEFAULT_POLICY_WEIGHTS,
  isBoarding: boolean = false
): number {
  if (studentCount <= 0 && !isBoarding) return 0;

  const baseMevzuat = calculateLegislationNorm(schoolType, studentCount, isBoarding);

  // Multipliers
  let typeMultiplier = 1.0;
  if (schoolType === 'Özel Eğitim Uygulama / RAM') {
    typeMultiplier = weights.specialEducationMultiplier;
  } else if (schoolType === 'Mesleki ve Teknik Anadolu Lisesi (MTAL)') {
    typeMultiplier = weights.mtalVocationalMultiplier;
  } else if (schoolType === 'İlkokul' || schoolType === 'Birleştirilmiş Sınıflı Köy İlkokulu') {
    typeMultiplier = weights.primarySchoolEarlyInterventionMultiplier;
  }

  let settlementMultiplier = 1.0;
  if (settlement === 'Köy / Kırsal Yerleşim' || schoolType === 'Birleştirilmiş Sınıflı Köy İlkokulu') {
    settlementMultiplier = weights.villageTownMultiplier;
  } else if (settlement === 'Kasaba / Belde') {
    settlementMultiplier = 1.0 + (weights.villageTownMultiplier - 1.0) * 0.65;
  }

  let segeMultiplier = 1.0;
  if (segeTier >= 5) {
    segeMultiplier = weights.disadvantagedSegeMultiplier;
  } else if (segeTier === 4) {
    segeMultiplier = 1.0 + (weights.disadvantagedSegeMultiplier - 1.0) * 0.5;
  }

  // Village protection rule: If school is small (e.g. 35 students) and base norm is 0,
  // the policy model assigns 1 shared mobile hub quota
  if (settlement === 'Köy / Kırsal Yerleşim' || schoolType === 'Birleştirilmiş Sınıflı Köy İlkokulu') {
    if (studentCount >= 25 && baseMevzuat === 0) {
      return 1;
    }
  }

  const rawNorm = baseMevzuat * typeMultiplier * settlementMultiplier * segeMultiplier;
  return Math.max(baseMevzuat, Math.round(rawNorm));
}

export interface NormBracketDetail {
  schoolType: SchoolType;
  studentCount: number;
  normCount: number;
  isBelowThreshold: boolean;
  threshold: number;
  currentBracketRange: string;
  nextThreshold: number;
  neededForNextNorm: number;
  articleCitation: string;
  ruleExplanation: string;
}

/**
 * Detailed step-bracket lookup explaining MEB Regulation Article 21
 */
export function getNormBracketDetail(
  schoolType: SchoolType,
  studentCount: number,
  isBoarding: boolean = false
): NormBracketDetail {
  const isPrimary =
    schoolType === 'İlkokul' || schoolType === 'Birleştirilmiş Sınıflı Köy İlkokulu';
  const isSpecialEd = schoolType === 'Özel Eğitim Uygulama / RAM';

  if (isSpecialEd) {
    if (studentCount < 25) {
      return {
        schoolType,
        studentCount,
        normCount: 0,
        isBelowThreshold: true,
        threshold: 25,
        currentBracketRange: '0 - 24 öğrenci (Baraj Altı)',
        nextThreshold: 25,
        neededForNextNorm: 25 - studentCount,
        articleCitation: 'Madde 21/2-a (Özel eğitim kurumları)',
        ruleExplanation: 'Toplam öğrenci sayısı 25 ve daha fazlası için 1 norm verilir.',
      };
    }
    const extraNorm = Math.floor(studentCount / 100);
    const normCount = 1 + extraNorm;
    const nextThresh = (extraNorm + 1) * 100;
    const bracketMin = extraNorm === 0 ? 25 : extraNorm * 100;
    const bracketMax = nextThresh - 1;

    return {
      schoolType,
      studentCount,
      normCount,
      isBelowThreshold: false,
      threshold: 25,
      currentBracketRange: `${bracketMin} - ${bracketMax} öğrenci (${normCount}. Norm)`,
      nextThreshold: nextThresh,
      neededForNextNorm: Math.max(0, nextThresh - studentCount),
      articleCitation: 'Madde 21/2-a ve Madde 21/3',
      ruleExplanation: '25 öğrencide 1 norm; 100 ve 100’ün katlarına ulaşması halinde ilave her defasında +1 norm verilir.',
    };
  }

  // Primary vs Secondary
  const threshold = isPrimary ? 300 : 150;

  if (isBoarding) {
    const extraNorm = Math.floor(studentCount / 500);
    const normCount = Math.max(1, 1 + extraNorm);
    const nextThresh = (extraNorm + 1) * 500;
    return {
      schoolType,
      studentCount,
      normCount,
      isBelowThreshold: false,
      threshold: 0,
      currentBracketRange: `Yatılı/Pansiyonlu (${normCount}. Norm)`,
      nextThreshold: nextThresh,
      neededForNextNorm: Math.max(0, nextThresh - studentCount),
      articleCitation: 'Madde 21/2-ç',
      ruleExplanation: 'Yatılı veya pansiyonlu eğitim kurumlarının öğrenci sayılarına bakılmaksızın her birine 1 norm verilir; 500 ve katlarında +1 ilave verilir.',
    };
  }

  if (studentCount < threshold) {
    return {
      schoolType,
      studentCount,
      normCount: 0,
      isBelowThreshold: true,
      threshold,
      currentBracketRange: `0 - ${threshold - 1} öğrenci (Baraj Altı)`,
      nextThreshold: threshold,
      neededForNextNorm: threshold - studentCount,
      articleCitation: isPrimary ? 'Madde 21/2-b' : 'Madde 21/2-b ve 21/2-c',
      ruleExplanation: isPrimary
        ? `İlkokullarda öğrenci sayısı 300'ün altında olanlara norm kadro verilmez.`
        : `Ortaokul ve liselerde öğrenci sayısı 150'nin altında olanlara norm kadro verilmez.`,
    };
  }

  // Above threshold
  const extraNorm = Math.floor(studentCount / 500);
  const normCount = 1 + extraNorm;
  const nextThresh = (extraNorm + 1) * 500;

  // Bracket label calculation
  const bracketMin = extraNorm === 0 ? threshold : extraNorm * 500;
  const bracketMax = nextThresh - 1;

  return {
    schoolType,
    studentCount,
    normCount,
    isBelowThreshold: false,
    threshold,
    currentBracketRange: `${bracketMin} - ${bracketMax} öğrenci (${normCount}. Norm)`,
    nextThreshold: nextThresh,
    neededForNextNorm: Math.max(0, nextThresh - studentCount),
    articleCitation: isPrimary
      ? 'Madde 21/2-b ve Madde 21/3'
      : 'Madde 21/2-b/c ve Madde 21/3',
    ruleExplanation: isPrimary
      ? `300 ve üzeri için 1 norm; öğrenci sayısının 500 ve 500'ün katlarına ulaşması halinde ilave her defasında +1 norm verilir.`
      : `150 ve üzeri için 1 norm; öğrenci sayısının 500 ve 500'ün katlarına ulaşması halinde ilave her defasında +1 norm verilir.`,
  };
}

/**
 * Verbatim text of MEB Regulation Article 21
 */
export const MEB_REGULATION_ARTICLE_21_TEXT = {
  title: 'Rehberlik Alan Öğretmeni (Madde 21)',
  reference: 'Bakanlar Kurulu Kararı: 16/6/2014 No: 2014/6459 (Değişik: 17/10/2016 No: 2016/9488)',
  paragraphs: [
    {
      clause: '1)',
      text: 'Rehberlik ve araştırma merkezlerine, görev alanlarına giren il veya ilçenin nüfusu 100.000’e kadar olan yerlerde 4, sonra gelen her 50.000 nüfus için 1 rehberlik alan öğretmeni norm kadrosu verilir. Bu şekilde yapılacak hesaplama sonunda artan nüfusun en az 25.000 olması hâlinde ilave olarak bir rehberlik alan öğretmeni norm kadrosu daha verilir.',
    },
    {
      clause: '2-a)',
      text: 'Özel eğitim anaokulları hariç olmak üzere özel eğitim kurumlarına (aynı bina veya bahçede farklı kademelerde eğitim veren özel eğitim kurumlarından öğrenci sayısı fazla olana verilmek üzere), toplam öğrenci sayısı 25 ve daha fazlası için 1,',
    },
    {
      clause: '2-b)',
      text: 'Anaokulları hariç olmak üzere, ilkokullarda öğrenci sayısı 300, ortaokul ve imam hatip ortaokullarında öğrenci sayısı 150 ve daha fazla olanların her birine 1,',
    },
    {
      clause: '2-c)',
      text: 'Ortaöğretim kurumlarından öğrenci sayısı 150 ve daha fazla olanların her birine 1,',
    },
    {
      clause: '2-ç)',
      text: 'Yatılı veya pansiyonlu eğitim kurumlarının öğrenci sayılarına bakılmaksızın her birine 1,',
    },
    {
      clause: '2-d)',
      text: 'İlçe merkezindeki ilköğretim ve ortaöğretim kurumlarında öğrenci sayısının yetersiz olması nedeniyle norm kadro verilememesi hâlinde öğrenci sayısı en fazla olan eğitim kurumuna 1,',
    },
    {
      clause: '2-e)',
      text: 'Meslekî eğitim merkezlerinden çırak ve kursiyer sayısı 200 ve daha fazla olanların her birine 1, rehberlik alan öğretmeni norm kadrosu verilir.',
    },
    {
      clause: '3)',
      text: 'Anaokulları hariç olmak üzere, özel eğitim kurumlarında öğrenci sayısının 100 ve 100’ün katlarına, diğer eğitim kurumlarında ise öğrenci sayısının 500 ve 500’ün katlarına ulaşması hâlinde her defasında ilave olarak 1 rehberlik alan öğretmeni norm kadrosu daha verilir.',
    },
    {
      clause: '4)',
      text: 'Özel eğitim kurumları hariç olmak üzere bir yerleşim merkezindeki her eğitim kurumunda en az 1 rehberlik alan öğretmeni norm kadrosu doldurulmadan ikinci ve müteakip norm kadrolara öğretmen atanamaz.',
    },
  ],
};

/**
 * Returns exact discrete ladder steps according to regulation
 */
export function getDiscreteLadderSteps(schoolCategory: 'ilkokul' | 'ortaokul_lise' | 'ozel_egitim') {
  if (schoolCategory === 'ozel_egitim') {
    return [
      { norm: 0, range: '0 - 24', label: 'Baraj Altı (0 Norm)', isZero: true },
      { norm: 1, range: '25 - 99', label: '1. Norm (Taban 25)', isZero: false },
      { norm: 2, range: '100 - 199', label: '2. Norm (100 Katı)', isZero: false },
      { norm: 3, range: '200 - 299', label: '3. Norm (200 Katı)', isZero: false },
      { norm: 4, range: '300 - 399', label: '4. Norm (300 Katı)', isZero: false },
      { norm: 5, range: '400 - 499', label: '5. Norm (400 Katı)', isZero: false },
    ];
  }

  if (schoolCategory === 'ilkokul') {
    return [
      { norm: 0, range: '0 - 299', label: 'Baraj Altı (0 Norm)', isZero: true },
      { norm: 1, range: '300 - 499', label: '1. Norm (Taban 300)', isZero: false },
      { norm: 2, range: '500 - 999', label: '2. Norm (500 Katı)', isZero: false },
      { norm: 3, range: '1000 - 1499', label: '3. Norm (1000 Katı)', isZero: false },
      { norm: 4, range: '1500 - 1999', label: '4. Norm (1500 Katı)', isZero: false },
      { norm: 5, range: '2000 - 2499', label: '5. Norm (2000 Katı)', isZero: false },
    ];
  }

  // ortaokul_lise
  return [
    { norm: 0, range: '0 - 149', label: 'Baraj Altı (0 Norm)', isZero: true },
    { norm: 1, range: '150 - 499', label: '1. Norm (Taban 150)', isZero: false },
    { norm: 2, range: '500 - 999', label: '2. Norm (500 Katı)', isZero: false },
    { norm: 3, range: '1000 - 1499', label: '3. Norm (1000 Katı)', isZero: false },
    { norm: 4, range: '1500 - 1999', label: '4. Norm (1500 Katı)', isZero: false },
    { norm: 5, range: '2000 - 2499', label: '5. Norm (2000 Katı)', isZero: false },
  ];
}

/**
 * Format helper for numbers
 */
export function formatNum(n: number): string {
  return new Intl.NumberFormat('tr-TR').format(n);
}


