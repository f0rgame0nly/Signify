import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => setLanguage(language === "en" ? "ar" : "en")}
      data-testid="button-language-toggle"
    >
      <Languages className="h-4 w-4" />
    </Button>
  );
}
