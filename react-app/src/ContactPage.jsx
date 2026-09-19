import { useState } from 'react';
import SiteHeader from './SiteHeader.jsx';
import SiteFooter from './SiteFooter.jsx';
import { Reveal } from './reveal.jsx';
import { supabaseEnabled, submitContactMessage } from './lib/contactApi.js';

export default function ContactPage({ ctx }) {
  const { theme } = ctx;
  const themeClass = theme === 'dark' ? 'dark-mode' : '';

  return (
    <div className={`landing-scope ${themeClass}`} style={{ background: 'var(--surface-page)', minHeight: '100vh' }}>
      <SiteHeader ctx={ctx} active="contact" />

      <section style={{ padding: '64px 0 96px' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '.9fr 1.1fr', gap: 64, alignItems: 'flex-start' }}>
          <Reveal>
            <p className="eyebrow">Liên hệ</p>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 38, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 10, textWrap: 'balance' }}>Có câu hỏi hoặc muốn đặt bàn?</h1>
            <p style={{ marginTop: 14, fontSize: 'var(--fs-body-lg)', lineHeight: 1.65, color: 'var(--text-muted)' }}>Gửi cho chúng tôi, đội ngũ chi nhánh sẽ liên hệ lại trong ngày làm việc.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 32 }}>
              <ContactInfo icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" /></svg>} label="Hotline" value="1900 6088" />
              <ContactInfo icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" /></svg>} label="Email" value="hello@duyenphan.vn" />
              <ContactInfo icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></svg>} label="Mạng xã hội" value="@duyenphan.official" />
            </div>
          </Reveal>
          <Reveal delay={.1}>
            <ContactForm ctx={ctx} />
          </Reveal>
        </div>
      </section>

      <SiteFooter ctx={ctx} />
    </div>
  );
}

function ContactInfo({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{ width: 40, height: 40, flex: '0 0 auto', borderRadius: '50%', background: 'var(--surface-card)', color: 'var(--brand)', display: 'grid', placeItems: 'center', boxShadow: 'var(--shadow-card)' }}>{icon}</span>
      <span>
        <span style={{ display: 'block', fontSize: 'var(--fs-caption)', color: 'var(--text-subtle)' }}>{label}</span>
        <span style={{ display: 'block', fontSize: 15, fontWeight: 600 }}>{value}</span>
      </span>
    </div>
  );
}

function ContactForm({ ctx }) {
  const { flash } = ctx;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const errs = {};
    if (!name.trim()) errs.name = 'Nhập họ tên';
    if (!phone.trim() && !email.trim()) errs.phone = 'Nhập số điện thoại hoặc email để liên hệ lại';
    if (!message.trim()) errs.message = 'Nhập nội dung';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!supabaseEnabled) { setErrors({ message: 'Chưa cấu hình Supabase — không thể gửi lúc này.' }); return; }

    setErrors({});
    setSending(true);
    try {
      await submitContactMessage({ name: name.trim(), phone: phone.trim(), email: email.trim(), message: message.trim() });
      setSent(true);
      setName(''); setPhone(''); setEmail(''); setMessage('');
      flash('Đã gửi liên hệ, cảm ơn bạn.');
    } catch (err) {
      console.error('[Supabase] Gửi liên hệ thất bại:', err);
      setErrors({ message: 'Không gửi được, vui lòng thử lại.' });
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="panel" style={{ padding: 32, textAlign: 'center' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: '50%', background: 'var(--surface-brand-soft)', color: 'var(--brand)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </span>
        <h3 style={{ marginTop: 16, fontSize: 19, fontWeight: 600 }}>Đã nhận được tin nhắn của bạn</h3>
        <p style={{ marginTop: 8, fontSize: 14, color: 'var(--text-muted)' }}>Chúng tôi sẽ liên hệ lại trong ngày làm việc.</p>
        <button type="button" className="btn btn-secondary btn-md" style={{ marginTop: 20 }} onClick={() => setSent(false)}>Gửi tin nhắn khác</button>
      </div>
    );
  }

  const borderFor = k => (errors[k] ? 'var(--danger)' : 'var(--border-strong)');
  return (
    <form onSubmit={submit} className="panel" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <label className="field-wrap" style={{ flex: '1 1 200px' }}>
          <label>Họ và tên</label>
          <span className="field" style={{ borderColor: borderFor('name') }}><input value={name} onChange={e => setName(e.target.value)} placeholder="Nguyễn Thị An" /></span>
          {errors.name && <span className="err-msg">{errors.name}</span>}
        </label>
        <label className="field-wrap" style={{ flex: '1 1 160px' }}>
          <label>Số điện thoại</label>
          <span className="field" style={{ borderColor: borderFor('phone') }}><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="09xx xxx xxx" /></span>
        </label>
      </div>
      <label className="field-wrap">
        <label>Email (không bắt buộc)</label>
        <span className="field"><input value={email} onChange={e => setEmail(e.target.value)} placeholder="ten@gmail.com" /></span>
      </label>
      <label className="field-wrap">
        <label>Nội dung</label>
        <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)} placeholder="Bạn muốn đặt bàn, góp ý hay hỏi điều gì?"
          style={{ width: '100%', resize: 'vertical', padding: '10px 12px', borderRadius: 'var(--radius-control)', border: `1px solid ${borderFor('message')}`, fontFamily: 'var(--font-ui)', fontSize: 'var(--fs-body-sm)', color: 'var(--text-body)', background: 'var(--surface-card)' }} />
        {errors.message && <span className="err-msg">{errors.message}</span>}
      </label>
      {errors.phone && !errors.name && <span className="err-msg" style={{ marginTop: -8 }}>{errors.phone}</span>}
      <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={sending}>{sending ? 'Đang gửi…' : 'Gửi liên hệ'}</button>
    </form>
  );
}
