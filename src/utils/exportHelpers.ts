/**
 * Utility functions for exporting tabular data into CSV or Excel-compatible formats.
 * Includes UTF-8 BOM for perfect Turkish character rendering in Microsoft Excel.
 */

function sanitizeForCSV(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Triggers a direct browser download of the supplied CSV content
 */
export function downloadCSV(filename: string, csvContent: string): void {
  // \uFEFF is UTF-8 Byte Order Mark for Excel to recognize Turkish characters (ğ, ş, ı, ö, ç, İ)
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports ProvinceData array as CSV or Excel-compatible CSV
 */
export function exportProvincesToCSV(
  provinces: Array<{
    plateCode: number;
    name: string;
    region: string;
    totalStudents: number;
    totalSchools: number;
    villageSchoolsCount: number;
    villageStudentsCount: number;
    currentCounselors: number;
    legislationNorm: number;
    weightedModelNorm: number;
    deficit: number;
    weightedDeficit: number;
    coverageRate: number;
    studentsPerCounselor: number;
    segeTier: number;
    priorityLevel: string;
    schoolsBelowThresholdCount: number;
    studentsInZeroNormSchools: number;
  }>,
  delimiter = ';'
): void {
  const headers = [
    'Plaka Kodu',
    'İl Adı',
    'Coğrafi Bölge',
    'Toplam Öğrenci',
    'Toplam Okul Sayısı',
    'Köy/Kırsal Okul Sayısı',
    'Köy Öğrenci Sayısı',
    'Mevcut Çalışan PDR Öğretmeni',
    'MEB Mevzuat Normu (Madde 21)',
    'Ağırlıklı Model Hedef Normu',
    'Net Mevzuat Açığı (Kadro)',
    'Ağırlıklı Model Açığı',
    'Mevzuat Doluluk Oranı (%)',
    'Danışman Başına Öğrenci',
    'SEGE Gelişmişlik Kademesi',
    'Öncelik Seviyesi',
    'Baraj Altı Okul Sayısı (0 Norm)',
    'Baraj Altı Öğrenci Sayısı',
  ];

  const rows = provinces.map((p) => [
    p.plateCode,
    sanitizeForCSV(p.name),
    sanitizeForCSV(p.region),
    p.totalStudents,
    p.totalSchools,
    p.villageSchoolsCount,
    p.villageStudentsCount,
    p.currentCounselors,
    p.legislationNorm,
    p.weightedModelNorm,
    p.deficit,
    p.weightedDeficit,
    `%${p.coverageRate}`,
    p.studentsPerCounselor,
    p.segeTier,
    sanitizeForCSV(p.priorityLevel),
    p.schoolsBelowThresholdCount,
    p.studentsInZeroNormSchools,
  ]);

  const csvBody = [
    headers.map((h) => sanitizeForCSV(h)).join(delimiter),
    ...rows.map((r) => r.join(delimiter)),
  ].join('\r\n');

  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(`meb_81_il_pdr_norm_cetveli_${timestamp}.csv`, csvBody);
}

/**
 * Exports SchoolRecord array as CSV or Excel-compatible CSV
 */
export function exportSchoolsToCSV(
  schools: Array<{
    id: string;
    name: string;
    province: string;
    district: string;
    schoolType: string;
    settlement: string;
    isVillage: boolean;
    studentCount: number;
    classCount: number;
    currentCounselors: number;
    legislationNorm: number;
    weightedModelNorm: number;
    deficit: number;
    weightedDeficit: number;
    studentPerCounselor: number;
    socioeconomicTier: number;
    isBoarding?: boolean;
  }>,
  delimiter = ';'
): void {
  const headers = [
    'Okul Kodu',
    'Kurum Adı',
    'İl',
    'İlçe',
    'Okul Türü / Kademe',
    'Yerleşim Türü',
    'Köy Okulu mu?',
    'Yatılı / Pansiyonlu mu?',
    'Öğrenci Sayısı',
    'Şube Sayısı',
    'Mevcut PDR Kadrosu',
    'MEB Mevzuat Normu (Madde 21)',
    'Ağırlıklı Model Normu',
    'Net Mevzuat Açığı',
    'Model Açığı',
    'Danışman Başına Öğrenci',
    'Sosyoekonomik Kademe (SEGE)',
  ];

  const rows = schools.map((s) => [
    sanitizeForCSV(s.id),
    sanitizeForCSV(s.name),
    sanitizeForCSV(s.province),
    sanitizeForCSV(s.district),
    sanitizeForCSV(s.schoolType),
    sanitizeForCSV(s.settlement),
    s.isVillage ? 'Evet (Köy)' : 'Hayır (Şehir)',
    s.isBoarding ? 'Evet (Yatılı)' : 'Hayır',
    s.studentCount,
    s.classCount,
    s.currentCounselors,
    s.legislationNorm,
    s.weightedModelNorm,
    s.deficit,
    s.weightedDeficit,
    s.studentPerCounselor,
    s.socioeconomicTier,
  ]);

  const csvBody = [
    headers.map((h) => sanitizeForCSV(h)).join(delimiter),
    ...rows.map((r) => r.join(delimiter)),
  ].join('\r\n');

  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(`meb_okul_bazli_pdr_norm_veritabani_${timestamp}.csv`, csvBody);
}
