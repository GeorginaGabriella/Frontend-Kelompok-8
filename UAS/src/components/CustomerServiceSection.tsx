"use client";

import { FormEvent, useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function CustomerServiceSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (name.trim().length < 2) {
      setStatus("Nama minimal 2 karakter.");
      return;
    }

    if (message.trim().length < 10) {
      setStatus("Pesan minimal 10 karakter.");
      return;
    }

    setStatus(
      "Form berhasil divalidasi. Pengiriman pesan akan diaktifkan setelah backend disambungkan."
    );
  };

  return (
    <section id="customer-service" className="contact-section">
      <div className="contact-container">

        {/* BAGIAN KIRI */}
        <div className="contact-left">

          <div className="contact-label">
            CUSTOMER SERVICE
          </div>

          <h2>
            Talk to our
            <br />
            <span>support team</span>
          </h2>

          <p className="contact-description">
            Jangan ragu untuk menghubungi kami jika
            kamu membutuhkan bantuan mengenai pesanan
            atau memiliki pertanyaan seputar Gado-Gado
            Nusantara.
          </p>

          <div className="contact-info">

            <div className="contact-info-item">
              <div className="contact-icon">
                <Mail size={19} />
              </div>
              <div>
                <strong>Layanan Email</strong>
                <span>Kirim pesan melalui formulir kami</span>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">
                <MapPin size={19} />
              </div>
              <div>
                <strong>Informasi Pesanan</strong>
                <span>Bantuan seputar menu dan pemesanan</span>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">
                <Phone size={19} />
              </div>
              <div>
                <strong>Bantuan Pelanggan</strong>
                <span>Saran, pertanyaan, dan keluhan</span>
              </div>
            </div>

          </div>
        </div>

        {/* BAGIAN KANAN - FORM */}
        <div className="contact-right">

          <form onSubmit={handleSubmit}>

            <label className="contact-field">
              <span>Full Name</span>
              <input
                type="text"
                placeholder="Enter Your Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
              />
            </label>

            <label className="contact-field">
              <span>Email Address</span>
              <input
                type="email"
                placeholder="Enter Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={150}
              />
            </label>

            <label className="contact-field">
              <span>Phone Number</span>
              <input
                type="tel"
                placeholder="Enter Your Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={20}
              />
            </label>

            <label className="contact-field">
              <span>Message</span>
              <textarea
                placeholder="Write Your Message Here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength={10}
                maxLength={1000}
                rows={5}
              />
            </label>

            {status && (
              <div className="contact-status" role="status">
                <CheckCircle2 size={18} />
                <span>{status}</span>
              </div>
            )}

            <button type="submit" className="contact-submit">
              Send Message
              <ArrowRight size={18} />
            </button>

          </form>
        </div>

      </div>
    </section>
  );
}
