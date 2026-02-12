
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Menu, X, Globe, LogIn, ChevronRight } from 'lucide-react';
import { SiteConfig, StaffMember, LabRoom, ArchivePhase, NewsArticle } from './types';
import Home from './pages/Home';
import About from './pages/About';
import Staff from './pages/Staff';
import StaffDetail from './pages/StaffDetail';
import Labs from './pages/Labs';
import LabDetail from './pages/LabDetail';
import Reports from './pages/Reports';
import SecretArchive from './pages/SecretArchive';

type Language = 'ko' | 'en';

interface AppState {
  lang: Language;
  setLang: (lang: Language) => void;
  config: SiteConfig;
  setConfig: (config: SiteConfig) => void;
  staff: StaffMember[];
  setStaff: (staff: StaffMember[]) => void;
  labs: LabRoom[];
  setLabs: (labs: LabRoom[]) => void;
  news: NewsArticle[];
  setNews: (news: NewsArticle[]) => void;
  phases: ArchivePhase[];
  setPhases: (phases: ArchivePhase[]) => void;
  isAuthorized: boolean;
  setAuthorized: (status: boolean) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

// --- 초기 데이터 정의 ---
const INITIAL_CONFIG: SiteConfig = {
  primaryColor: '#0047AB',
  siteTitle_ko: 'DESSERTOPIA',
  siteTitle_en: 'DESSERTOPIA',
  aboutIntro_ko: '디저토피아 연구소는 2098년 4월 30일에 설립된 감각 실험 연구 기관입니다. 우리 연구소는 인간의 도파민 반응을 기준으로 디저트를 연구하는 감각 연구 기관입니다. 우리는 행복을 막연한 감정이 아니라, 관찰하고 설계할 수 있는 반응으로 봅니다. 디저트라는 매개체를 통해 사람이 즐거움을 느끼는 방식을 분석하고, 가장 안정적인 만족의 형태를 찾고자 합니다.',
  aboutIntro_en: 'Dessertopia Lab is a sensory research institution established on April 30, 2098. Dessertopia Lab is a sensory research institution that studies desserts based on human dopamine responses. We see happiness not as a vague emotion, but as a reaction that can be observed and designed. By using desserts as a medium, we analyze how people experience pleasure and explore the most stable forms of satisfaction.',
  aboutIntroImg: 'https://imgdb.in/i/n3rZ.jpg',
  aboutPurpose_ko: '본 연구소는 사람이 가장 쉽고 확실하게 이상적인 도파민 상태에 도달하도록 돕기 위해 설립되었습니다. 강한 자극이 아닌, 적은 도파민으로도 충분한 즐거움을 느낄 수 있는 조건에 주목합니다. 감각 자극을 세밀하게 나누고 조합해, 과하지 않으면서도 깊은 환상을 만드는 디저트를 연구합니다.',
  aboutPurpose_en: 'Dessertopia Lab was founded to help people reach an ideal dopamine state in the easiest and most reliable way. Rather than relying on intense stimulation, we focus on conditions where small amounts of dopamine can create meaningful enjoyment. Through careful refinement and combination of sensory stimuli, we research desserts that produce deep pleasure without excess.',
  aboutPurposeImg: 'https://imgdb.in/i/n3so.jpg',
  aboutVision_ko: '디저토피아 연구소는 디저트를 통해 인간의 쾌락 반응을 이해하고, 그 균형점을 찾는 것을 목표로 합니다. 완벽한 도파민의 황금비를 발견해 일상에서도 지속 가능한 즐거움을 제안하고자 합니다. 감각 설계를 통해 인간 경험의 새로운 이상향을 기록하는 연구소가 되고자 합니다.',
  aboutVision_en: 'Dessertopia Lab aims to understand human pleasure responses through desserts and identify their point of balance. By discovering the optimal “golden ratio” of dopamine, we seek to propose sustainable enjoyment within everyday life. Through sensory design, we aspire to document new ideals for human experience.',
  aboutVisionImg: 'https://imgdb.in/i/n3sm.jpg',
  introTitle_ko: 'DESSERTOPIA : The Sensory Lab for Ideal Pleasure',
  introTitle_en: 'DESSERTOPIA : The Sensory Lab for Ideal Pleasure',
  introDesc_ko: '우리는 행복이란 단순히 정신적 개념이 아니라 화학적 구조이며, 디저트야말로 그 구조를 가장 순수하게 재현할 수 있는 매개체라고 믿습니다.',
  introDesc_en: 'We believe that happiness is not merely a mental concept, but a chemical structure, and that desserts are the purest medium through which this structure can be recreated.',
  introImage: 'https://imgdb.in/i/n3rZ.jpg', 
  homeIdentityTitle_ko: '도파민 반응을 높이는 디저트 개발',
  homeIdentityTitle_en: 'Dessert Development to Enhance Dopamine Responses',
  homeIdentityDesc_ko: '인간을 ‘가장 쉽게, 가장 확실하게’ 도파민 상태에 도달시키는 디저트 개발',
  homeIdentityDesc_en: 'Dessertopia Development Designed to Bring Humans to a Dopamine State in the Easiest and Most Reliable Way.',
  homeIdentityImg: 'https://imgdb.in/i/n3th.jpg',
  homeIdentityFounded: '2098. 04. 30',
  homeIdentityLocation: 'SEOUL, KOREA',
  homeStat1Label: 'SENSORY NODES', homeStat1Value: '1,250',
  homeStat2Label: 'CLINICAL PHASES', homeStat2Value: '4',
  homeStat3Label: 'DATA RECOVERY', homeStat3Value: '98.7%',
  homeStat4Label: 'PATENT ASSETS', homeStat4Value: '320+',
  brandSlogan_ko: '맞춤형 감각 치료제 개발을 통하여 환자들에게 더 나은 삶을 제공하고자 합니다.',
  brandSlogan_en: 'We aim to provide a better life for patients through the development of customized sensory therapies.',
  homeResearchTitle_ko: 'LATEST RESEARCH',
  homeResearchTitle_en: 'LATEST RESEARCH',
  homeResearchDesc_ko: '감각의 한계를 개척하는 우리의 진보',
  homeResearchDesc_en: 'Our progress in the sensory frontier',
};

const INITIAL_STAFF: StaffMember[] = [
  { 
    id: 'elara-weiss', 
    name_ko: '엘라라 와이스 박사', 
    name_en: 'Dr. Elara Weiss', 
    area_ko: '연구소 총괄 관리 구역', 
    area_en: 'HQ Operations Sector', 
    tagline_ko: '과학의 정교함이 삶에 조용한 위로가 되기를 바랍니다.', 
    tagline_en: 'We hope the precision of science can become a quiet comfort in everyday life', 
    bio_ko: '우리는 행복을 종종 우연한 감정이나 설명할 수 없는 상태로 생각합니다. 하지만 오랜 연구를 통해, 기쁨과 평온은 몸과 감각이 만들어내는 반응이라는 사실을 깨닫게 되었습니다. 디저토피아 연구소는 이 보이지 않는 반응의 흐름을 이해하고, 더 안정적인 방향으로 설계하기 위해 노력합니다. 우리의 연구는 강한 자극이 아닌, 오늘을 무리 없이 살아가고 내일을 다시 시작할 수 있게 하는 조용한 정서의 에너지에 집중합니다. 과학의 정교함이 삶의 작은 위로가 되기를 바랍니다.', 
    bio_en: 'We often think of happiness as something that appears by chance, or as a feeling that cannot be fully explained. Through long-term research, however, we have come to understand that joy and calm are clear responses created by the body and the senses. Dessertopia Lab was founded to understand these invisible processes and guide them toward a more stable direction. Our research does not seek intense stimulation, but a quiet emotional energy that helps people get through today and begin again tomorrow. We hope the precision of science can offer gentle comfort to everyday life.', 
    authLevel_ko: 'Tier-1 최고 관리자 권한', 
    authLevel_en: 'Tier-1 Executive Access', 
    image: 'https://imgdb.in/i/n3t1.jpg' 
  },
  { 
    id: 'marcus-sterling', 
    name_ko: '마커스 스털링 박사', 
    name_en: 'Dr. Marcus Sterling', 
    area_ko: '샘플 카탈로그실', 
    area_en: 'Sample Archive Sector', 
    tagline_ko: '우리가 연구하는 즐거움은 언제나 자연이 허락한 가장 순수한 원재료에서 시작됩니다.', 
    tagline_en: 'All great outcomes begin with pure origins.', 
    bio_ko: '저는 전 세계의 청정 지역을 탐사하며, 인간의 감각에 긍정적인 반응을 일으키는 최상급의 천연 원료를 선별하고 관리합니다. 샘플 카탈로그실은 단순히 좋은 재료를 모으는 공간이 아닙니다. 각 원재료가 지닌 특성과 반응을 기록하고, 감각에 직접 작용하는 핵심 요소를 정리해 이후 모든 실험의 기준을 만듭니다. 기술이 발전한 시대일수록, 진정한 안정감은 정직한 기원에서 나온다고 믿습니다.', 
    bio_en: 'The pleasure we study always begins with the purest raw materials permitted by nature. I explore pristine regions around the world to carefully select and manage the finest natural ingredients that create positive sensory responses in humans. The Sample Catalog Room is not simply a place to collect good materials. It documents the unique qualities of each ingredient and organizes the key sensory elements that directly influence perception. These records become the foundation for all future experiments. In an age of advanced technology, I believe true stability still comes from honest origins.', 
    authLevel_ko: 'Tier-2 선임 연구원 권한', 
    authLevel_en: 'Tier-2 Senior Researcher Access', 
    image: 'https://imgdb.in/i/n3t3.jpg' 
  },
  { 
    id: 'aoife-osullivan', 
    name_ko: '이파 오설리반 박사', 
    name_en: 'Dr. Aoife O’Sullivan', 
    area_ko: '조합 실험실', 
    area_en: 'Composition Lab Sector', 
    tagline_ko: '완벽한 조합이란, 기술의 정교함이 감정과 만나는 지점입니다.', 
    tagline_en: 'A perfect combination is where technical precision meets emotion.', 
    bio_ko: '조합 실험실은 분리된 감각 요소들이 하나의 감정으로 완성되는 공간입니다. 저는 다양한 감각 데이터를 분석해, 불안정한 정서 상태를 가진 사람들을 위해 균형 잡힌 조합을 만듭니다. 강한 자극은 쉽게 만들 수 있지만, 부담 없이 오래 이어지는 즐거움은 훨씬 더 정밀한 설계를 필요로 합니다. 조합 실험실에서는 미세한 변화까지 반복적으로 검증하며, 모든 설계는 우연에 맡기지 않습니다. 한 입의 디저트는 수많은 실험을 거쳐 완성되었으며, 삶의 리듬을 해치지 않는 안정적인 즐거움을 위해 노력합니다.', 
    bio_en: 'The Combination Lab is the core space where separated sensory elements come together to form a single experience of pleasure. I analyze diverse sensory data to design balanced combinations for people with different emotional states and needs. Creating strong stimulation is easy, but building enjoyment that feels comfortable and lasts requires a much higher level of precision. Every design is carefully tested, down to the smallest change, and nothing is left to chance. Each bite of dessert is a carefully structured sensory experience, created through repeated simulations and experiments to support a calm and stable emotional balance in everyday life.', 
    authLevel_ko: 'Tier-2 선임 연구원 권한', 
    authLevel_en: 'Tier-2 Senior Researcher Access', 
    image: 'https://imgdb.in/i/n3t4.jpg' 
  },
  { 
    id: 'silas-vanderbilt', 
    name_ko: '사일러스 밴더빌트 박사', 
    name_en: 'Dr. Silas Vanderbilt', 
    area_ko: '분석 기록실', 
    area_en: 'Analysis Chamber Sector', 
    tagline_ko: '보이지 않는 마음의 변화를 데이터로 증명합니다.', 
    tagline_en: 'We translate unseen changes of the mind into measurable data.', 
    bio_ko: '분석 기록실은 디저토피아 연구소가 추구하는 행복의 과학이 실제로 작동하는지 검증합니다. 우리는 감정을 막연한 느낌이 아닌, 관찰 가능한 변화로 기록합니다. 사람들의 기분 흐름과 안정 상태를 같은 기준으로 수집하고 정리해, 지속 가능한 즐거움의 구조를 만듭니다. 기록실의 역할은 수치를 모으는 데 그치지 않습니다. 연구 결과가 일상에 어떤 영향을 남기는지, 그 효과가 오래 이어지는지를 시간에 따라 추적합니다. 이렇게 쌓인 기록은 연구소 전체의 기준이 되며, 감정은 흔들려도 기록은 흔들리지 않아야 한다는 원칙을 증명합니다.', 
    bio_en: 'The Analysis Archive is the space where Dessertopia Lab confirms whether the “science of happiness” it pursues truly works. We record emotions not as vague feelings, but as observable changes. By collecting and organizing patterns of mood and emotional stability under consistent standards, we verify structures of enjoyment that are safe and sustainable. The role of the archive goes beyond gathering numbers—it tracks how research outcomes influence daily life and whether their effects continue over time. These accumulated records become the foundation of the lab, proving that while emotions may fluctuate, our records remain steady and reliable.', 
    authLevel_ko: 'Tier-2 선임 연구원 권한', 
    authLevel_en: 'Tier-2 Senior Researcher Access', 
    image: 'https://imgdb.in/i/n3t5.jpg' 
  },
];

const INITIAL_LABS: LabRoom[] = [
  {
    id: 'lab-sample',
    name_ko: 'Sample Archive',
    name_en: 'Sample Archive',
    englishName: 'Sample Archive Sector',
    staffId: 'marcus-sterling',
    staffName: 'Dr. Marcus Sterling',
    description_ko: '모든 연구가 시작되는 출발점으로, 핵심 원료가 한곳에서 체계적으로 관리되는 공간입니다.',
    description_en: 'As the starting point for all research, this is a space where core raw materials are systematically managed in one location.',
    images: [
      'https://imgdb.in/i/n3t6.jpg',
      'https://imgdb.in/i/n3t7.jpg',
      'https://imgdb.in/i/n3t9.jpg'
    ],
    details_ko: '이곳에는 전 세계의 다양한 자연 환경에서 선별된 천연 원료들이 모여 있습니다. 각 원료는 사람의 정서 반응을 기준으로 분류되어 보관됩니다. 이곳에서는 원재료가 지닌 고유한 특성이 손상되지 않도록, 일정한 기준 아래 안정적인 상태를 유지하는 데 집중합니다.\n\n모든 원료는 미세하게 조절되는 온도와 습도 환경, 외부 오염을 막는 밀폐형 보관 설비 안에서 관리됩니다. 이 과정은 이후 실험에서 불필요한 변화를 줄이기 위한 준비 단계로 작동합니다.\n\n보존 과정을 거친 원료는 감정과 직접적으로 관련된 핵심 요소를 중심으로 추출 과정을 거칩니다. 필요하지 않은 요소를 제외하고 정서적 반응을 이끄는 성분만을 선별합니다.\n\n이렇게 추출된 감각 요소들은 조합 실험실로 전달되어 설계와 실험의 기초 자료로 활용됩니다. 샘플 카탈로그실은 원료들을 꾸준히 관리하고 기록함으로써, 실험이 같은 기준 아래에서 안정적으로 진행될 수 있도록 돕는 공간입니다. 디저토피아 연구소가 지향하는 안전하고 일관된 정서 경험의 기반을 이루는 곳입니다.',
    details_en: 'This facility gathers natural raw materials selected from various environments worldwide. Each material is classified and stored based on human emotional responses. We focus on maintaining a stable state under strict standards to prevent damage to unique characteristics.\n\nAll materials are managed within precisely controlled temperature and humidity environments and hermetically sealed storage facilities. This serves as a preparation stage to minimize unnecessary variables in future experiments.\n\nPreserved materials undergo extraction focused on core elements directly related to emotions, selecting only the components that trigger emotional responses. These extracted sensory elements are then transferred to the Composition Lab to be used as foundational data for design and experimentation. By continuously managing and recording raw materials, the Sample Archive ensures experiments proceed stably under consistent standards, forming the foundation of the safe and consistent emotional experience DESSERTOPIA aims for.',
    specs: [
      { label_ko: '샘플 보유량', label_en: 'Sample Count', value: '45,000+' },
      { label_ko: '정밀도', label_en: 'Precision', value: '0.0001mg' }
    ]
  },
  {
    id: 'lab-composition',
    name_ko: 'Composition Lab',
    name_en: 'Composition Lab',
    englishName: 'Composition Lab Sector',
    staffId: 'aoife-osullivan',
    staffName: 'Dr. Aoife O’Sullivan',
    description_ko: '정리된 감각 요소들이 실제 결과물로 만들어지는 공간으로, 연구소의 핵심적인 작업이 이루어지는 곳입니다.',
    description_en: 'A space where organized sensory elements are transformed into actual outcomes, representing the core operations of the lab.',
    images: [
      'https://imgdb.in/i/n3sm.jpg',
      'https://imgdb.in/i/n3tb.jpg',
      'https://imgdb.in/i/n3tc.jpg'
    ],
    details_ko: '이곳에서는 각 감각 요소가 사람과 어떤 관계를 가지는지를 살펴본 뒤, 안전하면서도 효과적인 배합 비율을 찾습니다. 단순히 여러 요소를 섞는 것이 아니라, 사람의 몸과 감정에 무리가 가지 않도록 순서와 양, 반응 속도를 세심하게 고려합니다.\n\n조합 실험실의 모든 작업은 연구소 내부 기준에 따라 진행되며, 연구진은 기쁨이나 안정감과 같은 정서가 어떤 조건에서 나타나는지를 기록된 자료를 통해 검토합니다. 모든 과정은 외부 영향을 최소화한 깨끗한 환경에서 이루어지며, 정밀한 계량 장비를 통해 각 성분이 일정하게 관리됩니다.\n\n작업 중 발생하는 모든 변화는 즉시 기록되고 기준 자료와 비교되어, 결과물의 안정성과 일관성이 유지되도록 합니다. 이렇게 완성된 실험체들은 내부 기준을 통과한 중간 단계의 결과물로, 이후 분석 기록실로 전달됩니다.\n\n조합 실험실은 감각 요소를 실제 형태로 연결하는 과정의 중심으로서, 디저토피아 연구소의 정서 설계가 같은 기준 아래에서 구현되도록 지탱하는 역할을 하는 공간입니다.',
    details_en: 'Here, we examine the relationship between each sensory element and human perception to find safe yet effective blending ratios. It is not just about mixing; we carefully consider sequence, quantity, and reaction speed to ensure no strain on the body or emotions.\n\nAll operations in the Composition Lab proceed according to internal standards, where researchers review how emotions like joy or stability emerge under specific conditions using recorded data. The entire process takes place in a clean environment to minimize external influence, with components consistently managed via precision weighing equipment.\n\nAll changes occurring during work are immediately recorded and compared with reference data to maintain stability and consistency. The resulting test subjects are intermediate outcomes that have passed internal criteria, which are then transferred to the Analysis Chamber. As the center of connecting sensory elements to physical forms, the Composition Lab supports the implementation of DESSERTOPIA\'s emotional design under unified standards.',
    specs: [
      { label_ko: '합성 효율', label_en: 'Synthesis Eff.', value: '99.2%' },
      { label_ko: '특허 배합', label_en: 'Patented Ratios', value: '180+' }
    ]
  },
  {
    id: 'lab-analysis',
    name_ko: 'Analysis & Response Chamber',
    name_en: 'Analysis & Response Chamber',
    englishName: 'Analysis Chamber Sector',
    staffId: 'silas-vanderbilt',
    staffName: 'Dr. Silas Vanderbilt',
    description_ko: '이곳은 결과물이 사람의 감정과 몸에 어떤 변화를 주는지를 확인하고 기록하는 디저토피아 연구소의 마지막 단계 공간입니다.',
    description_en: 'This is the final stage facility of DESSERTOPIA, where changes in human emotions and physical states caused by the outcomes are verified and recorded.',
    images: [
      'https://imgdb.in/i/n4es.jpg',
      'https://imgdb.in/i/n3sk.jpg',
      'https://imgdb.in/i/n3td.jpg'
    ],
    details_ko: '이곳에서는 제조한 디저트가 실제로 사람의 정서에 긍정적인 영향을 주는지를 살펴보며, 연구 전 과정이 올바르게 이루어졌는지를 점검합니다. 분석 기록실의 작업은 몸에 부담을 주지 않는 측정 장비를 통해 진행되며, 참여자의 동의 하에 수집된 반응 변화는 실시간으로 확인되고 정리됩니다.\n\n기분의 변화, 반응의 흐름, 회복에 이르기까지의 과정은 하나의 기록으로 남아, 설계된 감정이 얼마나 안정적으로 유지되는지를 판단하는 기준이 됩니다. 이 과정에서 모든 반응은 미리 정해진 안전 범위 안에서 검토되며, 감정이 과도하게 자극되거나 몸에 무리가 가지 않는지를 꼼꼼히 확인합니다.\n\n이렇게 모인 기록들은 연구소 내부 기준을 점검하고 보완하는 자료로 활용되며, 시간이 지나도 그 영향이 어떻게 이어지는지 지속적으로 살펴보는 데 사용됩니다. 분석 기록실에 보관되는 모든 자료는 디저토피아 연구소가 책임감 있게 연구를 수행하고 있음을 보여주는 근거이자, 우리가 만드는 즐거움이 순간적인 자극이 아닌 오래 유지될 수 있는 정서적 가치임을 증명하는 기록입니다.\n\n이곳은 보이지 않는 감정의 변화를 눈으로 확인할 수 있는 자료로 남김으로써, 더 안전하고 신뢰할 수 있는 감각 연구의 기반을 만들어나가는 공간입니다.',
    details_en: 'In this chamber, we observe whether the developed desserts truly have a positive impact on human emotions and verify if the entire research process was conducted correctly. Operations use measurement equipment that does not strain the body, and response changes collected with participant consent are reviewed and organized in real-time.\n\nProcesses from mood changes and response flows to recovery are kept as single records, serving as criteria to judge how stably designed emotions are maintained. All responses are reviewed within pre-defined safety ranges, meticulously checking if emotions are over-stimulated or if the body is under stress. These collected records are used to supplement internal standards and track long-term effects over time.\n\nAll data stored in the Analysis Archive serves as evidence of DESSERTOPIA\'s responsible research and proves that the pleasure we create is not momentary stimulation but a lasting emotional value. By documenting invisible emotional changes as observable data, this facility builds the foundation for safer and more reliable sensory research.',
    specs: [
      { label_ko: '분석 데이터량', label_en: 'Data Volume', value: '1.2PB' },
      { label_ko: '검증 신뢰도', label_en: 'Reliability', value: '99.9%' }
    ]
  }
];

const INITIAL_PHASES: ArchivePhase[] = [
  { 
    id: 'p1', 
    range: 'D+00 ~ D+30', 
    title_ko: 'EXPERIMENT LOG — D+00', 
    title_en: 'EXPERIMENT LOG — D+00', 
    desc_ko: 'Initial Response Phase\n본 기록은 실험 개시 후 초기 30일간의 관찰 내용을 포함합니다.', 
    desc_en: 'Initial Response Phase. Covers the first 30 days of observation.', 
    labs: [
      {
        id: 'lab1-+30',
        name_ko: '샘플 카탈로그실',
        name_en: 'Sample Archive',
        director_ko: 'Dr. Marcus Sterling',
        director_en: 'Dr. Marcus Sterling',
        intro_ko: '“본 실험의 기초가 되는 원료 샘플을 관리·기록합니다.”',
        intro_en: '“We manage and record the raw material samples that form the basis of this experiment.”',
        detail_ko: '본 실험실은 모든 실험의 기초가 되는 원료 샘플을 관리·기록합니다.\n각 원료는 개별 코드로 분류되며, 감각 반응 예측값을 기준으로 선별되었습니다.',
        detail_en: 'This laboratory manages and records raw material samples. Each is classified by code based on sensory predicted values.',
        files: [{ 
          id: 'f1', 
          title_ko: 'SAMPLE CATALOG — RAW MATERIAL ARCHIVE +30.pdf', 
          title_en: 'Sample Catalog +30.pdf', 
          url: '#', 
          images: ['https://imgdb.in/i/n42L.jpg', 'https://imgdb.in/i/n42M.jpg'] 
        }]
      },
      {
        id: 'lab2-+30',
        name_ko: '조합 실험실',
        name_en: 'Composition Lab',
        director_ko: 'Dr. Aoife O’Sullivan',
        director_en: 'Dr. Aoife O’Sullivan',
        intro_ko: '“감각 인자 간 조합 및 반응을 검증하는 핵심 실험 구역입니다.”',
        intro_en: '“Core experiment zone for verifying sensory factor combinations and reactions.”',
        detail_ko: '실험 일자: +30\n실험 단계: 1차 조합 검증 (Primary Synthesis Test)\n목적: 감각 인자 간 초기 상호작용 확인 및 안정성 검증',
        detail_en: 'Date: +30. Stage: Primary Synthesis Test. Purpose: Verify initial interactions and stability.',
        files: [
          { 
            id: 'f2', 
            title_ko: 'The Synthesis Lab — Initial Combination Log +30.pdf', 
            title_en: 'Combination Log +30.pdf', 
            url: '#', 
            images: ['https://imgdb.in/i/n42N.jpg', 'https://imgdb.in/i/n42O.jpg'] 
          },
          { 
            id: 'f3', 
            title_ko: 'The Synthesis Lab — Initial Combination Log +30 photo.pdf', 
            title_en: 'Combination Photo +30.pdf', 
            url: '#', 
            images: ['https://imgdb.in/i/n3th.jpg', 'https://imgdb.in/i/n3us.jpg'] 
          }
        ]
      },
      {
        id: 'lab3-+30',
        name_ko: '분석 기록실',
        name_en: 'Analysis Chamber',
        director_ko: 'Dr. Silas Vanderbilt',
        director_en: 'Dr. Silas Vanderbilt',
        intro_ko: '“피실험자의 정서 및 생체 반응을 분석·기록합니다.”',
        intro_en: '“Analyze and record participants\' emotional and physiological responses.”',
        detail_ko: '분석 단계: 1차 섭취 반응 기록\n목적: 조합 실험체에 대한 정서 반응 방향성 및 안정성 확인',
        detail_en: 'Stage: Initial Intake Response Record. Purpose: Confirm emotional reaction direction and stability.',
        files: [
          { 
            id: 'f4', 
            title_ko: 'The Reaction Archive | Initial Response Log 00~30', 
            title_en: 'The Reaction Archive | Initial Response Log 00~30', 
            url: '#', 
            images: [
              'https://imgdb.in/i/n42P.jpg',
              'https://imgdb.in/i/n42Q.jpg',
              'https://imgdb.in/i/n42S.jpg'
            ] 
          }
        ]
      }
    ]
  },
  { 
    id: 'p2', 
    range: 'D+30 ~ D+60', 
    title_ko: 'EXPERIMENT LOG — D+30', 
    title_en: 'EXPERIMENT LOG — D+30', 
    desc_ko: 'Adjustment Phase\n본 기록은 실험 개시 후 30일에서 60일 사이의 관찰 내용을 포함합니다.', 
    desc_en: 'Adjustment Phase. Covers days 30 to 60.', 
    labs: [
      {
        id: 'lab1-+60',
        name_ko: '샘플 카탈로그실',
        name_en: 'Sample Archive',
        director_ko: 'Dr. Marcus Sterling',
        director_en: 'Dr. Marcus Sterling',
        intro_ko: '“본 실험의 기초가 되는 원료 샘플을 관리·기록합니다.”',
        intro_en: '“We manage and record the raw material samples that form the basis of this experiment.”',
        detail_ko: '본 실험실은 모든 실험의 기초가 되는 원료 샘플을 관리·기록합니다.\n각 원료는 개별 코드로 분류되며, 감각 반응 예측값을 기준으로 선별되었습니다.',
        detail_en: 'This laboratory manages and records raw material samples. Each is classified by code based on sensory predicted values.',
        files: [{ 
          id: 'f1', 
          title_ko: 'SAMPLE CATALOG — RAW MATERIAL ARCHIVE +60.pdf', 
          title_en: 'Sample Catalog +60.pdf', 
          url: '#', 
          images: ['https://imgdb.in/i/n47s.jpg', 'https://imgdb.in/i/n47t.jpg'] 
        }]
      },
      {
        id: 'lab2-+60',
        name_ko: '조합 실험실',
        name_en: 'Composition Lab',
        director_ko: 'Dr. Aoife O’Sullivan',
        director_en: 'Dr. Aoife O’Sullivan',
        intro_ko: '“감각 인자 간 조합 및 반응을 검증하는 핵심 실험 구역입니다.”',
        intro_en: '“Core experiment zone for verifying sensory factor combinations and reactions.”',
        detail_ko: '실험 일자: +60\n실험 단계: 1차 조합 검증 (Primary Synthesis Test)\n목적: 감각 인자 간 초기 상호작용 확인 및 안정성 검증',
        detail_en: 'Date: +60. Stage: Primary Synthesis Test. Purpose: Verify initial interactions and stability.',
        files: [
          { 
            id: 'f2', 
            title_ko: 'The Synthesis Lab — Initial Combination Log +60.pdf', 
            title_en: 'Combination Log +60.pdf', 
            url: '#', 
            images: ['https://imgdb.in/i/n49k.jpg', 'https://imgdb.in/i/n49m.jpg'] 
          },
          { 
            id: 'f3', 
            title_ko: 'The Synthesis Lab — Initial Combination Log +60 photo.pdf', 
            title_en: 'Combination Photo +60.pdf', 
            url: '#', 
            images: ['https://imgdb.in/i/n3ut.jpg', 'https://imgdb.in/i/n3uv.jpg'] 
          }
        ]
      },
      {
        id: 'lab3-+60',
        name_ko: '분석 기록실',
        name_en: 'Analysis Chamber',
        director_ko: 'Dr. Silas Vanderbilt',
        director_en: 'Dr. Silas Vanderbilt',
        intro_ko: '“피실험자의 정서 및 생체 반응 분석·기록합니다.”',
        intro_en: '“Analyze and record participants\' emotional and physiological responses.”',
        detail_ko: '분석 단계: 1차 섭취 반응 기록\n목적: 조합 실험체에 대한 정서 반응 방향성 및 안정성 확인',
        detail_en: 'Stage: Initial Intake Response Record. Purpose: Confirm emotional reaction direction and stability.',
        files: [
          { 
            id: 'f4', 
            title_ko: 'The Reaction Archive | Initial Response Log 30~60', 
            title_en: 'The Reaction Archive | Initial Response Log 30~60', 
            url: '#', 
            images: [
              'https://imgdb.in/i/n4en.jpg',
              'https://imgdb.in/i/n4eo.jpg',
              'https://imgdb.in/i/n4ep.jpg'
            ] 
          }
        ]
      }
    ]
  },
  { 
    id: 'p3', 
    range: 'D+60 ~ D+90', 
    title_ko: 'EXPERIMENT LOG — D+60', 
    title_en: 'EXPERIMENT LOG — D+60', 
    desc_ko: 'Final Stabilization Phase\n본 기록은 실험 개시 후 60일에서 90일 사이의 관찰 내용을 포함합니다.', 
    desc_en: 'Final Stabilization Phase. Covers days 60 to 90.', 
    labs: [
      {
        id: 'lab1-+90',
        name_ko: '샘플 카탈로그실',
        name_en: 'Sample Archive',
        director_ko: 'Dr. Marcus Sterling',
        director_en: 'Dr. Marcus Sterling',
        intro_ko: '“본 실험의 기초가 되는 원료 샘플을 관리·기록합니다.”',
        intro_en: '“We manage and record the raw material samples that form the basis of this experiment.”',
        detail_ko: '본 실험실은 모든 실험의 기초가 되는 원료 샘플을 관리·기록합니다.\n각 원료는 개별 코드로 분류되며, 감각 반응 예측값을 기준으로 선별되었습니다.',
        detail_en: 'This laboratory manages and records raw material samples. Each is classified by code based on sensory predicted values.',
        files: [{ 
          id: 'f1', 
          title_ko: 'SAMPLE CATALOG — RAW MATERIAL ARCHIVE +90.pdf', 
          title_en: 'Sample Catalog +90.pdf', 
          url: '#', 
          images: ['https://imgdb.in/i/n47u.jpg', 'https://imgdb.in/i/n47v.jpg'] 
        }]
      },
      {
        id: 'lab2-+90',
        name_ko: '조합 실험실',
        name_en: 'Composition Lab',
        director_ko: 'Dr. Aoife O’Sullivan',
        director_en: 'Dr. Aoife O’Sullivan',
        intro_ko: '“감각 인자 간 조합 및 반응을 검증하는 핵심 실험 구역입니다.”',
        intro_en: '“Core experiment zone for verifying sensory factor combinations and reactions.”',
        detail_ko: '실험 일자: +90\n실험 단계: 1차 조합 검증 (Primary Synthesis Test)\n목적: 감각 인자 간 초기 상호작용 확인 및 안정성 검증',
        detail_en: 'Date: +90. Stage: Primary Synthesis Test. Purpose: Verify initial interactions and stability.',
        files: [
          { 
            id: 'f2', 
            title_ko: 'The Synthesis Lab — Initial Combination Log +90.pdf', 
            title_en: 'Combination Log +90.pdf', 
            url: '#', 
            images: [
              'https://imgdb.in/i/n4a7.jpg',
              'https://imgdb.in/i/n4a4.jpg',
              'https://imgdb.in/i/n4a3.jpg'
            ] 
          }
        ]
      },
      {
        id: 'lab3-+90',
        name_ko: '분석 기록실',
        name_en: 'Analysis Chamber',
        director_ko: 'Dr. Silas Vanderbilt',
        director_en: 'Dr. Silas Vanderbilt',
        intro_ko: '“피실험자의 정서 및 생체 반응을 분석·기록합니다.”',
        intro_en: '“Analyze and record participants\' emotional and physiological responses.”',
        detail_ko: '분석 단계: 1차 섭취 반응 기록\n목적: 조합 실험체에 대한 정서 반응 방향성 및 안정성 확인',
        detail_en: 'Stage: Initial Intake Response Record. Purpose: Confirm emotional reaction direction and stability.',
        files: [
          { 
            id: 'f4', 
            title_ko: 'The Reaction Archive | Initial Response Log 60 ~ 90', 
            title_en: 'The Reaction Archive | Initial Response Log 60 ~ 90', 
            url: '#', 
            images: [
              'https://imgdb.in/i/n4jA.jpg',
              'https://imgdb.in/i/n4jB.jpg',
              'https://imgdb.in/i/n4jC.jpg'
            ] 
          }
        ]
      }
    ]
  },
];

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ko');
  const [isAuthorized, setAuthorized] = useState(false);

