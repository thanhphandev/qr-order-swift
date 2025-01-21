"use client"

import React, { useEffect } from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { useSettingsStore } from '@/stores/settings-store';
import Image from 'next/image';

const Footer = () => {
  const { settings } = useSettingsStore();

  return (
    <footer className="bg-orange-500 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Thông Tin Liên Hệ</h3>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>{settings.contactInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <span>{settings.contactInfo?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{settings.contactInfo.address}</span>
            </div>
          </div>


          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Kết Nối</h3>
            <div className="flex gap-4">
              <a href={settings?.socialMedia?.facebook || "#"} className="hover:text-orange-200 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              {settings?.socialMedia?.facebook && <a href={settings?.socialMedia?.instagram || "#"} className="hover:text-orange-200 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>}
              <a
                href={settings?.socialMedia?.zalo || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-200 transition-colors"
                aria-label="Zalo"
              >
                <Image
                  className='w-6 h-6'
                  src="/zalo.webp"
                  width={30}
                  height={30}
                  alt="Zalo"
                />
              </a>

            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-orange-400 mt-8 pt-8 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} OpenSwift. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;