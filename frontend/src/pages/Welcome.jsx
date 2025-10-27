import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Package, BarChart3, FileCheck, Zap } from 'lucide-react'
import logo from '../assets/logo.png'

const Welcome = () => {

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Logo and Brand */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                <img src={logo} alt="Penguin Logo" className="w-20 h-20 object-contain" />
              </div>
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-4">
              PENGUIN
            </h1>
            <p className="text-2xl font-semibold text-blue-600 mb-2">
              TOYS & NOVELTIES
            </p>
            <p className="text-lg text-gray-600">
              Inventory Management System
            </p>
          </div>

          {/* Main Headline */}
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Manage Your Inventory with
              <span className="text-blue-600"> Confidence</span>
            </h2>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/dashboard"
                className="group px-8 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default Welcome