'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, Mail, Phone, FileText, ChevronRight } from 'lucide-react'

const faqs = [
  {
    question: 'How do I search for a medication?',
    answer: 'Use the search bar on the dashboard or navigate to /search to browse and filter medications by name, category, or ICD-10 code.'
  },
  {
    question: 'How does drug interaction checking work?',
    answer: 'Add multiple drugs to your comparison list and click "Check Interactions" to see potential interactions categorized by severity.'
  },
  {
    question: 'Is this platform approved by UAE health authorities?',
    answer: 'Yes, DrugEye is UAE Ministry of Health approved and complies with all local regulations.'
  },
  {
    question: 'How do I report a drug safety concern?',
    answer: 'Navigate to /alerts to view recent safety alerts. You can also contact our support team directly.'
  }
]

export default function SupportPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Support</h1>
      <p className="text-muted-foreground mb-8">Get help with DrugEye</p>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Live Chat</div>
                <div className="text-sm text-muted-foreground">Available 24/7</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Email</div>
                <div className="text-sm text-muted-foreground">support@drugeye.com</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">UAE Helpline</div>
                <div className="text-sm text-muted-foreground">800 DRUGEYE</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="font-medium mb-1">{faq.question}</div>
                <div className="text-sm text-muted-foreground">{faq.answer}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-lg font-medium text-primary">Thank you!</div>
              <div className="text-muted-foreground">We'll respond within 24 hours.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder="How can we help?"
                  className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background text-sm"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}