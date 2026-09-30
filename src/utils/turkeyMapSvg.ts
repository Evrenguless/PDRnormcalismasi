/**
 * Turkey 81 Provinces SVG Map Coordinates & Paths (Projected to 960x420 Viewport)
 */

export interface ProvinceMapNode {
  plateCode: number;
  name: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  path: string;
  region: string;
}

// Projection bounds roughly scaled for 960 x 420 SVG
export const TURKEY_PROVINCES_GEO: ProvinceMapNode[] = [
  // Marmara
  { plateCode: 34, name: 'İstanbul', x: 235, y: 78, region: 'Marmara', path: 'M 215,70 L 260,68 L 265,88 L 225,92 Z' },
  { plateCode: 59, name: 'Tekirdağ', x: 165, y: 76, region: 'Marmara', path: 'M 145,65 L 185,62 L 192,85 L 150,90 Z' },
  { plateCode: 22, name: 'Edirne', x: 125, y: 55, region: 'Marmara', path: 'M 115,35 L 145,45 L 140,80 L 110,75 Z' },
  { plateCode: 39, name: 'Kırklareli', x: 160, y: 40, region: 'Marmara', path: 'M 145,25 L 185,30 L 180,60 L 142,55 Z' },
  { plateCode: 17, name: 'Çanakkale', x: 105, y: 110, region: 'Marmara', path: 'M 90,88 L 132,95 L 125,130 L 85,120 Z' },
  { plateCode: 10, name: 'Balıkesir', x: 155, y: 135, region: 'Marmara', path: 'M 132,110 L 185,115 L 178,160 L 128,150 Z' },
  { plateCode: 16, name: 'Bursa', x: 215, y: 128, region: 'Marmara', path: 'M 190,110 L 245,112 L 240,150 L 188,145 Z' },
  { plateCode: 77, name: 'Yalova', x: 225, y: 98, region: 'Marmara', path: 'M 215,92 L 240,92 L 238,105 L 218,105 Z' },
  { plateCode: 41, name: 'Kocaeli', x: 265, y: 92, region: 'Marmara', path: 'M 252,82 L 285,82 L 280,108 L 250,105 Z' },
  { plateCode: 54, name: 'Sakarya', x: 295, y: 98, region: 'Marmara', path: 'M 285,82 L 315,82 L 310,120 L 280,115 Z' },
  { plateCode: 11, name: 'Bilecik', x: 255, y: 130, region: 'Marmara', path: 'M 245,118 L 275,120 L 270,148 L 242,145 Z' },

  // Ege
  { plateCode: 35, name: 'İzmir', x: 115, y: 195, region: 'Ege', path: 'M 95,165 L 138,170 L 135,225 L 90,215 Z' },
  { plateCode: 45, name: 'Manisa', x: 160, y: 185, region: 'Ege', path: 'M 140,165 L 190,165 L 185,205 L 138,205 Z' },
  { plateCode: 9, name: 'Aydın', x: 135, y: 240, region: 'Ege', path: 'M 115,222 L 165,225 L 160,260 L 110,255 Z' },
  { plateCode: 48, name: 'Muğla', x: 155, y: 295, region: 'Ege', path: 'M 130,265 L 195,270 L 190,320 L 120,315 Z' },
  { plateCode: 20, name: 'Denizli', x: 195, y: 245, region: 'Ege', path: 'M 170,225 L 225,230 L 220,270 L 168,265 Z' },
  { plateCode: 64, name: 'Uşak', x: 198, y: 198, region: 'Ege', path: 'M 185,185 L 225,185 L 220,220 L 182,218 Z' },
  { plateCode: 43, name: 'Kütahya', x: 230, y: 172, region: 'Ege', path: 'M 215,150 L 260,152 L 255,190 L 210,188 Z' },
  { plateCode: 3, name: 'Afyonkarahisar', x: 260, y: 215, region: 'Ege', path: 'M 235,195 L 285,195 L 280,240 L 230,238 Z' },

  // Akdeniz
  { plateCode: 7, name: 'Antalya', x: 260, y: 310, region: 'Akdeniz', path: 'M 220,275 L 305,280 L 300,345 L 210,340 Z' },
  { plateCode: 15, name: 'Burdur', x: 235, y: 268, region: 'Akdeniz', path: 'M 220,250 L 255,252 L 250,285 L 215,282 Z' },
  { plateCode: 32, name: 'Isparta', x: 275, y: 255, region: 'Akdeniz', path: 'M 258,240 L 295,242 L 290,278 L 255,275 Z' },
  { plateCode: 33, name: 'Mersin', x: 395, y: 325, region: 'Akdeniz', path: 'M 355,300 L 440,305 L 435,355 L 350,350 Z' },
  { plateCode: 1, name: 'Adana', x: 460, y: 300, region: 'Akdeniz', path: 'M 435,275 L 490,280 L 485,330 L 430,325 Z' },
  { plateCode: 80, name: 'Osmaniye', x: 505, y: 295, region: 'Akdeniz', path: 'M 490,282 L 525,285 L 520,315 L 488,312 Z' },
  { plateCode: 31, name: 'Hatay', x: 505, y: 360, region: 'Akdeniz', path: 'M 485,330 L 520,332 L 515,395 L 480,390 Z' },
  { plateCode: 46, name: 'Kahramanmaraş', x: 520, y: 255, region: 'Akdeniz', path: 'M 485,235 L 555,238 L 550,280 L 480,275 Z' },

  // İç Anadolu
  { plateCode: 6, name: 'Ankara', x: 345, y: 155, region: 'İç Anadolu', path: 'M 315,130 L 380,132 L 375,185 L 310,180 Z' },
  { plateCode: 26, name: 'Eskişehir', x: 280, y: 160, region: 'İç Anadolu', path: 'M 255,140 L 310,142 L 305,185 L 250,182 Z' },
  { plateCode: 42, name: 'Konya', x: 340, y: 245, region: 'İç Anadolu', path: 'M 295,200 L 390,205 L 385,290 L 290,285 Z' },
  { plateCode: 70, name: 'Karaman', x: 360, y: 295, region: 'İç Anadolu', path: 'M 335,280 L 385,282 L 380,318 L 330,315 Z' },
  { plateCode: 68, name: 'Aksaray', x: 400, y: 235, region: 'İç Anadolu', path: 'M 380,215 L 425,218 L 420,255 L 375,252 Z' },
  { plateCode: 51, name: 'Niğde', x: 435, y: 255, region: 'İç Anadolu', path: 'M 415,240 L 458,242 L 452,278 L 410,275 Z' },
  { plateCode: 50, name: 'Nevşehir', x: 430, y: 215, region: 'İç Anadolu', path: 'M 412,198 L 450,200 L 445,235 L 408,232 Z' },
  { plateCode: 38, name: 'Kayseri', x: 485, y: 215, region: 'İç Anadolu', path: 'M 450,190 L 520,195 L 515,245 L 445,240 Z' },
  { plateCode: 71, name: 'Kırıkkale', x: 385, y: 155, region: 'İç Anadolu', path: 'M 370,140 L 405,142 L 400,175 L 368,172 Z' },
  { plateCode: 40, name: 'Kırşehir', x: 415, y: 175, region: 'İç Anadolu', path: 'M 395,160 L 438,162 L 432,198 L 390,195 Z' },
  { plateCode: 66, name: 'Yozgat', x: 455, y: 160, region: 'İç Anadolu', path: 'M 425,140 L 490,145 L 485,188 L 420,185 Z' },
  { plateCode: 18, name: 'Çankırı', x: 380, y: 110, region: 'İç Anadolu', path: 'M 360,95 L 405,98 L 400,132 L 358,130 Z' },
  { plateCode: 58, name: 'Sivas', x: 550, y: 170, region: 'İç Anadolu', path: 'M 505,145 L 600,150 L 595,210 L 500,205 Z' },

  // Karadeniz
  { plateCode: 14, name: 'Bolu', x: 325, y: 108, region: 'Karadeniz', path: 'M 305,95 L 350,98 L 345,128 L 300,125 Z' },
  { plateCode: 67, name: 'Zonguldak', x: 320, y: 72, region: 'Karadeniz', path: 'M 305,58 L 340,60 L 335,88 L 300,85 Z' },
  { plateCode: 74, name: 'Bartın', x: 345, y: 62, region: 'Karadeniz', path: 'M 335,50 L 365,52 L 360,78 L 330,75 Z' },
  { plateCode: 78, name: 'Karabük', x: 355, y: 85, region: 'Karadeniz', path: 'M 340,75 L 375,78 L 370,102 L 338,100 Z' },
  { plateCode: 81, name: 'Düzce', x: 295, y: 88, region: 'Karadeniz', path: 'M 285,78 L 312,80 L 308,102 L 282,100 Z' },
  { plateCode: 37, name: 'Kastamonu', x: 410, y: 75, region: 'Karadeniz', path: 'M 385,55 L 445,60 L 440,105 L 380,100 Z' },
  { plateCode: 57, name: 'Sinop', x: 465, y: 55, region: 'Karadeniz', path: 'M 445,38 L 490,42 L 485,82 L 440,78 Z' },
  { plateCode: 19, name: 'Çorum', x: 450, y: 115, region: 'Karadeniz', path: 'M 425,98 L 480,102 L 475,140 L 420,138 Z' },
  { plateCode: 5, name: 'Amasya', x: 495, y: 110, region: 'Karadeniz', path: 'M 475,95 L 520,98 L 515,130 L 470,128 Z' },
  { plateCode: 55, name: 'Samsun', x: 515, y: 72, region: 'Karadeniz', path: 'M 485,55 L 550,60 L 545,98 L 480,95 Z' },
  { plateCode: 60, name: 'Tokat', x: 525, y: 125, region: 'Karadeniz', path: 'M 500,110 L 555,115 L 550,150 L 495,148 Z' },
  { plateCode: 52, name: 'Ordu', x: 565, y: 92, region: 'Karadeniz', path: 'M 545,78 L 590,82 L 585,120 L 540,118 Z' },
  { plateCode: 28, name: 'Giresun', x: 610, y: 102, region: 'Karadeniz', path: 'M 588,85 L 635,90 L 630,130 L 582,125 Z' },
  { plateCode: 61, name: 'Trabzon', x: 660, y: 95, region: 'Karadeniz', path: 'M 635,80 L 685,85 L 680,120 L 630,118 Z' },
  { plateCode: 53, name: 'Rize', x: 710, y: 88, region: 'Karadeniz', path: 'M 685,75 L 735,80 L 730,112 L 680,110 Z' },
  { plateCode: 8, name: 'Artvin', x: 755, y: 80, region: 'Karadeniz', path: 'M 732,65 L 780,70 L 775,110 L 728,105 Z' },
  { plateCode: 29, name: 'Gümüşhane', x: 640, y: 135, region: 'Karadeniz', path: 'M 620,120 L 665,122 L 660,155 L 615,152 Z' },
  { plateCode: 69, name: 'Bayburt', x: 685, y: 132, region: 'Karadeniz', path: 'M 665,120 L 705,122 L 700,152 L 660,150 Z' },

  // Doğu Anadolu
  { plateCode: 24, name: 'Erzincan', x: 635, y: 175, region: 'Doğu Anadolu', path: 'M 595,155 L 675,160 L 670,200 L 590,195 Z' },
  { plateCode: 25, name: 'Erzurum', x: 735, y: 155, region: 'Doğu Anadolu', path: 'M 685,130 L 785,138 L 778,195 L 680,190 Z' },
  { plateCode: 36, name: 'Kars', x: 815, y: 118, region: 'Doğu Anadolu', path: 'M 780,95 L 850,102 L 845,145 L 775,140 Z' },
  { plateCode: 75, name: 'Ardahan', x: 805, y: 75, region: 'Doğu Anadolu', path: 'M 775,60 L 835,65 L 830,95 L 770,92 Z' },
  { plateCode: 76, name: 'Iğdır', x: 875, y: 145, region: 'Doğu Anadolu', path: 'M 850,130 L 905,135 L 900,165 L 845,160 Z' },
  { plateCode: 4, name: 'Ağrı', x: 835, y: 175, region: 'Doğu Anadolu', path: 'M 785,155 L 885,162 L 880,210 L 780,205 Z' },
  { plateCode: 62, name: 'Tunceli', x: 645, y: 215, region: 'Doğu Anadolu', path: 'M 625,200 L 670,202 L 665,235 L 620,232 Z' },
  { plateCode: 12, name: 'Bingöl', x: 700, y: 218, region: 'Doğu Anadolu', path: 'M 670,202 L 730,205 L 725,242 L 665,240 Z' },
  { plateCode: 49, name: 'Muş', x: 755, y: 220, region: 'Doğu Anadolu', path: 'M 725,205 L 785,210 L 780,248 L 720,245 Z' },
  { plateCode: 13, name: 'Bitlis', x: 800, y: 238, region: 'Doğu Anadolu', path: 'M 775,222 L 828,225 L 822,262 L 770,260 Z' },
  { plateCode: 65, name: 'Van', x: 865, y: 245, region: 'Doğu Anadolu', path: 'M 825,220 L 910,228 L 902,285 L 820,280 Z' },
  { plateCode: 30, name: 'Hakkâri', x: 880, y: 310, region: 'Doğu Anadolu', path: 'M 845,285 L 920,292 L 915,348 L 840,342 Z' },
  { plateCode: 44, name: 'Malatya', x: 575, y: 235, region: 'Doğu Anadolu', path: 'M 540,215 L 610,220 L 605,268 L 535,262 Z' },
  { plateCode: 23, name: 'Elazığ', x: 630, y: 240, region: 'Doğu Anadolu', path: 'M 602,225 L 660,228 L 655,265 L 598,262 Z' },

  // Güneydoğu Anadolu
  { plateCode: 27, name: 'Gaziantep', x: 540, y: 308, region: 'Güneydoğu Anadolu', path: 'M 515,290 L 570,295 L 565,335 L 510,330 Z' },
  { plateCode: 79, name: 'Kilis', x: 535, y: 338, region: 'Güneydoğu Anadolu', path: 'M 518,328 L 550,330 L 548,352 L 515,350 Z' },
  { plateCode: 2, name: 'Adıyaman', x: 575, y: 275, region: 'Güneydoğu Anadolu', path: 'M 545,258 L 608,262 L 602,298 L 540,295 Z' },
  { plateCode: 63, name: 'Şanlıurfa', x: 620, y: 320, region: 'Güneydoğu Anadolu', path: 'M 570,292 L 675,298 L 668,360 L 565,355 Z' },
  { plateCode: 21, name: 'Diyarbakır', x: 685, y: 265, region: 'Güneydoğu Anadolu', path: 'M 645,242 L 725,248 L 720,298 L 640,292 Z' },
  { plateCode: 72, name: 'Batman', x: 735, y: 270, region: 'Güneydoğu Anadolu', path: 'M 718,252 L 755,255 L 750,292 L 715,290 Z' },
  { plateCode: 47, name: 'Mardin', x: 730, y: 320, region: 'Güneydoğu Anadolu', path: 'M 680,300 L 780,305 L 775,348 L 675,342 Z' },
  { plateCode: 56, name: 'Siirt', x: 780, y: 275, region: 'Güneydoğu Anadolu', path: 'M 758,260 L 805,262 L 800,295 L 755,292 Z' },
  { plateCode: 73, name: 'Şırnak', x: 815, y: 318, region: 'Güneydoğu Anadolu', path: 'M 778,298 L 852,305 L 848,345 L 772,340 Z' },
];
