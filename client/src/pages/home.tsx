import { Link } from "wouter";
import {
  Camera,
  Type,
  Mic,
  MessageSquare,
  BookOpen,
  ArrowRight,
  Hand,
  Zap,
  Globe,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n";

export default function Home() {
  const { t } = useLanguage();

  const features = [
    {
      title: t.nav.signToText,
      description: t.home.signToTextDesc,
      icon: Camera,
      href: "/sign-to-text",
      color: "bg-blue-500/10 dark:bg-blue-500/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: t.nav.textToSign,
      description: t.home.textToSignDesc,
      icon: Type,
      href: "/text-to-sign",
      color: "bg-emerald-500/10 dark:bg-emerald-500/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: t.nav.voiceToSign,
      description: t.home.voiceToSignDesc,
      icon: Mic,
      href: "/voice-to-sign",
      color: "bg-purple-500/10 dark:bg-purple-500/20",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: t.nav.conversation,
      description: t.home.conversationDesc,
      icon: MessageSquare,
      href: "/conversation",
      color: "bg-orange-500/10 dark:bg-orange-500/20",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
    {
      title: t.nav.phraseLibrary,
      description: t.home.phraseLibraryDesc,
      icon: BookOpen,
      href: "/phrases",
      color: "bg-rose-500/10 dark:bg-rose-500/20",
      iconColor: "text-rose-600 dark:text-rose-400",
    },
  ];

  const highlights = [
    { icon: Zap, label: t.home.aiPowered, desc: t.home.advancedRecognition },
    {
      icon: Globe,
      label: t.home.aslSupport,
      desc: t.home.americanSignLanguage,
    },
    {
      icon: Shield,
      label: t.home.accessible,
      desc: t.home.designedForEveryone,
    },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        <div className="text-center space-y-4">
          <Badge
            variant="secondary"
            className="mb-2"
            data-testid="badge-ai-powered"
          >
            {t.home.badge}
          </Badge>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground"
            data-testid="text-hero-title"
          >
            {t.home.heroTitle}
          </h1>
          <p
            className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            data-testid="text-hero-subtitle"
          >
            {t.home.heroSubtitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/sign-to-text">
              <Button data-testid="button-get-started">
                {t.home.getStarted}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/phrases">
              <Button variant="outline" data-testid="button-browse-phrases">
                {t.home.browsePhrases}
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {highlights.map((h) => (
            <Card
              key={h.label}
              className="text-center"
              data-testid={`card-highlight-${h.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <CardContent className="pt-5 pb-4 space-y-2">
                <div className="mx-auto w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <h.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="font-semibold text-sm text-foreground">
                  {h.label}
                </p>
                <p className="text-xs text-muted-foreground">{h.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <h2
            className="text-xl font-semibold text-foreground"
            data-testid="text-features-title"
          >
            {t.home.translationFeatures}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href}>
                <Card
                  className="h-full cursor-pointer hover-elevate transition-all duration-200"
                  data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <CardContent className="pt-5 pb-4 space-y-3">
                    <div
                      className={`w-10 h-10 rounded-md ${feature.color} flex items-center justify-center`}
                    >
                      <feature.icon
                        className={`w-5 h-5 ${feature.iconColor}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    <div className="flex items-center text-xs text-primary font-medium">
                      {t.home.tryItNow}
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <Card data-testid="card-how-it-works">
          <CardContent className="pt-5 pb-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t.home.howItWorks}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                  1
                </div>
                <p className="text-sm font-medium text-foreground">
                  {t.home.step1Title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.home.step1Desc}
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                  2
                </div>
                <p className="text-sm font-medium text-foreground">
                  {t.home.step2Title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.home.step2Desc}
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                  3
                </div>
                <p className="text-sm font-medium text-foreground">
                  {t.home.step3Title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.home.step3Desc}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
