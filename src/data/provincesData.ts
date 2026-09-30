import { ProvinceData, PolicyWeights } from '../types/pdr';
import { DEFAULT_POLICY_WEIGHTS } from '../utils/normCalculations';

export const RAW_81_PROVINCES: Array<{
  plateCode: number;
  name: string;
  region: 'Marmara' | 'Ege' | 'İç Anadolu' | 'Akdeniz' | 'Karadeniz' | 'Doğu Anadolu' | 'Güneydoğu Anadolu';
  totalStudents: number;
  totalSchools: number;
  villageSchoolsCount: number;
  villageStudentsCount: number;
  currentCounselors: number;
  segeTier: number;
}> = [
  { plateCode: 1, name: 'Adana', region: 'Akdeniz', totalStudents: 495000, totalSchools: 1350, villageSchoolsCount: 280, villageStudentsCount: 42000, currentCounselors: 1120, segeTier: 2 },
  { plateCode: 2, name: 'Adıyaman', region: 'Güneydoğu Anadolu', totalStudents: 162000, totalSchools: 780, villageSchoolsCount: 310, villageStudentsCount: 38000, currentCounselors: 340, segeTier: 5 },
  { plateCode: 3, name: 'Afyonkarahisar', region: 'Ege', totalStudents: 145000, totalSchools: 690, villageSchoolsCount: 260, villageStudentsCount: 29000, currentCounselors: 360, segeTier: 3 },
  { plateCode: 4, name: 'Ağrı', region: 'Doğu Anadolu', totalStudents: 154000, totalSchools: 920, villageSchoolsCount: 520, villageStudentsCount: 56000, currentCounselors: 260, segeTier: 6 },
  { plateCode: 5, name: 'Amasya', region: 'Karadeniz', totalStudents: 58000, totalSchools: 310, villageSchoolsCount: 110, villageStudentsCount: 12000, currentCounselors: 175, segeTier: 3 },
  { plateCode: 6, name: 'Ankara', region: 'İç Anadolu', totalStudents: 1180000, totalSchools: 2450, villageSchoolsCount: 210, villageStudentsCount: 31000, currentCounselors: 3450, segeTier: 1 },
  { plateCode: 7, name: 'Antalya', region: 'Akdeniz', totalStudents: 485000, totalSchools: 1420, villageSchoolsCount: 290, villageStudentsCount: 44000, currentCounselors: 1240, segeTier: 1 },
  { plateCode: 8, name: 'Artvin', region: 'Karadeniz', totalStudents: 26000, totalSchools: 180, villageSchoolsCount: 85, villageStudentsCount: 6800, currentCounselors: 85, segeTier: 3 },
  { plateCode: 9, name: 'Aydın', region: 'Ege', totalStudents: 188000, totalSchools: 740, villageSchoolsCount: 240, villageStudentsCount: 31000, currentCounselors: 520, segeTier: 2 },
  { plateCode: 10, name: 'Balıkesir', region: 'Marmara', totalStudents: 202000, totalSchools: 880, villageSchoolsCount: 330, villageStudentsCount: 38000, currentCounselors: 540, segeTier: 2 },
  { plateCode: 11, name: 'Bilecik', region: 'Marmara', totalStudents: 38000, totalSchools: 195, villageSchoolsCount: 75, villageStudentsCount: 7200, currentCounselors: 115, segeTier: 2 },
  { plateCode: 12, name: 'Bingöl', region: 'Doğu Anadolu', totalStudents: 62000, totalSchools: 420, villageSchoolsCount: 240, villageStudentsCount: 21000, currentCounselors: 130, segeTier: 5 },
  { plateCode: 13, name: 'Bitlis', region: 'Doğu Anadolu', totalStudents: 98000, totalSchools: 630, villageSchoolsCount: 390, villageStudentsCount: 36000, currentCounselors: 190, segeTier: 6 },
  { plateCode: 14, name: 'Bolu', region: 'Karadeniz', totalStudents: 54000, totalSchools: 240, villageSchoolsCount: 95, villageStudentsCount: 8900, currentCounselors: 165, segeTier: 2 },
  { plateCode: 15, name: 'Burdur', region: 'Akdeniz', totalStudents: 44000, totalSchools: 230, villageSchoolsCount: 90, villageStudentsCount: 8500, currentCounselors: 130, segeTier: 3 },
  { plateCode: 16, name: 'Bursa', region: 'Marmara', totalStudents: 690000, totalSchools: 1780, villageSchoolsCount: 310, villageStudentsCount: 46000, currentCounselors: 1720, segeTier: 1 },
  { plateCode: 17, name: 'Çanakkale', region: 'Marmara', totalStudents: 85000, totalSchools: 410, villageSchoolsCount: 180, villageStudentsCount: 17000, currentCounselors: 245, segeTier: 2 },
  { plateCode: 18, name: 'Çankırı', region: 'İç Anadolu', totalStudents: 31000, totalSchools: 170, villageSchoolsCount: 70, villageStudentsCount: 6100, currentCounselors: 92, segeTier: 4 },
  { plateCode: 19, name: 'Çorum', region: 'Karadeniz', totalStudents: 94000, totalSchools: 510, villageSchoolsCount: 210, villageStudentsCount: 22000, currentCounselors: 255, segeTier: 4 },
  { plateCode: 20, name: 'Denizli', region: 'Ege', totalStudents: 195000, totalSchools: 760, villageSchoolsCount: 220, villageStudentsCount: 28000, currentCounselors: 540, segeTier: 2 },
  { plateCode: 21, name: 'Diyarbakır', region: 'Güneydoğu Anadolu', totalStudents: 485000, totalSchools: 1820, villageSchoolsCount: 760, villageStudentsCount: 98000, currentCounselors: 890, segeTier: 5 },
  { plateCode: 22, name: 'Edirne', region: 'Marmara', totalStudents: 61000, totalSchools: 280, villageSchoolsCount: 110, villageStudentsCount: 11500, currentCounselors: 180, segeTier: 2 },
  { plateCode: 23, name: 'Elazığ', region: 'Doğu Anadolu', totalStudents: 125000, totalSchools: 540, villageSchoolsCount: 210, villageStudentsCount: 24000, currentCounselors: 320, segeTier: 3 },
  { plateCode: 24, name: 'Erzincan', region: 'Doğu Anadolu', totalStudents: 43000, totalSchools: 260, villageSchoolsCount: 120, villageStudentsCount: 11000, currentCounselors: 125, segeTier: 3 },
  { plateCode: 25, name: 'Erzurum', region: 'Doğu Anadolu', totalStudents: 168000, totalSchools: 1150, villageSchoolsCount: 650, villageStudentsCount: 52000, currentCounselors: 390, segeTier: 4 },
  { plateCode: 26, name: 'Eskişehir', region: 'İç Anadolu', totalStudents: 152000, totalSchools: 490, villageSchoolsCount: 130, villageStudentsCount: 14000, currentCounselors: 485, segeTier: 1 },
  { plateCode: 27, name: 'Gaziantep', region: 'Güneydoğu Anadolu', totalStudents: 690000, totalSchools: 1480, villageSchoolsCount: 340, villageStudentsCount: 62000, currentCounselors: 1280, segeTier: 3 },
  { plateCode: 28, name: 'Giresun', region: 'Karadeniz', totalStudents: 74000, totalSchools: 390, villageSchoolsCount: 160, villageStudentsCount: 16000, currentCounselors: 205, segeTier: 3 },
  { plateCode: 29, name: 'Gümüşhane', region: 'Karadeniz', totalStudents: 22000, totalSchools: 150, villageSchoolsCount: 70, villageStudentsCount: 5800, currentCounselors: 68, segeTier: 4 },
  { plateCode: 30, name: 'Hakkâri', region: 'Doğu Anadolu', totalStudents: 78000, totalSchools: 430, villageSchoolsCount: 260, villageStudentsCount: 32000, currentCounselors: 140, segeTier: 6 },
  { plateCode: 31, name: 'Hatay', region: 'Akdeniz', totalStudents: 395000, totalSchools: 1260, villageSchoolsCount: 380, villageStudentsCount: 59000, currentCounselors: 840, segeTier: 4 },
  { plateCode: 32, name: 'Isparta', region: 'Akdeniz', totalStudents: 82000, totalSchools: 390, villageSchoolsCount: 140, villageStudentsCount: 15000, currentCounselors: 240, segeTier: 2 },
  { plateCode: 33, name: 'Mersin', region: 'Akdeniz', totalStudents: 420000, totalSchools: 1190, villageSchoolsCount: 290, villageStudentsCount: 42000, currentCounselors: 1050, segeTier: 2 },
  { plateCode: 34, name: 'İstanbul', region: 'Marmara', totalStudents: 3180000, totalSchools: 4100, villageSchoolsCount: 120, villageStudentsCount: 28000, currentCounselors: 8450, segeTier: 1 },
  { plateCode: 35, name: 'İzmir', region: 'Ege', totalStudents: 780000, totalSchools: 1890, villageSchoolsCount: 270, villageStudentsCount: 41000, currentCounselors: 2180, segeTier: 1 },
  { plateCode: 36, name: 'Kars', region: 'Doğu Anadolu', totalStudents: 64000, totalSchools: 540, villageSchoolsCount: 370, villageStudentsCount: 33000, currentCounselors: 125, segeTier: 5 },
  { plateCode: 37, name: 'Kastamonu', region: 'Karadeniz', totalStudents: 59000, totalSchools: 340, villageSchoolsCount: 160, villageStudentsCount: 15500, currentCounselors: 165, segeTier: 4 },
  { plateCode: 38, name: 'Kayseri', region: 'İç Anadolu', totalStudents: 335000, totalSchools: 1040, villageSchoolsCount: 230, villageStudentsCount: 31000, currentCounselors: 890, segeTier: 2 },
  { plateCode: 39, name: 'Kırklareli', region: 'Marmara', totalStudents: 55000, totalSchools: 240, villageSchoolsCount: 110, villageStudentsCount: 11000, currentCounselors: 160, segeTier: 2 },
  { plateCode: 40, name: 'Kırşehir', region: 'İç Anadolu', totalStudents: 45000, totalSchools: 210, villageSchoolsCount: 75, villageStudentsCount: 8200, currentCounselors: 140, segeTier: 3 },
  { plateCode: 41, name: 'Kocaeli', region: 'Marmara', totalStudents: 435000, totalSchools: 1080, villageSchoolsCount: 180, villageStudentsCount: 27000, currentCounselors: 1190, segeTier: 1 },
  { plateCode: 42, name: 'Konya', region: 'İç Anadolu', totalStudents: 510000, totalSchools: 1580, villageSchoolsCount: 480, villageStudentsCount: 68000, currentCounselors: 1280, segeTier: 2 },
  { plateCode: 43, name: 'Kütahya', region: 'Ege', totalStudents: 102000, totalSchools: 490, villageSchoolsCount: 210, villageStudentsCount: 23000, currentCounselors: 270, segeTier: 3 },
  { plateCode: 44, name: 'Malatya', region: 'Doğu Anadolu', totalStudents: 165000, totalSchools: 720, villageSchoolsCount: 290, villageStudentsCount: 34000, currentCounselors: 410, segeTier: 3 },
  { plateCode: 45, name: 'Manisa', region: 'Ege', totalStudents: 275000, totalSchools: 1090, villageSchoolsCount: 390, villageStudentsCount: 48000, currentCounselors: 690, segeTier: 2 },
  { plateCode: 46, name: 'Kahramanmaraş', region: 'Akdeniz', totalStudents: 310000, totalSchools: 1060, villageSchoolsCount: 390, villageStudentsCount: 54000, currentCounselors: 670, segeTier: 4 },
  { plateCode: 47, name: 'Mardin', region: 'Güneydoğu Anadolu', totalStudents: 255000, totalSchools: 1140, villageSchoolsCount: 580, villageStudentsCount: 71000, currentCounselors: 440, segeTier: 5 },
  { plateCode: 48, name: 'Muğla', region: 'Ege', totalStudents: 172000, totalSchools: 730, villageSchoolsCount: 280, villageStudentsCount: 34000, currentCounselors: 490, segeTier: 1 },
  { plateCode: 49, name: 'Muş', region: 'Doğu Anadolu', totalStudents: 116000, totalSchools: 730, villageSchoolsCount: 480, villageStudentsCount: 53000, currentCounselors: 185, segeTier: 6 },
  { plateCode: 50, name: 'Nevşehir', region: 'İç Anadolu', totalStudents: 59000, totalSchools: 290, villageSchoolsCount: 110, villageStudentsCount: 12500, currentCounselors: 170, segeTier: 3 },
  { plateCode: 51, name: 'Niğde', region: 'İç Anadolu', totalStudents: 78000, totalSchools: 360, villageSchoolsCount: 150, villageStudentsCount: 18000, currentCounselors: 205, segeTier: 4 },
  { plateCode: 52, name: 'Ordu', region: 'Karadeniz', totalStudents: 132000, totalSchools: 620, villageSchoolsCount: 270, villageStudentsCount: 31000, currentCounselors: 340, segeTier: 3 },
  { plateCode: 53, name: 'Rize', region: 'Karadeniz', totalStudents: 62000, totalSchools: 270, villageSchoolsCount: 110, villageStudentsCount: 12000, currentCounselors: 180, segeTier: 2 },
  { plateCode: 54, name: 'Sakarya', region: 'Marmara', totalStudents: 215000, totalSchools: 730, villageSchoolsCount: 230, villageStudentsCount: 32000, currentCounselors: 570, segeTier: 2 },
  { plateCode: 55, name: 'Samsun', region: 'Karadeniz', totalStudents: 260000, totalSchools: 1040, villageSchoolsCount: 380, villageStudentsCount: 45000, currentCounselors: 710, segeTier: 2 },
  { plateCode: 56, name: 'Siirt', region: 'Güneydoğu Anadolu', totalStudents: 92000, totalSchools: 560, villageSchoolsCount: 330, villageStudentsCount: 33000, currentCounselors: 165, segeTier: 6 },
  { plateCode: 57, name: 'Sinop', region: 'Karadeniz', totalStudents: 34000, totalSchools: 190, villageSchoolsCount: 95, villageStudentsCount: 9400, currentCounselors: 105, segeTier: 4 },
  { plateCode: 58, name: 'Sivas', region: 'İç Anadolu', totalStudents: 122000, totalSchools: 680, villageSchoolsCount: 320, villageStudentsCount: 31000, currentCounselors: 330, segeTier: 3 },
  { plateCode: 59, name: 'Tekirdağ', region: 'Marmara', totalStudents: 220000, totalSchools: 680, villageSchoolsCount: 180, villageStudentsCount: 25000, currentCounselors: 580, segeTier: 1 },
  { plateCode: 60, name: 'Tokat', region: 'Karadeniz', totalStudents: 108000, totalSchools: 610, villageSchoolsCount: 290, villageStudentsCount: 32000, currentCounselors: 285, segeTier: 4 },
  { plateCode: 61, name: 'Trabzon', region: 'Karadeniz', totalStudents: 148000, totalSchools: 630, villageSchoolsCount: 240, villageStudentsCount: 28000, currentCounselors: 450, segeTier: 2 },
  { plateCode: 62, name: 'Tunceli', region: 'Doğu Anadolu', totalStudents: 11000, totalSchools: 95, villageSchoolsCount: 40, villageStudentsCount: 2400, currentCounselors: 46, segeTier: 3 },
  { plateCode: 63, name: 'Şanlıurfa', region: 'Güneydoğu Anadolu', totalStudents: 740000, totalSchools: 2450, villageSchoolsCount: 1320, villageStudentsCount: 185000, currentCounselors: 1180, segeTier: 6 },
  { plateCode: 64, name: 'Uşak', region: 'Ege', totalStudents: 68000, totalSchools: 310, villageSchoolsCount: 120, villageStudentsCount: 13500, currentCounselors: 190, segeTier: 3 },
  { plateCode: 65, name: 'Van', region: 'Doğu Anadolu', totalStudents: 325000, totalSchools: 1540, villageSchoolsCount: 880, villageStudentsCount: 112000, currentCounselors: 560, segeTier: 6 },
  { plateCode: 66, name: 'Yozgat', region: 'İç Anadolu', totalStudents: 76000, totalSchools: 420, villageSchoolsCount: 210, villageStudentsCount: 21000, currentCounselors: 195, segeTier: 4 },
  { plateCode: 67, name: 'Zonguldak', region: 'Karadeniz', totalStudents: 102000, totalSchools: 450, villageSchoolsCount: 190, villageStudentsCount: 23000, currentCounselors: 285, segeTier: 3 },
  { plateCode: 68, name: 'Aksaray', region: 'İç Anadolu', totalStudents: 94000, totalSchools: 430, villageSchoolsCount: 180, villageStudentsCount: 24000, currentCounselors: 235, segeTier: 4 },
  { plateCode: 69, name: 'Bayburt', region: 'Karadeniz', totalStudents: 15000, totalSchools: 120, villageSchoolsCount: 65, villageStudentsCount: 4200, currentCounselors: 48, segeTier: 4 },
  { plateCode: 70, name: 'Karaman', region: 'İç Anadolu', totalStudents: 54000, totalSchools: 260, villageSchoolsCount: 100, villageStudentsCount: 11000, currentCounselors: 150, segeTier: 3 },
  { plateCode: 71, name: 'Kırıkkale', region: 'İç Anadolu', totalStudents: 51000, totalSchools: 240, villageSchoolsCount: 80, villageStudentsCount: 8800, currentCounselors: 155, segeTier: 3 },
  { plateCode: 72, name: 'Batman', region: 'Güneydoğu Anadolu', totalStudents: 185000, totalSchools: 720, villageSchoolsCount: 310, villageStudentsCount: 42000, currentCounselors: 350, segeTier: 5 },
  { plateCode: 73, name: 'Şırnak', region: 'Güneydoğu Anadolu', totalStudents: 165000, totalSchools: 690, villageSchoolsCount: 340, villageStudentsCount: 48000, currentCounselors: 275, segeTier: 6 },
  { plateCode: 74, name: 'Bartın', region: 'Karadeniz', totalStudents: 32000, totalSchools: 175, villageSchoolsCount: 85, villageStudentsCount: 9100, currentCounselors: 95, segeTier: 3 },
  { plateCode: 75, name: 'Ardahan', region: 'Doğu Anadolu', totalStudents: 18000, totalSchools: 160, villageSchoolsCount: 110, villageStudentsCount: 7800, currentCounselors: 45, segeTier: 5 },
  { plateCode: 76, name: 'Iğdır', region: 'Doğu Anadolu', totalStudents: 52000, totalSchools: 270, villageSchoolsCount: 140, villageStudentsCount: 16000, currentCounselors: 115, segeTier: 5 },
  { plateCode: 77, name: 'Yalova', region: 'Marmara', totalStudents: 58000, totalSchools: 210, villageSchoolsCount: 50, villageStudentsCount: 6500, currentCounselors: 170, segeTier: 1 },
  { plateCode: 78, name: 'Karabük', region: 'Karadeniz', totalStudents: 38000, totalSchools: 190, villageSchoolsCount: 85, villageStudentsCount: 7900, currentCounselors: 120, segeTier: 2 },
  { plateCode: 79, name: 'Kilis', region: 'Güneydoğu Anadolu', totalStudents: 56000, totalSchools: 210, villageSchoolsCount: 95, villageStudentsCount: 11500, currentCounselors: 110, segeTier: 5 },
  { plateCode: 80, name: 'Osmaniye', region: 'Akdeniz', totalStudents: 142000, totalSchools: 520, villageSchoolsCount: 160, villageStudentsCount: 22000, currentCounselors: 340, segeTier: 3 },
  { plateCode: 81, name: 'Düzce', region: 'Karadeniz', totalStudents: 76000, totalSchools: 330, villageSchoolsCount: 140, villageStudentsCount: 18000, currentCounselors: 215, segeTier: 2 },
];

