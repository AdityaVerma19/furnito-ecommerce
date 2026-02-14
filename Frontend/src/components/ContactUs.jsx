import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';
import { FloatingDecor } from "./FloatingDecor";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../utils/api";

export function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.message || "Unable to send your message.");
      }

      setSubmitStatus({
        type: "success",
        message: payload?.message || "Thanks! Your message has been sent.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: String(error?.message || "Unable to send your message."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      className="relative  w-full overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-blue-950 dark:via-blue-900 dark:to-blue-900"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <FloatingDecor intensity="soft" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-16">
        <div className="relative z-10 text-center mb-8 md:mb-12">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-slate-100">Contact Us</h1>
          <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-xl dark:text-white">
            Have a question or need assistance? We're here to help! Reach out to us and we'll respond as soon as possible.
          </p>
        </div>

        <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <h2 className="mb-4 text-xl font-bold text-gray-900 md:mb-6 md:text-2xl dark:text-slate-100">Get in Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm text-gray-700 md:text-base dark:text-white">Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600 md:px-4 md:text-base dark:border-blue-700 dark:bg-blue-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm text-gray-700 md:text-base dark:text-white">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600 md:px-4 md:text-base dark:border-blue-700 dark:bg-blue-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label htmlFor="subject" className="mb-2 block text-sm text-gray-700 md:text-base dark:text-white">Subject</label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600 md:px-4 md:text-base dark:border-blue-700 dark:bg-blue-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm text-gray-700 md:text-base dark:text-white">Message</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600 md:px-4 md:text-base dark:border-blue-700 dark:bg-blue-900 dark:text-slate-100"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-amber-600 px-4 py-2 text-sm text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-70 md:px-6 md:py-3 md:text-base"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
              {submitStatus.message ? (
                <p
                  className={`text-sm ${
                    submitStatus.type === "success"
                      ? "text-emerald-700 dark:text-emerald-300"
                      : "text-red-600 dark:text-red-300"
                  }`}
                >
                  {submitStatus.message}
                </p>
              ) : null}
            </form>
          </motion.div>

          <div className="space-y-6 md:space-y-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900 md:mb-6 md:text-2xl dark:text-slate-100">Contact Information</h2>
            
            <motion.div
              className="flex items-start space-x-3 md:space-x-4"
              initial={{ opacity: 0, y: 55 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.14 }}
              viewport={{ once: true, amount: 0.25 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="flex-shrink-0 rounded-lg bg-amber-100 p-2 md:p-3 dark:bg-blue-800/70">
                <MapPin className="h-5 w-5 text-amber-700 md:h-6 md:w-6 dark:text-amber-300" />
              </div>
              <div>
                <h3 className="mb-1 text-sm font-semibold text-gray-900 md:text-base dark:text-slate-100">Address</h3>
                <p className="text-xs text-gray-600 md:text-base dark:text-white">WHS Timber Market<br />Kirti Nagar ,New Delhi -110015 </p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start space-x-3 md:space-x-4"
              initial={{ opacity: 0, y: 55 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true, amount: 0.25 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="flex-shrink-0 rounded-lg bg-amber-100 p-2 md:p-3 dark:bg-blue-800/70">
                <Phone className="h-5 w-5 text-amber-700 md:h-6 md:w-6 dark:text-amber-300" />
              </div>
              <div>
                <h3 className="mb-1 text-sm font-semibold text-gray-900 md:text-base dark:text-slate-100">Phone</h3>
                <p className="text-xs text-gray-600 md:text-base dark:text-white">+91 9717650915</p>
                <p className="text-xs text-gray-600 md:text-base dark:text-white">+91 9311571763</p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start space-x-3 md:space-x-4"
              initial={{ opacity: 0, y: 55 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.26 }}
              viewport={{ once: true, amount: 0.25 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="flex-shrink-0 rounded-lg bg-amber-100 p-2 md:p-3 dark:bg-blue-800/70">
                <Mail className="h-5 w-5 text-amber-700 md:h-6 md:w-6 dark:text-amber-300" />
              </div>
              <div>
                <h3 className="mb-1 text-sm font-semibold text-gray-900 md:text-base dark:text-slate-100">Email</h3>
                <p className="text-xs text-gray-600 md:text-base dark:text-white">info@furnito.com</p>
                <p className="text-xs text-gray-600 md:text-base dark:text-white">support@furnito.com</p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start space-x-3 md:space-x-4"
              initial={{ opacity: 0, y: 55 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.32 }}
              viewport={{ once: true, amount: 0.25 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="flex-shrink-0 rounded-lg bg-amber-100 p-2 md:p-3 dark:bg-blue-800/70">
                <Clock className="h-5 w-5 text-amber-700 md:h-6 md:w-6 dark:text-amber-300" />
              </div>
              <div>
                <h3 className="mb-1 text-sm font-semibold text-gray-900 md:text-base dark:text-slate-100">Business Hours</h3>
                <p className="text-xs text-gray-600 md:text-base dark:text-white">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="text-xs text-gray-600 md:text-base dark:text-white">Saturday: 10:00 AM - 4:00 PM</p>
                <p className="text-xs text-gray-600 md:text-base dark:text-white">Sunday: Closed</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
