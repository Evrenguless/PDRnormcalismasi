export type SchoolType = 
  | 'İlkokul'
  | 'Ortaokul'
  | 'Anadolu Lisesi'
  | 'Fen Lisesi'
  | 'Mesleki ve Teknik Anadolu Lisesi (MTAL)'
  | 'İmam Hatip Ortaokulu / Lisesi'
  | 'Özel Eğitim Uygulama / RAM'
  | 'Birleştirilmiş Sınıflı Köy İlkokulu';

export type SettlementType = 'Büyükşehir / İl Merkezi' | 'İlçe Merkezi' | 'Kasaba / Belde' | 'Köy / Kırsal Yerleşim';

export interface SchoolRecord {
  id: string;
  name: string;
  province: string;
  district: string;
  schoolType: SchoolType;
  settlement: SettlementType;
  isVillage: boolean;
  isBoarding?: boolean;
  studentCount: number;
  classCount: number;
  currentCounselors: number;
  legislationNorm: number;
  weightedModelNorm: number;
  deficit: number; // legislationNorm - currentCounselors
  weightedDeficit: number; // weightedModelNorm - currentCounselors
  studentPerCounselor: number;
  socioeconomicTier: 1 | 2 | 3 | 4 | 5 | 6; // 1 is most developed, 6 is most disadvantaged
  isBelowThreshold: boolean;
  currentBracketRange: string;
  neededForNextNorm: number;
}

export interface ProvinceData {
  plateCode: number;
  name: string;
  region: 'Marmara' | 'Ege' | 'İç Anadolu' | 'Akdeniz' | 'Karadeniz' | 'Doğu Anadolu' | 'Güneydoğu Anadolu';
  totalStudents: number;
  totalSchools: number;
  villageSchoolsCount: number;
  villageStudentsCount: number;
  currentCounselors: number;
  legislationNorm: number;
  weightedModelNorm: number;
  deficit: number;
  weightedDeficit: number;
  coverageRate: number; // (currentCounselors / legislationNorm) * 100
  studentsPerCounselor: number;
  segeTier: number; // SEGE socio-economic index rank/tier (1 best, 6 worst)
  priorityLevel: 'Kritik Acil' | 'Yüksek Öncelik' | 'Orta Düzey' | 'Dengeli / Yeterli';
  schoolsBelowThresholdCount: number;
  studentsInZeroNormSchools: number;
}

export interface PolicyWeights {
  villageTownMultiplier: number; // e.g. 1.5x
  specialEducationMultiplier: number; // e.g. 2.2x
  mtalVocationalMultiplier: number; // e.g. 1.35x
  primarySchoolEarlyInterventionMultiplier: number; // e.g. 1.25x
  disadvantagedSegeMultiplier: number; // e.g. 1.30x
  minPrimaryThreshold: number; // 100 or 300 students
  minSecondaryThreshold: number; // 150 students
  incrementalStepPrimary: number; // 300 students per extra norm
  incrementalStepSecondary: number; // 500 students per extra norm
}

export interface ForecastYear {
  year: number;
  totalStudents: number;
  projectedRetirements: number;
  projectedNormNeed: number;
  recommendedHires: number;
  cumulativeDeficit: number;
  ruralCoveragePct: number;
}
