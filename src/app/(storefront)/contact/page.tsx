import { getSettings } from "@/lib/settings";
import { buildWhatsAppContactLink } from "@/lib/whatsapp";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-5xl px-5 lg:px-8 py-16">
      <Reveal>
        <p className="text-[11px] tracking-widest2 uppercase text-silver-dark mb-2">Get in Touch</p>
        <h1 className="font-display text-3xl md:text-5xl tracking-tight mb-12">{settings.storeName}</h1>
      </Reveal>

      <div className="grid md:grid-cols-2 gap-14">
        <Reveal>
          <div className="space-y-8">
            <div>
              <p className="text-[11px] tracking-widest2 uppercase text-silver-dark mb-2">Email</p>
              <a href={`mailto:${settings.businessEmail}`} className="text-lg hover:text-signal transition-colors">
                {settings.businessEmail}
              </a>
            </div>
            <div>
              <p className="text-[11px] tracking-widest2 uppercase text-silver-dark mb-2">WhatsApp</p>
              <a
                href={buildWhatsAppContactLink(settings.whatsappNumber)}
                target="_blank"
                rel="noreferrer"
                className="text-lg hover:text-signal transition-colors"
              >
                +{settings.whatsappNumber}
              </a>
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <a
                href={buildWhatsAppContactLink(settings.whatsappNumber)}
                target="_blank"
                rel="noreferrer"
                className="text-center border border-ink py-3.5 text-[12px] tracking-widest2 uppercase hover:bg-ink hover:text-paper transition-colors"
              >
                Message on WhatsApp
              </a>
              <a
                href={`mailto:${settings.businessEmail}`}
                className="text-center border border-line-light py-3.5 text-[12px] tracking-widest2 uppercase hover:border-ink transition-colors"
              >
                Send an Email
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <ContactForm businessEmail={settings.businessEmail} />
        </Reveal>
      </div>
    </div>
  );
}
