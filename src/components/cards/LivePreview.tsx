"use client";

import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

export function LivePreview({ data }: { data: any }) {
  return (
    <div className="w-[320px] h-[640px] rounded-[2.5rem] border-[8px] border-zinc-900 bg-zinc-50 overflow-hidden relative shadow-2xl shrink-0">
      {/* Phone Notch */}
      <div className="absolute top-0 inset-x-0 h-6 bg-zinc-900 rounded-b-3xl w-40 mx-auto z-50"></div>

      {/* Dynamic Header Background */}
      <motion.div 
        className="h-40 w-full" 
        style={{ backgroundColor: data.colorHex || "#000" }}
        animate={{ backgroundColor: data.colorHex || "#000" }}
      />

      {/* Profile Content */}
      <div className="px-6 pb-6 relative z-10 -mt-16 text-center flex flex-col items-center">
        {/* Avatar */}
        <div className="w-28 h-28 bg-white rounded-full p-1 shadow-lg mb-4">
          <div className="w-full h-full bg-zinc-200 rounded-full overflow-hidden flex items-center justify-center text-zinc-500 font-medium">
            {data.avatarUrl ? (
              <img src={data.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              "No Image"
            )}
          </div>
        </div>

        {/* Text Details */}
        <h2 className="text-2xl font-bold text-zinc-900 truncate w-full">
          {data.name || "Your Name"}
        </h2>
        
        {(data.jobTitle || data.company) && (
          <p className="text-zinc-600 font-medium mt-1 truncate w-full flex items-center justify-center gap-1.5">
            <Briefcase className="w-4 h-4" />
            {data.jobTitle} {data.company ? `@ ${data.company}` : ""}
          </p>
        )}

        {data.bio && (
          <p className="text-zinc-500 text-sm mt-4 line-clamp-3">
            {data.bio}
          </p>
        )}

        {/* Action Buttons */}
        <div className="w-full mt-6 space-y-3">
          <motion.button 
            className="w-full py-3.5 rounded-2xl text-white font-medium shadow-md"
            style={{ backgroundColor: data.colorHex || "#000" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Save Contact
          </motion.button>
          <button className="w-full py-3.5 rounded-2xl bg-white border border-zinc-200 text-zinc-800 font-medium shadow-sm hover:bg-zinc-50 transition">
            Exchange Info
          </button>
        </div>
      </div>
    </div>
  );
}
