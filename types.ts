
export interface StaffMember {
  id: string;
  name_ko: string;
  name_en: string;
  area_ko: string;
  area_en: string;
  tagline_ko: string;
  tagline_en: string;
  bio_ko: string;
  bio_en: string;
  authLevel_ko: string;
  authLevel_en: string;
  image: string;
}

export interface NewsArticle {
  id: string;
  title_ko: string;
  title_en: string;
  date: string;
  content_ko: string;
  content_en: string;
  image: string;
  tag: string;
}

export interface LabRoom {
  id: string;
  name_ko: string;
  name_en: string;
  englishName: string;
  staffId: string;
  staffName: string;
  description_ko: string;
  description_en: string;
  images: string[];
  details_ko: string;
  details_en: string;
  specs: { label_ko: string; label_en: string; value: string }[];
}

export interface SiteConfig {
  primaryColor: string;
  siteTitle_ko: string;
  siteTitle_en: string;
  aboutIntro_ko: string;
  aboutIntro_en: string;
  aboutIntroImg: string;
  aboutPurpose_ko: string;
  aboutPurpose_en: string;
  aboutPurposeImg: string;
  aboutVision_ko: string;
  aboutVision_en: string;
  aboutVisionImg: string;
  introTitle_ko: string;
  introTitle_en: string;
  introDesc_ko: string;
  introDesc_en: string;
  introImage: string;
  homeIdentityTitle_ko: string;
  homeIdentityTitle_en: string;
  homeIdentityDesc_ko: string;
  homeIdentityDesc_en: string;
  homeIdentityImg: string;
  homeIdentityFounded: string;
  homeIdentityLocation: string;
  homeStat1Label: string; homeStat1Value: string;
  homeStat2Label: string; homeStat2Value: string;
  homeStat3Label: string; homeStat3Value: string;
  homeStat4Label: string; homeStat4Value: string;
  brandSlogan_ko: string;
  brandSlogan_en: string;
  homeResearchTitle_ko: string;
  homeResearchTitle_en: string;
  homeResearchDesc_ko: string;
  homeResearchDesc_en: string;
}

export interface ArchiveFile {
  id: string;
  title_ko: string;
  title_en: string;
  url: string;
  images: string[]; // 클릭 시 보여줄 이미지들 (Lab 1,2는 2장, Lab 3은 1장)
}

export interface ArchiveLab {
  id: string;
  name_ko: string;
  name_en: string;
  director_ko: string;
  director_en: string;
  intro_ko: string;
  intro_en: string;
  detail_ko: string;
  detail_en: string;
  files: ArchiveFile[];
}

export interface ArchivePhase {
  id: string;
  range: string;
  title_ko: string;
  title_en: string;
  desc_ko: string;
  desc_en: string;
  labs: ArchiveLab[];
}
