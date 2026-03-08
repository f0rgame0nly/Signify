import { useLocation, Link } from "wouter";
import { Camera, Type, Mic, MessageSquare, BookOpen, Hand } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/lib/i18n";

const navItems = [
  { titleKey: "home" as const, url: "/", icon: Hand },
  { titleKey: "signToText" as const, url: "/sign-to-text", icon: Camera },
  { titleKey: "textToSign" as const, url: "/text-to-sign", icon: Type },
  { titleKey: "voiceToSign" as const, url: "/voice-to-sign", icon: Mic },
  { titleKey: "conversation" as const, url: "/conversation", icon: MessageSquare },
  { titleKey: "phraseLibrary" as const, url: "/phrases", icon: BookOpen },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { setOpenMobile, isMobile } = useSidebar();
  const { t } = useLanguage();

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" onClick={handleNavClick}>
          <div className="flex items-center gap-3 cursor-pointer" data-testid="link-home-logo">
            <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary">
              <Hand className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">{t.nav.signBridge}</span>
              <span className="text-[11px] text-muted-foreground leading-tight">{t.nav.signLanguageAI}</span>
            </div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t.nav.navigation}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.titleKey}`}
                  >
                    <Link href={item.url} onClick={handleNavClick}>
                      <item.icon className="w-4 h-4" />
                      <span>{t.nav[item.titleKey]}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <p className="text-[11px] text-muted-foreground text-center">
          {t.nav.bridgingGaps}
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
