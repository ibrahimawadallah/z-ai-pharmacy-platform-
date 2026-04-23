import { Shield, Stethoscope, Heart, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">About DrugEye</h1>
      
      <div className="prose max-w-none space-y-6">
        <p className="text-lg text-muted-foreground">
          DrugEye is an AI-powered clinical intelligence platform designed for healthcare professionals in the UAE. 
          We provide instant access to 19,000+ UAE-approved medications with real-time drug interaction checking 
          and personalized recommendations.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-primary">19K+</div>
            <div className="text-sm text-muted-foreground">UAE Approved Drugs</div>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-primary">24/7</div>
            <div className="text-sm text-muted-foreground">AI Support</div>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-primary">500+</div>
            <div className="text-sm text-muted-foreground">Partner Pharmacies</div>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-primary">99.9%</div>
            <div className="text-sm text-muted-foreground">Accuracy Rate</div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8">Certifications</h2>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
            <Shield className="w-5 h-5 text-emerald-500" />
            <span>HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
            <Stethoscope className="w-5 h-5 text-cyan-500" />
            <span>UAE MOH Approved</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
            <Award className="w-5 h-5 text-violet-500" />
            <span>ISO 27001 Certified</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
            <Heart className="w-5 h-5 text-rose-500" />
            <span>GDPR Compliant</span>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8">Contact</h2>
        <p className="text-muted-foreground">
          Email: support@drugeye.com<br />
          UAE Ministry of Health License: MOH-2024-001
        </p>
      </div>
    </div>
  )
}