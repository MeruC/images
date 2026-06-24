export interface PosterFiles {
  CN?: string | string[];
  CN_gif?: string;
  CN_mp4?: string;
  EN?: string | string[];
  EN_gif?: string;
  EN_mp4?: string;
  JP?: string | string[];
  JP_gif?: string;
  JP_mp4?: string;
  KR?: string | string[];
  KR_gif?: string;
  KR_mp4?: string;
  TW?: string | string[];
  TW_gif?: string;
  TW_mp4?: string;
}

export interface PosterEntry {
  version: string;
  files: PosterFiles;
  starring: string[];
}

export const posters: PosterEntry[] = [
  //1.0
  // (no files yet)
  //1.1
  { version: "1.1", files: { CN: "CN.jpg", EN: "EN.jpg", JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },
  //1.2
  { version: "1.2", files: { CN: "CN.jpg", EN: "EN.jpg", JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },
  //1.3
  { version: "1.3", files: { CN: "CN.jpg", EN: "EN.jpg", JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },
  //1.4
  { version: "1.4", files: { CN: "CN.jpg", EN: "EN.jpg", JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },
  //1.5
  { version: "1.5", files: { CN: "CN.jpg", EN: "EN.jpg", JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },
  //1.6
  { version: "1.6", files: { CN: "CN.jpg", EN: "EN.jpg", JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },
  //1.7
  { version: "1.7", files: { CN: "CN.jpg", EN: "EN.jpg", JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },
  //1.8
  { version: "1.8", files: { CN: "CN.jpg", EN: "EN.jpg", JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },
  //1.9
  { version: "1.9", files: { CN: "CN.png", EN: "EN.jpg", JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },

  //2.0
  { version: "2.0", files: { CN: "CN.jpg", EN: "EN.jpg", JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },
  //2.1
  { version: "2.1", files: { CN: "CN.jpg", EN: "EN.jpg", JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },
  //2.2
  { version: "2.2", files: { CN: "CN.jpg", EN: "EN.jpg", JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },
  //2.3
  { version: "2.3", files: { CN: "CN.jpg", EN: "EN.jpg", JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },
  //2.4
  { version: "2.4", files: { CN: "CN.png", EN: "EN.jpg", JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },
  //2.5
  { version: "2.5", files: { CN: "CN.png", EN: "EN.jpg", JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },
  //2.6
  { version: "2.6", files: { CN: "CN.jpg", EN: "EN.jpg", JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },
  //2.7
  { version: "2.7", files: { CN: "CN.jpg", EN: "EN.jpg", JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },
  //2.8
  { version: "2.8", files: { CN: ["CN1.jpg","CN2.jpg"], CN_gif: "CN.gif", CN_mp4: "CN.mp4", EN: "EN.jpg", JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },

  //3.0
  { version: "3.0", files: { CN: "CN.jpg", EN: "EN.jpg", JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },
  //3.1
  { version: "3.1", files: { CN: "CN.jpg", EN: "EN.jpg", JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },
  //3.2
  { version: "3.2", files: { CN: ["CN1.jpg","CN2.jpg"], EN: ["EN1.jpg","EN2.jpg"], JP: "JP.jpg", KR: ["KR1.jpg","KR2.jpg"], TW: ["TW1.jpg","TW2.jpg"] }, starring: [] },
  //3.3
  { version: "3.3", files: { CN: "CN.jpg", EN: "EN.jpg", JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },
  //3.4
  { version: "3.4", files: { CN: "CN.jpg", EN: "EN.jpg", JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },
  //3.5
  { version: "3.5", files: { CN: "CN.jpg", EN: "EN.jpg", JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },
  //3.6
  { version: "3.6", files: { CN: "CN.jpg", EN: ["EN1.jpg","EN2.png"], JP: "JP.jpg", KR: "KR.jpg", TW: "TW.jpg" }, starring: [] },
  //3.7
  { version: "3.7", files: { CN: "CN.jpg" }, starring: [] },
  //3.8
  { version: "3.8", files: { CN: "CN.jpg" }, starring: [] },
];
