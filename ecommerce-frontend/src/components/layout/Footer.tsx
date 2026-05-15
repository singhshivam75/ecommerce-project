"use client";

import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import {
    Mail,
    MapPin,
    Phone,
} from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-gray-900 to-black text-white mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">

                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2.5 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-300 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">🛍️</span>
                            </div>
                            <span className="text-2xl font-bold">ShopHub</span>
                        </div>

                        <p className="text-gray-400 mb-6 leading-relaxed max-w-sm">
                            Your trusted destination for premium products. We bring you quality,
                            style, and value in every purchase.
                        </p>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-400">
                                <Mail className="w-5 h-5 text-primary" />
                                <span>support@shophub.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                                <Phone className="w-5 h-5 text-primary" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                                <MapPin className="w-5 h-5 text-primary" />
                                <span>123 Commerce St, NY 10001</span>
                            </div>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Shop</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/products" className="footer-link">
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=electronics" className="footer-link">
                                    Electronics
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=fashion" className="footer-link">
                                    Fashion
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=sports" className="footer-link">
                                    Sports
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Customer Care</h4>
                        <ul className="space-y-3">
                            <li><Link href="#" className="footer-link">Contact Us</Link></li>
                            <li><Link href="#" className="footer-link">Shipping Policy</Link></li>
                            <li><Link href="#" className="footer-link">Returns & Exchanges</Link></li>
                            <li><Link href="#" className="footer-link">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Company</h4>
                        <ul className="space-y-3">
                            <li><Link href="#" className="footer-link">About Us</Link></li>
                            <li><Link href="#" className="footer-link">Careers</Link></li>
                            <li><Link href="#" className="footer-link">Privacy Policy</Link></li>
                            <li><Link href="#" className="footer-link">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* Social Icons */}
                    <div className="flex items-center gap-4">
                        {[FaFacebook, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
                            <Link
                                key={i}
                                href="#"
                                className="social-icon"
                            >
                                <Icon className="w-5 h-5" />
                            </Link>
                        ))}
                    </div>

                    {/* Copyright */}
                    <div className="text-center md:text-right">
                        <p className="text-gray-400">
                            © 2026 ShopHub. All rights reserved.
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                            Made with ❤️ for amazing shoppers
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}