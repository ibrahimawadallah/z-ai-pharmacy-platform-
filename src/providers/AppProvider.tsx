'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

export interface ICD10Code {
  code: string
  description: string | null
  category: string | null
}

export interface DrugInteraction {
  id: string
  secondaryDrugName: string | null
  severity: string | null
  description: string | null
  management: string | null
  interactionType: string | null
}

export interface SideEffect {
  id: string
  sideEffect: string
  frequency: string | null
  severity: string | null
}

export interface UAEDrug {
  id: string
  drugCode: string
  packageName: string
  genericName: string
  strength: string
  dosageForm: string
  packageSize: string | null
  status: string
  dispenseMode: string | null
  packagePricePublic: number | null
  packagePricePharmacy: number | null
  agentName: string | null
  manufacturerName: string | null
  includedInThiqaABM: string | null
  includedInBasic: string | null
  pregnancyCategory: string | null
  breastfeedingSafety: string | null
  renalAdjustment: string | null
  hepaticAdjustment: string | null
  warnings: string | null
  icd10Codes?: ICD10Code[]
  interactions?: DrugInteraction[]
  sideEffects?: SideEffect[]
}

interface AppContextType {
  language: 'en' | 'ar'
  dir: 'ltr' | 'rtl'
  setLanguage: (lang: 'en' | 'ar') => void
  stats: { active: number; thiqa: number; basic: number; interactions: number; sideEffects: number; icd10Mappings: number }
  categories: { name: string; count: number }[]
  favorites: { drugCode: string; drugName: string; notes?: string }[]
  toggleFavorite: (drug: UAEDrug) => Promise<void>
  t: any
}

