import { AnimatePresence, motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { site } from "../../content/site";
import { gsap } from "../../lib/gsap";
import { spawnRipple } from "../../lib/utils";
import { useCursor } from "../../store/useCursor";
import { RouteLabel } from "../layout/RouteLabel";

/* -------------------------------------------------------------------------- */
/*  CONFIG                                                                     */
/*  Set ENDPOINT and the form actually POSTs (Formspree / Resend / your API).  */
/*  Leave it empty and it opens a pre-filled mail client instead — still works.*/
/* -------------------------------------------------------------------------- */
const ENDPOINT = ""; // e.g. "https://formspree.io/f/xxxxxxx"

const EASE = [0.16, 1, 0.3, 1];
const MONO = "font-mono text-[11px] uppercase tracking-[0.12em]";
const OK = "#3DD68C";
const ERR = "#FF5A47";

/* -------------------------------------------------------------------------- */
/*  Magnetic                                                                   */
/* -------------------------------------------------------------------------- */

function Magnetic({ children, strength = 0.3, className = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.5 });

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      className={`w-fit ${className}`}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Field — label lifts on focus, hairline wipes uv                            */
/* -------------------------------------------------------------------------- */

function Field({ id, label, type = "text", value, onChange, onFocus, onBlur, error, textarea }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  const Tag = textarea ? "textarea" : "input";

  return (
    <div className="relative pt-7">
      <motion.label
        htmlFor={id}
        className={`${MONO} pointer-events-none absolute left-0 origin-left text-slate`}
        animate={{
          y: active ? 0 : 28,
          scale: active ? 1 : 1.4,
          color: error ? ERR : focused ? "#4F2FF0" : "#6B6F76",
        }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        {label}
      </motion.label>

      <Tag
        id={id}
        name={id}
        type={type}
        rows={textarea ? 4 : undefined}
        maxLength={textarea ? 1000 : 120}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          setFocused(true);
          onFocus?.();
        }}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
        className="w-full resize-none bg-transparent pb-3 pt-2 font-body text-lg outline-none"
      />

      <span className="absolute bottom-0 left-0 h-px w-full bg-current/15" />
      <motion.span
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left"
        style={{ backgroundColor: error ? ERR : "#4F2FF0" }}
        initial={false}
        animate={{ scaleX: focused || error ? 1 : 0 }}
        transition={{ duration: 0.55, ease: EASE }}
      />

      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`${MONO} absolute -bottom-5 left-0`}
            style={{ color: ERR }}
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Console primitives                                                         */
/* -------------------------------------------------------------------------- */

function Line({ n, children, active }) {
  return (
    <div className="relative flex gap-4">
      <span className="w-5 shrink-0 select-none text-right text-bone/25">{n}</span>
      <span className="relative flex-1">
        {active && (
          <motion.span
            layoutId="line-highlight"
            className="absolute -inset-y-1 -left-2 -right-2 border-l-2 border-uv bg-uv/15"
            transition={{ duration: 0.3, ease: EASE }}
          />
        )}
        <span className="relative">{children}</span>
      </span>
    </div>
  );
}

const K = ({ children }) => <span className="text-uv">{children}</span>;
const S = ({ children }) => <span style={{ color: OK }}>{children}</span>;
const P = ({ children }) => <span className="text-bone/35">{children}</span>;

function Caret({ on }) {
  if (!on) return null;
  return (
    <motion.span
      className="ml-px inline-block h-[1em] w-[7px] translate-y-[2px] bg-uv align-baseline"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
    />
  );
}

function Typed({ text }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    setN(0);
    if (!text) return undefined;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) clearInterval(id);
    }, 12);
    return () => clearInterval(id);
  }, [text]);

  return <span>{text.slice(0, n)}</span>;
}

/* -------------------------------------------------------------------------- */
/*  Contact                                                                    */
/* -------------------------------------------------------------------------- */

