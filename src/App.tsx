import { useEffect, useRef, useState } from "react";
import logo from "./assets/logo.png";

const IMG = [
  "https://images.pexels.com/photos/15472682/pexels-photo-15472682.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/11449473/pexels-photo-11449473.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/5577318/pexels-photo-5577318.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/7598545/pexels-photo-7598545.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
];

const NAV = ["Home", "Services", "Stations", "Samples", "FAQ", "Contact"];

const services = [
  { i: "🎙️", t: "Script & Voiceover", d: "Award-winning copywriters and 200+ professional voice talents in 15 languages." },
  { i: "🎚️", t: "Studio Production", d: "Full mixing, sound design, jingles and music licensing in our broadcast studios." },
  { i: "📡", t: "Media Buying", d: "Negotiated rates across 300+ AM/FM, digital and podcast stations nationwide." },
  { i: "📊", t: "Campaign Analytics", d: "Reach, frequency and attribution reports with call tracking and promo codes." },
  { i: "🎯", t: "Audience Targeting", d: "Pinpoint listeners by region, daypart, format and demographic profile." },
  { i: "🎧", t: "Podcast & Streaming", d: "Extend reach on Spotify, iHeart, and top podcasts with dynamic ad insertion." },
];

const stations = [
  { n: "Hits 101.5 FM", f: "Pop", c: "New York", r: "2.4M", cpm: 14 },
  { n: "Rock 98.7", f: "Rock", c: "Los Angeles", r: "1.8M", cpm: 12 },
  { n: "NewsTalk 880 AM", f: "News", c: "Chicago", r: "1.2M", cpm: 16 },
  { n: "Smooth Jazz 94.3", f: "Jazz", c: "Miami", r: "650K", cpm: 10 },
  { n: "Country 105", f: "Country", c: "Dallas", r: "1.5M", cpm: 11 },
  { n: "Sports Radio 1050", f: "Sports", c: "Boston", r: "900K", cpm: 15 },
  { n: "Urban 92.1", f: "Pop", c: "Atlanta", r: "1.1M", cpm: 12 },
  { n: "Classic Rock 102", f: "Rock", c: "Seattle", r: "780K", cpm: 10 },
];

const samples = [
  { t: "Sunny Auto Dealership", len: "30s", cat: "Automotive", notes: [523, 659, 784, 1046] },
  { t: "Fresh Bites Restaurant", len: "15s", cat: "Food", notes: [440, 554, 659, 880] },
  { t: "CityBank Savings", len: "60s", cat: "Finance", notes: [392, 494, 587, 784] },
  { t: "Summer Music Festival", len: "30s", cat: "Events", notes: [659, 784, 988, 1318] },
];

const faqs = [
  { q: "How much does radio advertising cost?", a: "Costs depend on market, station and daypart. Local campaigns start around $999/month — contact us for a free custom quote." },
  { q: "How long does production take?", a: "Most spots are scripted, voiced and mixed within 3–5 business days, with rush 48-hour delivery available." },
  { q: "Can I approve the script and voice?", a: "Absolutely. You'll receive script drafts and voice auditions, and get two free revision rounds on the final mix." },
  { q: "How do I measure results?", a: "We use unique phone numbers, URLs, promo codes and web-lift analysis to attribute response to your campaign." },
  { q: "What ad lengths are available?", a: "Standard lengths are 15, 30 and 60 seconds. We also produce live reads and sponsorship mentions." },
];

function useTone() {
  const ctx = useRef<AudioContext | null>(null);
  const timer = useRef<number | null>(null);
  const stop = () => {
    if (timer.current) clearTimeout(timer.current);
    ctx.current?.close();
    ctx.current = null;
  };
  const play = (notes: number[], onEnd: () => void) => {
    stop();
    const c = new AudioContext();
    ctx.current = c;
    for (let r = 0; r < 3; r++)
      notes.forEach((f, i) => {
        const o = c.createOscillator(), g = c.createGain();
        o.type = "triangle";
        o.frequency.value = f;
        const t = c.currentTime + (r * notes.length + i) * 0.3;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.2, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
        o.connect(g).connect(c.destination);
        o.start(t); o.stop(t + 0.3);
      });
    timer.current = window.setTimeout(() => { stop(); onEnd(); }, notes.length * 3 * 300);
  };
  return { play, stop };
}