const translations = {
  en: {
    title: 'UAE Drug Database & Education Platform',
    subtitle: 'Ministry of Health Approved',
    search: 'Search drugs...',
    searchByDrug: 'By Drug Name',
    searchByICD10: 'By ICD-10 Code',
    interactionChecker: 'Interaction Checker',
    dosageCalculator: 'Dosage Calculator',
    pregnancySafety: 'Pregnancy Safety',
    courses: 'Courses',
    favorites: 'Favorites',
    publicPrice: 'Public Price',
    pharmacyPrice: 'Pharmacy Price',
    warnings: 'Warnings',
    sideEffects: 'Side Effects',
    interactions: 'Interactions',
    indications: 'Indications (ICD-10)',
    noResults: 'No results found',
    selectDrugsToCheck: 'Select 2 or more drugs to check interactions',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    disclaimer: 'MEDICAL DISCLAIMER',
    disclaimerText: 'This platform is for educational purposes only. All drug information should be verified with official UAE Ministry of Health sources. Clinical decisions should be made by qualified healthcare professionals. The content has been reviewed by a licensed pharmacist but should not replace professional medical judgment.',
    verifiedByPharmacist: 'Content reviewed and approved by licensed pharmacist',
    iUnderstand: 'I Understand',
    help: 'Help',
    drugsLabel: 'Drugs',
    interactionsLabel: 'Interactions',
    settings: 'Settings',
    support: 'Support',
    about: 'About',
    // Consultation page
    consultationTitle: 'AI Clinical Consultation',
    consultationSubtitle: 'Powered by DrugEye Intelligence',
    attachPatient: 'Attach patient',
    detachPatient: 'Detach',
    newChat: 'New Chat',
    askPlaceholder: 'Ask about a drug, interaction, dose, or disease...',
    askAboutPatientPlaceholder: "Ask about {name}'s drugs, interactions, or dose...",
    sendMessage: 'Send',
    pregnantLabel: 'Pregnant',
    allergiesLabel: 'Allergies',
    activeMedsSuffix: 'active med',
    activeMedsSuffixPlural: 'active meds',
    suggestedQueries: [
      'What are the contraindications for Metformin in renal impairment?',
      'Check interactions between Warfarin and Aspirin',
      'What is the pediatric dosing for Amoxicillin?',
      'Compare efficacy of Atorvastatin vs Rosuvastatin',
      'What are the side effects of SSRIs?',
      'Drugs to avoid in pregnancy',
    ],
    // Data source page / badge
    dataSourceTitle: 'Data Sources & Freshness',
    poweredByMoh: 'Powered by UAE MOH registry',
    drugsWord: 'drugs',
    lastSynced: 'last synced',
    sourcesLink: 'sources',
    neverSynced: 'never',
    difficulty: { Beginner: 'Beginner', Intermediate: 'Intermediate', Advanced: 'Advanced' },
    severity: { severe: 'Severe', moderate: 'Moderate', minor: 'Minor' },
    fdaCategories: {
      A: 'A - Safe', B: 'B - Probably Safe', C: 'C - Risk Cannot Be Ruled Out',
      D: 'D - Positive Evidence of Risk', X: 'X - Contraindicated', N: 'N - FDA Not Classified'
    }
  },
  ar: {
    title: 'DrugEye Intelligence',
    subtitle: 'معتمدة من وزارة الصحة',
    search: 'البحث عن الأدوية...',
    searchByDrug: 'حسب اسم الدواء',
    searchByICD10: 'حسب رمز ICD-10',
    interactionChecker: 'فاحص التداخلات الدوائية',
    dosageCalculator: 'حاسبة الجرعات',
    pregnancySafety: 'سلامة الحمل والرضاعة',
    courses: 'الدورات',
    favorites: 'المفضلة',
    publicPrice: 'سعر الجمهور',
    pharmacyPrice: 'سعر الصيدلية',
    warnings: 'التحذيرات',
    sideEffects: 'الآثار الجانبية',
    interactions: 'التداخلات',
    indications: 'الاستطبابات (ICD-10)',
    noResults: 'لا توجد نتائج',
    selectDrugsToCheck: 'اختر دوائين أو أكثر للتحقق من التداخلات',
    signIn: 'تسجيل الدخول',
    signOut: 'تسجيل الخروج',
    disclaimer: 'إخلاء المسؤولية الطبية',
    disclaimerText: 'هذه المنصة للأغراض التعليمية فقط. يجب التحقق من جميع معلومات الأدوية من المصادر الرسمية لوزارة الصحة الإماراتية. القرارات السريرية يجب أن تتخذ من قبل متخصصين صحيين مؤهلين.',
    verifiedByPharmacist: 'تمت مراجعة المحتوى والموافقة عليه من قبل صيدلي مرخص',
    iUnderstand: 'فهمت',
    help: 'مساعدة',
    drugsLabel: 'دواء',
    interactionsLabel: 'تداخلات',
    settings: 'الإعدادات',
    support: 'الدعم',
    about: 'حول',
    // Consultation page
    consultationTitle: 'الاستشارة السريرية بالذكاء الاصطناعي',
    consultationSubtitle: 'مدعوم من DrugEye Intelligence',
    attachPatient: 'إرفاق مريض',
    detachPatient: 'إلغاء الإرفاق',
    newChat: 'محادثة جديدة',
    askPlaceholder: 'اسأل عن دواء، تداخل، جرعة أو مرض...',
    askAboutPatientPlaceholder: 'اسأل عن أدوية {name} وتداخلاتها وجرعاتها...',
    sendMessage: 'إرسال',
    pregnantLabel: 'حامل',
    allergiesLabel: 'حساسية',
    activeMedsSuffix: 'دواء فعّال',
    activeMedsSuffixPlural: 'أدوية فعّالة',
    suggestedQueries: [
      'ما موانع استخدام الميتفورمين في القصور الكلوي؟',
      'افحص التداخلات بين الوارفارين والأسبرين',
      'ما جرعات الأموكسيسيلين للأطفال؟',
      'قارن بين فعالية الأتورفاستاتين والروزوفاستاتين',
      'ما الآثار الجانبية لمثبطات استرداد السيروتونين (SSRIs)؟',
      'أدوية يجب تجنبها خلال الحمل',
    ],
    // Data source page / badge
    dataSourceTitle: 'مصادر البيانات والتحديث',
    poweredByMoh: 'مدعوم بسجل وزارة الصحة الإماراتية',
    drugsWord: 'دواء',
    lastSynced: 'آخر تحديث',
    sourcesLink: 'المصادر',
    neverSynced: 'لم تتم المزامنة',
    difficulty: { Beginner: 'مبتدئ', Intermediate: 'متوسط', Advanced: 'متقدم' },
    severity: { severe: 'شديد', moderate: 'متوسط', minor: 'بسيط' },
    fdaCategories: {
      A: 'A - آمن', B: 'B - غالباً آمن', C: 'C - لا يمكن استبعاد الخطر',
      D: 'D - دليل إيجابي على الخطر', X: 'X - ممنوع', N: 'N - غير مصنف FDA'
    }
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [stats, setStats] = useState({ active: 0, thiqa: 0, basic: 0, interactions: 0, sideEffects: 0, icd10Mappings: 0 })
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([])
  const [favorites, setFavorites] = useState<{ drugCode: string; drugName: string; notes?: string }[]>([])

  const t = translations[language]
  const dir: 'ltr' | 'rtl' = language === 'ar' ? 'rtl' : 'ltr'

  // Keep <html lang> and <html dir> in sync with the selected locale.
  // We write both so CSS logical properties (`rtl:` variants, `start`/`end`)
  // resolve correctly on every authenticated route.
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.lang = language
    document.documentElement.dir = dir
  }, [language, dir])

  // Load stats and categories
  useEffect(() => {
    fetch('/api/drugs/stats').then(r => r.json()).then(d => {
      if (d.statistics) setStats({
        active: d.statistics.active,
        thiqa: d.statistics.formulary?.thiqa || 0,
        basic: d.statistics.formulary?.basic || 0,
        interactions: d.statistics.interactions || 0,
        sideEffects: d.statistics.sideEffects || 0,
        icd10Mappings: d.statistics.icd10Mappings || 0
      })
    }).catch(err => console.error('Stats fetch error:', err))

    fetch('/api/drugs/icd10/search').then(r => r.json()).then(d => {
      if (d.categories) setCategories(d.categories)
    }).catch(err => console.error('Categories fetch error:', err))
  }, [])

  // Load language and local favorites
  useEffect(() => {
    const savedLang = localStorage.getItem('uae-drug-language')
    if (savedLang && savedLang !== language) {
       
      setLanguage(savedLang as 'en' | 'ar')
    }

    if (status !== 'authenticated') {
      const savedFavorites = localStorage.getItem('uae-drug-favorites')
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites)
        if (JSON.stringify(parsed) !== JSON.stringify(favorites)) {
          setFavorites(parsed)
        }
      }
    }
  }, [status, language, favorites])

  // Load server favorites when authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/user/favorites').then(r => r.json()).then(d => {
        if (d.success && d.data) {
          setFavorites(d.data.map((f: any) => ({ drugCode: f.drugCode, drugName: f.drugName, notes: f.notes })))
        }
      })
    }
  }, [status])

  // Save favorites to local storage
  useEffect(() => {
    if (status !== 'authenticated') {
      localStorage.setItem('uae-drug-favorites', JSON.stringify(favorites))
    }
  }, [favorites, status])

  const toggleFavorite = async (drug: UAEDrug) => {
    const exists = favorites.find(f => f.drugCode === drug.drugCode)
    
    if (status === 'authenticated') {
      try {
        if (exists) {
          await fetch('/api/user/favorites', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ drugCode: drug.drugCode })
          })
        } else {
          await fetch('/api/user/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ drugCode: drug.drugCode, drugName: drug.packageName })
          })
        }
      } catch {}
    }
    
    setFavorites(prev => {
      if (exists) return prev.filter(f => f.drugCode !== drug.drugCode)
      return [...prev, { drugCode: drug.drugCode, drugName: drug.packageName }]
    })
  }

  const handleSetLanguage = (lang: 'en' | 'ar') => {
    setLanguage(lang)
    localStorage.setItem('uae-drug-language', lang)
  }

  return (
    <AppContext.Provider value={{ language, dir, setLanguage: handleSetLanguage, stats, categories, favorites, toggleFavorite, t }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