export function Contact() {
  const sectionRef = useRef(null);
  const consoleRef = useRef(null);
  const inView = useInView(consoleRef, { once: true, margin: "-15%" });

  const setCursor = useCursor((s) => s.setState);
  const resetCursor = useCursor((s) => s.reset);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [focus, setFocus] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | ok | error
  const [latency, setLatency] = useState(0);
  const [resBody, setResBody] = useState("");
  const [shake, setShake] = useState(0);
  const [ts, setTs] = useState(() => Date.now());

  const formRef = useRef(form);
  formRef.current = form;

  useEffect(() => {
    const id = setInterval(() => setTs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const set = (k) => (v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const send = async () => {
    const data = formRef.current;
    if (status === "sending") return;

    const e = {};
    if (data.name.trim().length < 2) e.name = "name: required";
    if (!/^\S+@\S+\.\S+$/.test(data.email)) e.email = "email: invalid";
    if (data.message.trim().length < 10) e.message = "message: too short";

    if (Object.keys(e).length) {
      setErrors(e);
      setStatus("error");
      setLatency(0);
      setResBody(
        `{\n  "ok": false,\n  "errors": [\n${Object.values(e)
          .map((m) => `    "${m}"`)
          .join(",\n")}\n  ]\n}`,
      );
      setShake((s) => s + 1);
      return;
    }

    setStatus("sending");
    setResBody("");
    const t0 = performance.now();

    if (!ENDPOINT) {
      const subject = encodeURIComponent(`Portfolio — ${data.name}`);
      const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      setTimeout(() => {
        setLatency(Math.round(performance.now() - t0));
        setStatus("ok");
        setResBody(`{\n  "ok": true,\n  "handoff": "mail client",\n  "to": "${site.email}"\n}`);
      }, 450);
      return;
    }

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...data, ts: Date.now() }),
      });
      setLatency(Math.round(performance.now() - t0));
      if (!res.ok) throw new Error(String(res.status));

      setStatus("ok");
      setResBody(`{\n  "ok": true,\n  "message": "Received. I'll reply within 12h."\n}`);
      setForm({ name: "", email: "", message: "" });
    } catch {
      setLatency(Math.round(performance.now() - t0));
      setStatus("error");
      setResBody(`{\n  "ok": false,\n  "error": "delivery failed",\n  "fallback": "${site.email}"\n}`);
      setShake((s) => s + 1);
    }
  };

  // ⌘ / Ctrl + Enter to send
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") send();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status]);

  const meta = useMemo(() => {
    if (status === "sending") return { text: "PENDING", color: "#FFAE35" };
    if (status === "ok") return { text: `200 OK · ${latency}ms`, color: OK };
    if (status === "error") return { text: `400 BAD REQUEST · ${latency}ms`, color: ERR };
    return { text: "IDLE", color: "#6B6F76" };
  }, [status, latency]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(document.documentElement, {
        "--scroll-bg": "#E9E6DF",
        "--scroll-fg": "#0F1115",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "top 25%",
          scrub: true,
        },
      });

      gsap.set("[data-mask] > *", { yPercent: 110 });
      gsap.to("[data-mask] > *", {
        yPercent: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative flex min-h-screen flex-col px-6 pb-10 pt-28 md:px-10 md:pt-32"
    >
      <RouteLabel label="/contact" className="text-[#6B6F76]" />

      {/* headline */}
      <header className="mb-16 flex flex-col gap-6 md:mb-24 md:flex-row md:items-end md:justify-between">
        <h2 className="font-display text-[clamp(2.6rem,8vw,7rem)] leading-[0.9] tracking-[-0.035em]">
          {["Let's ship", "something."].map((line) => (
            <span key={line} data-mask className="block overflow-hidden pb-[0.08em]">
              <span className="block">{line}</span>
            </span>
          ))}
        </h2>

        <div data-mask className="overflow-hidden">
          <p className="block max-w-xs font-body text-[#6B6F76]">
            Fill it in and watch the request build itself. ⌘/Ctrl + Enter to send.
          </p>
        </div>
      </header>

      {/* form + console */}
      <div className="grid flex-1 gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        {/* form */}
        <div className="flex flex-col gap-10">
          <Field
            id="name"
            label="Name"
            value={form.name}
            onChange={set("name")}
            onFocus={() => setFocus("name")}
            onBlur={() => setFocus(null)}
            error={errors.name}
          />
          <Field
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={set("email")}
            onFocus={() => setFocus("email")}
            onBlur={() => setFocus(null)}
            error={errors.email}
          />
          <Field
            id="message"
            label="Message"
            textarea
            value={form.message}
            onChange={set("message")}
            onFocus={() => setFocus("message")}
            onBlur={() => setFocus(null)}
            error={errors.message}
          />

          <div className="flex items-center gap-6 pt-3">
            <Magnetic>
              <button
                type="button"
                onClick={(e) => {
                  spawnRipple(e, "rgba(233,230,223,0.35)");
                  send();
                }}
                disabled={status === "sending"}
                onMouseEnter={() => setCursor("hover")}
                onMouseLeave={resetCursor}
                className={`${MONO} btn-shine group relative isolate overflow-hidden border border-current/20 px-9 py-5 outline-none transition-colors duration-300 hover:text-bone focus-visible:ring-2 focus-visible:ring-uv disabled:opacity-50`}
              >
                <span className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-uv transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
                {status === "sending" ? "Sending…" : "Send request"}
              </button>
            </Magnetic>

            <span className={`${MONO} text-[#6B6F76] tabular-nums`}>{form.message.length}/1000</span>
          </div>
        </div>

        {/* console */}
        <motion.div
          ref={consoleRef}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="h-fit lg:sticky lg:top-24"
        >
          <motion.div
            key={shake}
            animate={shake ? { x: [0, -9, 8, -5, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden bg-ink text-bone"
          >
            {/* success scanline */}
            <AnimatePresence>
              {status === "ok" && (
                <motion.span
                  className="pointer-events-none absolute inset-x-0 z-10 h-24 bg-gradient-to-b from-transparent via-uv/30 to-transparent"
                  initial={{ y: "-100%" }}
                  animate={{ y: "600%" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
              )}
            </AnimatePresence>

            {/* top bar */}
            <div className="flex items-center justify-between gap-4 border-b border-bone/10 px-5 py-4">
              <span className={`${MONO} text-bone/50`}>POST /api/contact</span>
              <span className={`${MONO} flex items-center gap-2`} style={{ color: meta.color }}>
                <motion.span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: meta.color }}
                  animate={status === "sending" ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
                  transition={{ duration: 0.8, repeat: status === "sending" ? Infinity : 0 }}
                />
                {meta.text}
              </span>
            </div>

            {/* payload */}
            <pre className="overflow-x-auto px-5 py-6 font-mono text-[12.5px] leading-[2]">
              <Line n={1}>
                <span className="text-bone/50">Content-Type:</span>{" "}
                <span className="text-bone/80">application/json</span>
              </Line>
              <Line n={2}>
                <P>{"{"}</P>
              </Line>
              <Line n={3} active={focus === "name"}>
                {"  "}
                <K>"name"</K>
                <P>: </P>
                <S>"{form.name}</S>
                <Caret on={focus === "name"} />
                <S>"</S>
                <P>,</P>
              </Line>
              <Line n={4} active={focus === "email"}>
                {"  "}
                <K>"email"</K>
                <P>: </P>
                <S>"{form.email}</S>
                <Caret on={focus === "email"} />
                <S>"</S>
                <P>,</P>
              </Line>
              <Line n={5} active={focus === "message"}>
                {"  "}
                <K>"message"</K>
                <P>: </P>
                <S>"{form.message.replace(/\n/g, "\\n")}</S>
                <Caret on={focus === "message"} />
                <S>"</S>
                <P>,</P>
              </Line>
              <Line n={6}>
                {"  "}
                <K>"ts"</K>
                <P>: </P>
                <span className="tabular-nums text-amber">{ts}</span>
              </Line>
              <Line n={7}>
                <P>{"}"}</P>
              </Line>
            </pre>

            {/* response */}
            <AnimatePresence>
              {resBody && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="overflow-hidden border-t border-bone/10"
                >
                  <pre className="px-5 py-6 font-mono text-[12.5px] leading-[2]">
                    <span className={`${MONO} mb-2 block`} style={{ color: meta.color }}>
                      ← response
                    </span>
                    <span style={{ color: status === "ok" ? OK : ERR }}>
                      <Typed text={resBody} />
                    </span>
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}