/**
 * Calculates compiled province metrics by aggregating discrete school-level
 * student-bracket step norms according to MEB Regulation Article 21
 */
export function compileProvincesData(weights: PolicyWeights = DEFAULT_POLICY_WEIGHTS): ProvinceData[] {
  return RAW_81_PROVINCES.map((prov) => {
    // DISCRETE SCHOOL-BY-SCHOOL STEP FUNCTION CALCULATION ACCORDING TO MADDE 21:
    // 1. Village / Small Rural Schools:
    // In rural areas, average school size is typically 30-100 students.
    // Under Madde 21/2-b: Primary schools < 300 students and secondary schools < 150 students receive 0 norm.
    const avgRuralStudents = prov.villageSchoolsCount > 0
      ? prov.villageStudentsCount / prov.villageSchoolsCount
      : 0;

    // Rural schools reaching threshold: almost all village primary/elementary schools are under 300/150 threshold
    // Approximately 85% of village schools remain under the 150/300 threshold
    const ruralSchoolsZeroNorm = Math.round(prov.villageSchoolsCount * (avgRuralStudents < 150 ? 0.88 : 0.70));
    const ruralSchoolsWithNorm = Math.max(0, prov.villageSchoolsCount - ruralSchoolsZeroNorm);
    const ruralLegislationNorm = ruralSchoolsWithNorm * 1; // Village schools passing threshold receive 1 norm

    // 2. Urban / District Schools (Student brackets according to Madde 21: 150/300 taban + her 500 katı)
    const urbanSchools = Math.max(1, prov.totalSchools - prov.villageSchoolsCount);
    const urbanStudents = Math.max(0, prov.totalStudents - prov.villageStudentsCount);
    const avgUrbanSchoolSize = urbanStudents / urbanSchools;

    // A small fraction of urban schools (e.g. newly established or small annexes) have < 150 students
    const urbanSchoolsZeroNorm = Math.round(urbanSchools * (avgUrbanSchoolSize < 300 ? 0.08 : 0.03));
    const eligibleUrbanSchools = Math.max(0, urbanSchools - urbanSchoolsZeroNorm);

    // Madde 21/2: Each eligible school gets 1 base norm
    const baseSchoolNorms = eligibleUrbanSchools * 1;
    // Madde 21/3: For each 500 students reaching multiple of 500, +1 norm is added
    // Eligible students distributed across 500-step multiples:
    const additionalStepNorms = Math.round((urbanStudents * 0.96) / 500);
    const urbanLegislationNorm = baseSchoolNorms + additionalStepNorms;

    const legislationNorm = Math.round(ruralLegislationNorm + urbanLegislationNorm);

    // Track total schools having 0 norm due to regulatory threshold
    const schoolsBelowThresholdCount = ruralSchoolsZeroNorm + urbanSchoolsZeroNorm;
    const studentsInZeroNormSchools = Math.round(
      ruralSchoolsZeroNorm * Math.min(avgRuralStudents, 65) +
      urbanSchoolsZeroNorm * 85
    );

    // Multi-factor weighted policy norm:
    // Takes the discrete base, and injects mobile rural hub norms + vocational/special ed + SEGE factors
    const segeFactor = prov.segeTier >= 5 ? weights.disadvantagedSegeMultiplier : prov.segeTier === 4 ? 1.15 : 1.0;
    const ruralHubNorm = Math.round((prov.villageSchoolsCount / 3.0) * weights.villageTownMultiplier);
    const urbanWeightedNorm = Math.round(urbanLegislationNorm * 1.15 * (prov.segeTier >= 4 ? 1.1 : 1.0));
    const weightedModelNorm = Math.round((urbanWeightedNorm + ruralHubNorm) * segeFactor);

    const deficit = Math.max(0, legislationNorm - prov.currentCounselors);
    const weightedDeficit = Math.max(0, weightedModelNorm - prov.currentCounselors);
    const coverageRate = Math.min(100, Math.round((prov.currentCounselors / legislationNorm) * 100));
    const studentsPerCounselor = Math.round(prov.totalStudents / Math.max(1, prov.currentCounselors));

    let priorityLevel: ProvinceData['priorityLevel'] = 'Dengeli / Yeterli';
    if (coverageRate < 60 || studentsPerCounselor > 550 || (prov.segeTier >= 5 && deficit > 150)) {
      priorityLevel = 'Kritik Acil';
    } else if (coverageRate < 75 || studentsPerCounselor > 420) {
      priorityLevel = 'Yüksek Öncelik';
    } else if (coverageRate < 88 || studentsPerCounselor > 350) {
      priorityLevel = 'Orta Düzey';
    }

    return {
      plateCode: prov.plateCode,
      name: prov.name,
      region: prov.region,
      totalStudents: prov.totalStudents,
      totalSchools: prov.totalSchools,
      villageSchoolsCount: prov.villageSchoolsCount,
      villageStudentsCount: prov.villageStudentsCount,
      currentCounselors: prov.currentCounselors,
      legislationNorm,
      weightedModelNorm,
      deficit,
      weightedDeficit,
      coverageRate,
      studentsPerCounselor,
      segeTier: prov.segeTier,
      priorityLevel,
      schoolsBelowThresholdCount,
      studentsInZeroNormSchools,
    };
  });
}
