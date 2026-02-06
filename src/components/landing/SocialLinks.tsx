"use client";

import { motion } from "framer-motion";
import {
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Youtube,
  ExternalLink,
  BookOpen,
} from "lucide-react";

const socialLinks = [
  {
    name: "Twitter/X",
    icon: Twitter,
    url: "#",
    color: "hover:text-blue-400",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "#",
    color: "hover:text-blue-600",
  },
  {
    name: "GitHub",
    icon: Github,
    url: "https://github.com/Nathasan1410/AlterEgo",
    color: "hover:text-gray-400",
  },
  {
    name: "GitBook",
    icon: BookOpen,
    url: "https://nathasan1410.gitbook.io/alter-ego/",
    color: "hover:text-blue-300",
  },
  {
    name: "Instagram",
    icon: Instagram,
    url: "#",
    color: "hover:text-pink-500",
  },
  {
    name: "YouTube",
    icon: Youtube,
    url: "#",
    color: "hover:text-red-600",
  },
];

export default function SocialLinks() {
  return (
    <footer className="border-t border-[#262626] px-4 py-12">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f97316]">
              <ExternalLink className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">AlterEgo</span>
              <p className="text-xs text-[#a3a3a3]">AI-Powered LinkedIn Post Generator</p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#262626] bg-[#171717] text-[#a3a3a3] transition-all hover:border-[#f97316]/50 hover:text-[#f97316]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <social.icon className="h-5 w-5" />
              </motion.a>
            ))}
          </motion.div>

          <motion.p
            className="text-center text-sm text-[#a3a3a3] md:text-right"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            © 2026 AlterEgo. All rights reserved.
            <br />
            <span className="text-xs">Powered by OPIK AI ⭐</span>
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
