import { CartProvider } from "@/context/CartContext";
import { getSettings } from "@/lib/settings";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <CartProvider>
      <AnnouncementBar text={settings.announcement} />
      <Header storeName={settings.storeName} />
      <main>{children}</main>
      <Footer settings={settings} />
      <CartDrawer currency={settings.currency} />
    </CartProvider>
  );
}