function Wave({ on }: { on: boolean }) {
  return (
    <div className="flex items-end gap-1 h-8">
      {Array.from({ length: 16 }).map((_, i) => (
        <span key={i} className={`w-1 rounded bg-amber-400 ${on ? "animate-bar" : ""}`}
          style={{ height: on ? undefined : `${20 + ((i * 37) % 60)}%`, animationDelay: `${i * 0.07}s` }} />
      ))}
    </div>
  );
}

// 3D motion image with tilt on hover + floating
function MotionImg({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((e.clientY - r.top) / r.height - 0.5) * 18;
    const y = ((e.clientX - r.left) / r.width - 0.5) * -18;
    setTilt({ x, y });
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className={`relative ${className}`}
      style={{ perspective: 1000 }}
    >
      <div
        className="transition-transform duration-200 ease-out will-change-transform"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(20px)` }}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover rounded-3xl shadow-2xl animate-float" draggable={false} />
        <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.25), transparent 40%, rgba(0,0,0,0.15))" }} />
      </div>
    </div>
  );
}

export default function App() {
  const [white, setWhite] = useState(true); // Option B = white theme (default)
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState("All");
  const [playing, setPlaying] = useState<number | null>(null);
  const [faq, setFaq] = useState<number | null>(0);
  const [form, setForm] = useState({ name: "", email: "", company: "", budget: "", msg: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState("");
  const tone = useTone();

  useEffect(() => () => tone.stop(), []);

  const formats = ["All", ...Array.from(new Set(stations.map((s) => s.f)))];
  const shown = filter === "All" ? stations : stations.filter((s) => s.f === filter);

  const togglePlay = (i: number) => {
    if (playing === i) { tone.stop(); setPlaying(null); return; }
    setPlaying(i);
    tone.play(samples[i].notes, () => setPlaying(null));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!form.name.trim()) er.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = "Valid email required";
    if (!form.msg.trim()) er.msg = "Tell us about your campaign";
    setErrors(er);
    if (Object.keys(er).length) return;
    setSent(true);
    setForm({ name: "", email: "", company: "", budget: "", msg: "" });
  };

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000); };
  const go = (id: string) => {
    setMenu(false);
    if (id.toLowerCase() === "home") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  };

  // theme tokens
  const W = white;
  const page = W ? "bg-white text-slate-800" : "bg-slate-950 text-white";
  const header = W ? "bg-white/90 text-slate-900 border-b border-slate-200" : "bg-slate-950/90 text-white";
  const muted = W ? "text-slate-500" : "text-slate-400";
  const card = W ? "bg-white border-slate-200" : "bg-slate-900 border-slate-800";
  const sectionAlt = W ? "bg-slate-50" : "bg-slate-900";
  const darkSection = W ? "bg-slate-100 text-slate-900" : "bg-slate-950 text-white";
  const heroOverlay = W ? "bg-gradient-to-r from-white via-white/85 to-white/20" : "bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/30";
  const heroText = W ? "text-slate-900" : "text-white";
  const heroSub = W ? "text-slate-600" : "text-slate-300";
  const btnPrimary = "bg-amber-400 text-slate-900 font-bold hover:bg-amber-300";
  const btnGhost = W ? "border border-slate-300 text-slate-900 hover:bg-slate-100" : "border border-white/40 text-white hover:bg-white/10";

  const H = ({ k, t, s }: { k: string; t: string; s: string }) => (
    <div className="text-center max-w-2xl mx-auto mb-12">
      <p className="text-amber-500 font-semibold uppercase tracking-widest text-sm">{k}</p>
      <h2 className="text-3xl md:text-4xl font-extrabold mt-2">{t}</h2>
      <p className={`${muted} mt-3`}>{s}</p>
    </div>
  );

  return (
    <div className={`font-sans min-h-screen ${page}`}>
      <header className={`fixed inset-x-0 top-0 z-50 backdrop-blur ${header}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 font-extrabold text-lg">
            <img src={logo} alt="Radio Advertisement logo" className="h-14 w-auto max-w-[260px] object-contain" />
            Radio<span className="text-amber-400">Advertisement</span>
          </button>
          <nav className="hidden lg:flex gap-6 text-sm">
            {NAV.map((n) => <button key={n} onClick={() => go(n)} className="hover:text-amber-400">{n}</button>)}
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => setWhite(!white)} className={`text-xs font-bold px-3 py-2 rounded-full border ${W ? "border-slate-300 hover:bg-slate-100" : "border-white/30 hover:bg-white/10"}`} aria-label="toggle theme">
              {W ? "Option A: Dark" : "Option B: White"}
            </button>
            <button onClick={() => go("Contact")} className={`hidden lg:block px-4 py-2 rounded-full ${btnPrimary}`}>Get a Quote</button>
            <button className="lg:hidden text-2xl" onClick={() => setMenu(!menu)} aria-label="menu">{menu ? "✕" : "☰"}</button>
          </div>
        </div>
        {menu && (
          <div className={`lg:hidden px-4 pb-4 flex flex-col gap-3 ${W ? "bg-white" : "bg-slate-950"}`}>
            {NAV.map((n) => <button key={n} onClick={() => go(n)} className="text-left py-1 hover:text-amber-400">{n}</button>)}
          </div>
        )}
      </header>

      {/* Hero / Home */}
      <section id="home" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <img src={IMG[0]} alt="Studio microphone" className="absolute inset-0 w-full h-full object-cover" />
        <div className={`absolute inset-0 ${heroOverlay}`} />
        <div className="relative max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">
          <div className={heroText}>
            <span className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold"><span className="w-2 h-2 rounded-full bg-white animate-pulse" /> ON AIR NOW</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mt-5 leading-tight">Make Your Brand <span className="text-amber-400">Heard</span> by Millions</h1>
            <p className={`mt-5 text-lg max-w-xl ${heroSub}`}>Full-service radio advertising — from script and voiceover to media buying on 300+ stations, with results you can measure.</p>
            <div className="flex flex-wrap gap-4 mt-8">
              <button onClick={() => go("Contact")} className={`px-6 py-3 rounded-full ${btnPrimary}`}>Start Your Campaign</button>
              <button onClick={() => go("Samples")} className={`px-6 py-3 rounded-full ${btnGhost}`}>▶ Hear Samples</button>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-12 max-w-md">
              {[["300+", "Stations"], ["92%", "Weekly reach"], ["5K+", "Ads aired"]].map(([a, b]) => (
                <div key={b}><p className="text-3xl font-extrabold text-amber-400">{a}</p><p className={`text-sm ${heroSub}`}>{b}</p></div>
              ))}
            </div>
          </div>
          <div className={`hidden lg:block backdrop-blur rounded-3xl p-6 border ${W ? "bg-white/70 border-slate-200" : "bg-white/10 border-white/10"}`}>
            <p className={`text-sm ${muted}`}>Now playing</p>
            <p className="text-xl font-bold">Hits 101.5 FM — Prime Drive Time</p>
            <div className="my-6"><Wave on /></div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className={`rounded-xl p-3 ${W ? "bg-slate-100" : "bg-white/10"}`}>Listeners<br /><b className="text-2xl">248,912</b></div>
              <div className={`rounded-xl p-3 ${W ? "bg-slate-100" : "bg-white/10"}`}>Calls today<br /><b className="text-2xl text-amber-400">1,204</b></div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos */}
      <div className={`${W ? "bg-slate-100" : "bg-slate-900"} py-6 text-center font-bold tracking-widest text-sm flex flex-wrap justify-center gap-8 px-4 ${muted}`}>
        {["SUNNY AUTO", "CITYBANK", "FRESH BITES", "NOVA TECH", "GREENMART", "PULSE FIT"].map((l) => <span key={l}>{l}</span>)}
      </div>

      <section id="services" className="py-20 px-4 max-w-7xl mx-auto">
        <H k="What we do" t="End-to-End Radio Advertising" s="Everything you need to plan, produce and air high-performing radio campaigns." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.t} className={`p-6 rounded-2xl border hover:shadow-xl hover:-translate-y-1 transition ${card}`}>
              <div className="text-4xl">{s.i}</div>
              <h3 className="font-bold text-xl mt-4">{s.t}</h3>
              <p className={`${muted} mt-2`}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About / process */}
      <section className={`py-20 px-4 ${sectionAlt}`}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <MotionImg src={IMG[3]} alt="Radio hosts" className="h-80 md:h-[28rem]" />
          <div>
            <p className="text-amber-500 font-semibold uppercase tracking-widest text-sm">How it works</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2">From Idea to On-Air in 4 Steps</h2>
            <div className="mt-8 space-y-6">
              {[["Discover", "We learn your goals, audience and budget."], ["Create", "Scripts, voices and music crafted for your brand."], ["Broadcast", "Strategic placement on the right stations and dayparts."], ["Measure", "Live reporting and optimization to maximize ROI."]].map(([t, d], i) => (
                <div key={t} className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-amber-400 font-bold grid place-items-center text-slate-900">{i + 1}</div>
                  <div><h4 className="font-bold">{t}</h4><p className={muted}>{d}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="stations" className="py-20 px-4 max-w-7xl mx-auto">
        <H k="Our network" t="Featured Stations" s="Filter by format to find the right audience for your message." />
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {formats.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-semibold ${filter === f ? "bg-slate-900 text-white" : (W ? "bg-slate-100 hover:bg-slate-200" : "bg-slate-800 hover:bg-slate-700")}`}>{f}</button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {shown.map((s) => (
            <div key={s.n} className="rounded-2xl p-5 bg-gradient-to-br from-slate-900 to-slate-700 text-white">
              <div className="flex justify-between text-xs"><span className="bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full font-bold">{s.f}</span><span>📍 {s.c}</span></div>
              <h3 className="font-bold text-lg mt-4">{s.n}</h3>
              <p className="text-sm text-slate-300 mt-1">Weekly reach: <b className="text-white">{s.r}</b></p>
              <p className="text-sm text-slate-300">From <b className="text-amber-400">${s.cpm} CPM</b></p>
              <button onClick={() => flash(`${s.n} added to your media plan`)} className="mt-4 w-full text-sm border border-white/30 rounded-lg py-2 hover:bg-white/10">+ Add to plan</button>
            </div>
          ))}
        </div>
      </section>

      <section id="samples" className={`py-20 px-4 ${darkSection}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-amber-400 font-semibold uppercase tracking-widest text-sm">Portfolio</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2">Listen to Our Work</h2>
            <p className={`${W ? "text-slate-600" : "text-slate-400"} mt-3`}>Tap play to hear jingle previews from recent campaigns.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {samples.map((s, i) => (
              <div key={s.t} className={`flex items-center gap-4 p-5 rounded-2xl border ${playing === i ? "border-amber-400 bg-amber-400/10" : (W ? "border-slate-200 bg-white" : "border-white/10 bg-white/5")}`}>
                <button onClick={() => togglePlay(i)} className="w-14 h-14 shrink-0 rounded-full bg-amber-400 text-slate-900 text-xl font-bold hover:scale-105 transition" aria-label="play">{playing === i ? "❚❚" : "▶"}</button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">{s.t}</h3>
                  <p className={`text-sm ${muted}`}>{s.cat} · {s.len}</p>
                </div>
                <Wave on={playing === i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 px-4 max-w-3xl mx-auto">
        <H k="FAQ" t="Frequently Asked Questions" s="Everything you need to know before going on air." />
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className={`border rounded-xl overflow-hidden ${card}`}>
              <button onClick={() => setFaq(faq === i ? null : i)} className="w-full flex justify-between items-center p-5 text-left font-semibold">
                {f.q}<span className="text-amber-500 text-xl">{faq === i ? "−" : "+"}</span>
              </button>
              {faq === i && <p className={`px-5 pb-5 ${muted}`}>{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className={`py-20 px-4 ${sectionAlt}`}>
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <p className="text-amber-500 font-semibold uppercase tracking-widest text-sm">Contact</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2">Let's Get You On Air</h2>
            <p className={`${muted} mt-3`}>Tell us about your goals and we'll send a free custom media plan within 24 hours.</p>
            <MotionImg src={IMG[2]} alt="Microphone" className="mt-6 h-48" />
            <div className={`mt-8 space-y-3 ${muted}`}>
              <p className="font-semibold">📞 Call us:</p>
              <p><a href="tel:+918884014055" className="hover:text-amber-400 font-semibold">+91 88840 14055</a></p>
              <p><a href="tel:+919972770266" className="hover:text-amber-400 font-semibold">+91 99727 70266</a></p>
              <p><a href="tel:+916361842299" className="hover:text-amber-400 font-semibold">+91 63618 42299</a></p>
              <p className="pt-2">✉️ <a href="mailto:tech@kaalamithra-ai.com" className="hover:text-amber-400">tech@kaalamithra-ai.com</a></p><p>📍 Samruddhi Archade 2nd floor Prashanthnagara, Devarayapattana, main road, Batawadi, Tumakur, Karnataka 572104, India</p>
            </div>
          </div>
          <div className={`lg:col-span-3 rounded-3xl p-6 md:p-10 shadow-xl ${W ? "bg-white" : "bg-slate-800"}`}>
            {sent ? (
              <div className="text-center py-16">
                <div className="text-6xl">🎉</div>
                <h3 className="text-2xl font-bold mt-4">Thank you!</h3>
                <p className={`${muted} mt-2`}>Our team will contact you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="mt-6 text-amber-600 font-semibold">Send another request</button>
              </div>
            ) : (
              <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4" noValidate>
                {([["name", "Full name *"], ["email", "Email *"], ["company", "Company"], ["budget", "Budget / Plan"]] as const).map(([k, l]) => (
                  <div key={k}>
                    <input placeholder={l} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-amber-400 ${errors[k] ? "border-red-500" : ""} ${W ? "bg-white" : "bg-slate-700 text-white"}`} />
                    {errors[k] && <p className="text-red-500 text-xs mt-1">{errors[k]}</p>}
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <textarea rows={5} placeholder="Tell us about your campaign *" value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-amber-400 ${errors.msg ? "border-red-500" : ""} ${W ? "bg-white" : "bg-slate-700 text-white"}`} />
                  {errors.msg && <p className="text-red-500 text-xs mt-1">{errors.msg}</p>}
                </div>
                <button className={`sm:col-span-2 py-3 rounded-full font-bold ${btnPrimary}`}>Request Free Media Plan</button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className={`${W ? "bg-slate-100 text-slate-600" : "bg-slate-950 text-slate-400"} px-4 pt-16 pb-8`}>
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <p className={`font-extrabold text-lg ${W ? "text-slate-900" : "text-white"}`}><img src={logo} alt="Radio Advertisement logo" className="h-14 w-auto max-w-[280px] object-contain mb-2" /><br />Radio<span className="text-amber-400">Advertisement</span></p>
            <p className="mt-3 text-sm">Helping brands reach millions of listeners since 2008.</p>
          </div>
          <div><p className={`font-bold mb-3 ${W ? "text-slate-900" : "text-white"}`}>Quick links</p>{NAV.slice(0, 4).map((n) => <button key={n} onClick={() => go(n)} className="block text-sm py-1 hover:text-amber-400">{n}</button>)}</div>
          <div><p className={`font-bold mb-3 ${W ? "text-slate-900" : "text-white"}`}>Resources</p>{NAV.slice(4).map((n) => <button key={n} onClick={() => go(n)} className="block text-sm py-1 hover:text-amber-400">{n}</button>)}</div>
          <div>
            <p className={`font-bold mb-3 ${W ? "text-slate-900" : "text-white"}`}>Newsletter</p>
            <form onSubmit={(e) => { e.preventDefault(); const i = (e.currentTarget.elements[0] as HTMLInputElement); if (/^\S+@\S+\.\S+$/.test(i.value)) { flash("Subscribed! Thanks for joining."); i.value = ""; } else flash("Please enter a valid email."); }} className="flex">
              <input placeholder="Your email" className={`flex-1 min-w-0 rounded-l-lg px-3 py-2 outline-none ${W ? "bg-white border" : "bg-slate-800 text-white"}`} />
              <button className="bg-amber-400 text-slate-900 font-bold px-4 rounded-r-lg">Join</button>
            </form>
          </div>
        </div>
        <p className="text-center text-sm mt-12 border-t border-slate-300/30 pt-6">© {new Date().getFullYear()} Radio Advertisement. All rights reserved.</p>
      </footer>

      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-full shadow-xl">{toast}</div>}

      {/* Floating contact buttons — left side */}
      <div className="fixed left-4 bottom-6 z-50 flex flex-col gap-3">
        <a
          href="https://wa.me/916361842299?text=Hi!%20I%20want%20to%20advertise%20on%20radio."
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
          className="w-14 h-14 grid place-items-center rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 transition-transform"
        >
          <svg viewBox="0 0 32 32" className="w-7 h-7 fill-current"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.6 2 6.5L4 29l7.7-2c1.8 1 3.9 1.5 6.1 1.5h.2c6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.9 0-3.7-.5-5.3-1.5l-.4-.2-4.6 1.2 1.2-4.5-.3-.4c-1-1.6-1.6-3.5-1.6-5.4 0-5.4 4.4-9.8 9.9-9.8 2.6 0 5.1 1 6.9 2.9 1.9 1.9 2.9 4.3 2.9 6.9 0 5.4-4.5 9.8-9.7 9.8zm5.4-7.3c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5L13.2 9c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.2-.9.7-.3.5-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.2.2 2.4 3.7 5.8 5.2.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.2.7-.1 2-1 2.3-2 .3-1 .3-1.9.2-2-.1-.2-.4-.2-.7-.4z" /></svg>
        </a>
        <a
          href="tel:+916361842299"
          aria-label="Call us"
          title="Call +91 63618 42299"
          className="w-14 h-14 grid place-items-center rounded-full bg-amber-400 text-slate-900 shadow-2xl hover:scale-110 transition-transform"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" /></svg>
        </a>
      </div>
    </div>
  );
}
