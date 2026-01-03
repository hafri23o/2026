import { Show, createSignal, onMount } from 'solid-js';
import { Scaffold } from '~/components/scaffold/scaffold';

// ---------- DPO ENV VARS ----------
const DPO_SUBSCRIBE_LINK = import.meta.env.VITE_DPO_SUBSCRIBE_LINK; // e.g. "https://secure.3gdirectpay.com/payv2.asp?ID=..."
const DPO_DONATE_LINK    = import.meta.env.VITE_DPO_DONATE_LINK;    // e.g. "https://secure.3gdirectpay.com/payv2.asp?ID=..."

export default function SettingsPage() {
  const [statusMsg, setStatusMsg] = createSignal<string>("");

  // Optional: show a thank-you if you send users back with ?success=1 or ?canceled=1
  onMount(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get('success')) setStatusMsg("🎉 Thank you for your support!");
    if (q.get('canceled')) setStatusMsg("Payment canceled. You can try again anytime.");
  });

  const hasPaymentLinks = Boolean(DPO_SUBSCRIBE_LINK || DPO_DONATE_LINK);

  return (
    <Scaffold title="Settings">
      <div style={{
        padding: '20px',
        display: 'grid',
        gap: '16px',
        'grid-template-columns': '1fr',
        'max-width': '520px',
        margin: 'auto'
      }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
          Support this project
        </h1>
        <p style={{ color: '#6b6b6b', marginTop: '-6px' }}>
          Choose a subscription or make a one-time donation. It keeps the music online ♥
        </p>

        <Show when={statusMsg()}>
          <div style={{
            padding: '12px 14px',
            background: '#eef8ee',
            color: '#145a32',
            borderRadius: '12px'
          }}>
            {statusMsg()}
          </div>
        </Show>

        {/* SUBSCRIBE (Weekly) */}
        <PaymentCard
          title="Subscribe (weekly)"
          desc="Recommended for first-time try-outs."
          link={DPO_SUBSCRIBE_LINK}
          buttonText="SUBSCRIBE"
        />

        {/* SUBSCRIBE (Monthly) */}
        <PaymentCard
          title="Subscribe (monthly)"
          desc="Unlock HD streaming and help us grow."
          link={DPO_SUBSCRIBE_LINK}
          buttonText="SUBSCRIBE"
        />

        {/* DONATE */}
        <PaymentCard
          title="Donate (one-time)"
          desc="A quick tip keeps the servers alive. Thank you!"
          link={DPO_DONATE_LINK}
          buttonText="DONATE"
        />

        {/* If nothing configured */}
        <Show when={!hasPaymentLinks}>
          <div style={{
            padding: '12px 14px',
            background: '#fff7e6',
            color: '#6b3e00',
            borderRadius: '12px',
            border: '1px solid #ffe2b3'
          }}>
            No DPO links found. Add env vars VITE_DPO_SUBSCRIBE_LINK / VITE_DPO_DONATE_LINK.
          </div>
        </Show>
      </div>
    </Scaffold>
  );
}

interface PaymentCardProps {
  title: string;
  desc: string;
  link?: string;
  buttonText: string;
}

function PaymentCard(props: PaymentCardProps) {
  return (
    <section style={{
      background: '#fbf7ff',
      padding: '18px',
      borderRadius: '16px',
      border: '1px solid #efe6ff',
      display: 'grid',
      gap: '10px'
    }}>
      <h2 style={{ fontSize: '18px', margin: 0 }}>{props.title}</h2>
      <p style={{ color: '#5b5b5b', margin: 0 }}>{props.desc}</p>

      <Show when={props.link}>
        <a
          href={props.link!}
          style={buttonStyle()}
          target="_blank"
          rel="noopener noreferrer"
        >
          {props.buttonText}
        </a>
      </Show>
    </section>
  );
}

function buttonStyle(): any {
  return {
    display: 'inline-block',
    padding: '12px 18px',
    borderRadius: '9999px',
    fontWeight: 700,
    textDecoration: 'none',
    background: '#6d57c7',
    color: 'white',
    textAlign: 'center',
    boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
  };
}
