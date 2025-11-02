import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Phone, Mail, Globe, Heart, Shield, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const WellnessResources = () => {
  const { t } = useTranslation();

  const helplines = [
    {
      name: "AASRA",
      phone: "+91-9820466726 / 022-27546669",
      email: "aasrahelpline@yahoo.com",
      description: "24/7 confidential support for suicide prevention and emotional distress.",
      available: "24/7"
    },
    {
      name: "iCALL (TISS)",
      phone: "+91-9152987821",
      email: "icall@tiss.edu",
      description: "Professional psychosocial support via phone, email, and chat.",
      available: "Mon-Sat: 8 AM - 10 PM"
    },
    {
      name: "Snehi",
      phone: "+91-9582208181",
      email: "snehi2001@gmail.com",
      description: "Emotional support for depression, suicidal thoughts, and psychosocial crises.",
      available: "24/7"
    },
    {
      name: "Tele-MANAS",
      phone: "14416 (toll-free)",
      email: "telemanas-mohfw@gov.in",
      description: "National mental health helpline by the Ministry of Health & Family Welfare. Free support in 20+ languages.",
      available: "24/7"
    },
    {
      name: "Vandrevala Foundation",
      phone: "+91-9999 666 555",
      email: "help@vandrevalafoundation.com",
      description: "Crisis intervention helpline offering free and confidential support. Available via phone, text, and online chat.",
      available: "24/7"
    }
  ];

  const faqs = [
    {
      question: "What is therapy and how can it help?",
      answer: "Therapy provides a safe space to talk, process emotions, and learn coping strategies with a trained professional."
    },
    {
      question: "Is it a sign of weakness to seek help for mental health?",
      answer: "Not at all. Seeking help shows strength and self-awareness—it's like consulting a doctor for physical health."
    },
    {
      question: "How is my data kept private?",
      answer: "Reputable helplines and therapists maintain strict confidentiality. Calls are not recorded, and identities are not shared."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Heart className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Wellness Resources
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            If you're in crisis or need someone to talk to, help is available 24/7. You're not alone.
          </p>
        </div>

        {/* Emergency Alert */}
        <Alert className="border-destructive/50 bg-destructive/10">
          <Shield className="h-5 w-5 text-destructive" />
          <AlertTitle className="text-destructive">Emergency Services</AlertTitle>
          <AlertDescription>
            If you or someone you know is in immediate danger, please call emergency services at <strong>112</strong> or visit the nearest hospital emergency room.
          </AlertDescription>
        </Alert>

        {/* Helplines Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Phone className="w-6 h-6 text-primary" />
            Mental Health Helplines (India)
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {helplines.map((helpline, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {helpline.name}
                    <span className="text-xs font-normal text-muted-foreground bg-primary/10 px-3 py-1 rounded-full">
                      {helpline.available}
                    </span>
                  </CardTitle>
                  <CardDescription>{helpline.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-primary" />
                    <a href={`tel:${helpline.phone.replace(/[^0-9+]/g, '')}`} className="hover:underline">
                      {helpline.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-primary" />
                    <a href={`mailto:${helpline.email}`} className="hover:underline">
                      {helpline.email}
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            Frequently Asked Questions
          </h2>
          <div className="grid gap-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Additional Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              • <strong>National Mental Health Program (NMHP):</strong> Visit your nearest District Mental Health Program (DMHP) center for free mental health services.
            </p>
            <p className="text-sm text-muted-foreground">
              • <strong>Online Therapy:</strong> Consider platforms like Wysa, YourDOST, or BetterHelp for professional counseling.
            </p>
            <p className="text-sm text-muted-foreground">
              • <strong>Support Groups:</strong> Join local or online support groups to connect with others facing similar challenges.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WellnessResources;