  // --- Persistence Logic ---
  const getSavedData = (key: string, initial: any) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
  };

  const [config, setConfig] = useState<SiteConfig>(() => getSavedData('site_config', INITIAL_CONFIG));
  const [staff, setStaff] = useState<StaffMember[]>(() => getSavedData('staff_data', INITIAL_STAFF));
  const [labs, setLabs] = useState<LabRoom[]>(() => getSavedData('labs_data', INITIAL_LABS)); 
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [phases, setPhases] = useState<ArchivePhase[]>(() => getSavedData('phases_data', INITIAL_PHASES));

  // Sync state to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('site_config', JSON.stringify(config));
    localStorage.setItem('staff_data', JSON.stringify(staff));
    localStorage.setItem('labs_data', JSON.stringify(labs));
    localStorage.setItem('phases_data', JSON.stringify(phases));
  }, [config, staff, labs, phases]);

  return (
    <AppContext.Provider value={{ lang, setLang, config, setConfig, staff, setStaff, labs, setLabs, news, setNews, phases, setPhases, isAuthorized, setAuthorized }}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/staff/:id" element={<StaffDetail />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/labs/:id" element={<LabDetail />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/archive" element={isAuthorized ? <SecretArchive /> : <Reports />} />
          </Routes>
        </Layout>
      </Router>
    </AppContext.Provider>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { config, isAuthorized, lang, setLang } = useApp();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isArchive = location.pathname.startsWith('/archive') && isAuthorized;
  const isStaffPage = location.pathname.startsWith('/staff');

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isArchive ? 'bg-black text-[#00ff41] font-mono overflow-x-hidden' : 'bg-white text-black'}`}>
      <nav className={`fixed top-0 w-full z-50 border-b ${isArchive ? 'border-[#00ff41]/30 bg-black/90' : 'border-gray-200 bg-white/90'} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-xl font-black tracking-tighter uppercase">DESSERTOPIA</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <NavLink to="/about" label={lang === 'ko' ? '연구소 소개' : 'About'} isArchive={isArchive} />
            <NavLink to="/staff" label={lang === 'ko' ? '운영진 소개' : 'Staff'} isArchive={isArchive} />
            <NavLink to="/labs" label={lang === 'ko' ? '실험실' : 'Labs'} isArchive={isArchive} />
            <NavLink to="/reports" label={lang === 'ko' ? '분기별 실험 현황' : 'Archive'} isArchive={isArchive} />
            <div className="flex items-center space-x-3 border-l pl-4">
              <button onClick={() => setLang('ko')} className={`text-xs font-bold ${lang === 'ko' ? 'text-blue-700' : 'text-gray-400'}`}>KO</button>
              <button onClick={() => setLang('en')} className={`text-xs font-bold ${lang === 'en' ? 'text-blue-700' : 'text-gray-400'}`}>EN</button>
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-black">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-b border-gray-200 overflow-hidden"
            >
              <div className="flex flex-col p-6 space-y-6">
                <NavLink to="/about" label={lang === 'ko' ? '연구소 소개' : 'About'} isArchive={isArchive} onClick={() => setIsMenuOpen(false)} />
                <NavLink to="/staff" label={lang === 'ko' ? '운영진 소개' : 'Staff'} isArchive={isArchive} onClick={() => setIsMenuOpen(false)} />
                <NavLink to="/labs" label={lang === 'ko' ? '실험실' : 'Labs'} isArchive={isArchive} onClick={() => setIsMenuOpen(false)} />
                <NavLink to="/reports" label={lang === 'ko' ? '분기별 실험 현황' : 'Archive'} isArchive={isArchive} onClick={() => setIsMenuOpen(false)} />
                <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
                  <div className="flex space-x-4">
                    <button onClick={() => { setLang('ko'); setIsMenuOpen(false); }} className={`text-sm font-bold ${lang === 'ko' ? 'text-blue-700' : 'text-gray-400'}`}>KO</button>
                    <button onClick={() => { setLang('en'); setIsMenuOpen(false); }} className={`text-sm font-bold ${lang === 'en' ? 'text-blue-700' : 'text-gray-400'}`}>EN</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <main className={isStaffPage && location.pathname === '/staff' ? "pt-0" : "pt-20"}>{children}</main>
    </div>
  );
};

const NavLink: React.FC<{ to: string, label: string, isArchive: boolean, onClick?: () => void }> = ({ to, label, isArchive, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`text-sm font-bold uppercase tracking-widest transition-all ${isActive ? (isArchive ? 'text-[#00ff41]' : 'text-blue-700') : (isArchive ? 'text-[#00ff41]/50' : 'text-gray-500 hover:text-black')}`}
    >
      {label}
    </Link>
  );
};

export default App;
