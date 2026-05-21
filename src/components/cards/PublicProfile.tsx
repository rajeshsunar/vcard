"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, QrCode, Download, Send } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { generateVCard } from "@/lib/vcard";
import { saveContact } from "@/actions/contacts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function PublicProfile({ card }: { card: any }) {
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSaveContact = () => {
    const vcf = generateVCard(card);
    const blob = new Blob([vcf], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${card.name.replace(" ", "_")}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExchangeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    await saveContact(data, card.userId, card.id);
    
    setLoading(false);
    setExchangeOpen(false);
    
    // Automatically trigger saving the owner's contact as a reward
    setTimeout(() => {
      handleSaveContact();
    }, 500);
  };

  return (
    <div className="relative h-full w-full overflow-y-auto overflow-x-hidden pb-20 scrollbar-hide bg-zinc-50">
      {/* Background Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="h-[250px] w-full"
        style={{ backgroundColor: card.colorHex || "#000" }}
      />

      <div className="px-6 relative z-10 -mt-24 flex flex-col items-center">
        {/* Profile Image */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-36 h-36 bg-white rounded-full p-1.5 shadow-xl mb-5"
        >
          <div className="w-full h-full bg-zinc-100 rounded-full overflow-hidden flex items-center justify-center text-zinc-400 font-medium text-lg">
            {card.avatarUrl ? (
              <img src={card.avatarUrl} alt={card.name} className="w-full h-full object-cover" />
            ) : (
              card.name.charAt(0).toUpperCase()
            )}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center w-full"
        >
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{card.name}</h1>
          {(card.jobTitle || card.company) && (
            <p className="text-zinc-600 font-medium mt-1.5 flex items-center justify-center gap-2 text-lg">
              <Briefcase className="w-4 h-4" />
              {card.jobTitle} {card.company ? `at ${card.company}` : ""}
            </p>
          )}
          
          {card.bio && (
            <p className="mt-6 text-zinc-500 leading-relaxed max-w-sm mx-auto">
              {card.bio}
            </p>
          )}
        </motion.div>

        {/* Buttons */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full mt-10 space-y-4"
        >
          <button 
            onClick={handleSaveContact}
            className="w-full py-4 rounded-2xl text-white font-semibold text-lg shadow-lg flex justify-center items-center gap-2 transition hover:opacity-90"
            style={{ backgroundColor: card.colorHex || "#000" }}
          >
            <Download className="w-5 h-5" />
            Save Contact
          </button>
          
          <Dialog open={exchangeOpen} onOpenChange={setExchangeOpen}>
            <DialogTrigger asChild>
              <button className="w-full py-4 rounded-2xl bg-white border border-zinc-200 text-zinc-800 font-semibold text-lg shadow-sm hover:bg-zinc-50 transition flex justify-center items-center gap-2">
                <Send className="w-5 h-5" />
                Exchange Info
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md mx-4 rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Share your info</DialogTitle>
                <p className="text-zinc-500 text-sm">Share your details with {card.name} and get their contact card.</p>
              </DialogHeader>
              <form onSubmit={handleExchangeSubmit} className="space-y-4 mt-4">
                <div className="grid gap-2">
                  <Label>Name</Label>
                  <Input name="name" required placeholder="Your Name" />
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input name="email" type="email" required placeholder="john@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label>Phone (optional)</Label>
                  <Input name="phone" placeholder="+1 ..." />
                </div>
                <Button type="submit" className="w-full h-12 text-lg rounded-xl" disabled={loading}>
                  {loading ? "Sending..." : "Exchange Details"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <button className="w-full py-4 rounded-2xl bg-zinc-100 text-zinc-800 font-semibold text-lg shadow-sm hover:bg-zinc-200 transition flex justify-center items-center gap-2">
                <QrCode className="w-5 h-5" />
                Show QR Code
              </button>
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center justify-center p-10 mx-4 rounded-3xl w-auto max-w-[360px]">
              <h3 className="text-xl font-bold mb-6">Scan to Connect</h3>
              <div className="p-4 bg-white rounded-2xl shadow-sm border">
                 <QRCodeSVG 
                   value={typeof window !== "undefined" ? window.location.href : `https://vcard.app/${card.slug}`} 
                   size={220} 
                   fgColor={card.colorHex || "#000"} 
                 />
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </div>
  );
}
