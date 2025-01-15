import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-orange-500 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Thông Tin Liên Hệ</h3>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>0123 456 789</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <span>thanhphanvan1610@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Mỹ Xuyên, thành phố Long Xuyên, An Giang</span>
            </div>
          </div>


          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Kết Nối</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-orange-200 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-orange-200 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-orange-200 transition-colors">
                <Twitter className="w-6 h-6" />
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