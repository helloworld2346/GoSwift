'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Shield, Users, Rocket, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-bg min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Stars */}
        <div className="star" style={{ top: '5%', left: '10%', width: '2px', height: '2px' }}></div>
        <div className="star" style={{ top: '15%', left: '25%', width: '1px', height: '1px' }}></div>
        <div className="star" style={{ top: '25%', left: '85%', width: '3px', height: '3px' }}></div>
        <div className="star" style={{ top: '35%', left: '15%', width: '2px', height: '2px' }}></div>
        <div className="star" style={{ top: '45%', left: '75%', width: '1px', height: '1px' }}></div>
        <div className="star" style={{ top: '55%', left: '5%', width: '2px', height: '2px' }}></div>
        <div className="star" style={{ top: '65%', left: '90%', width: '3px', height: '3px' }}></div>
        <div className="star" style={{ top: '75%', left: '20%', width: '1px', height: '1px' }}></div>
        <div className="star" style={{ top: '85%', left: '60%', width: '2px', height: '2px' }}></div>
        <div className="star" style={{ top: '95%', left: '40%', width: '1px', height: '1px' }}></div>
        <div className="star" style={{ top: '10%', left: '50%', width: '2px', height: '2px' }}></div>
        <div className="star" style={{ top: '20%', left: '35%', width: '1px', height: '1px' }}></div>
        <div className="star" style={{ top: '30%', left: '95%', width: '3px', height: '3px' }}></div>
        <div className="star" style={{ top: '40%', left: '30%', width: '2px', height: '2px' }}></div>
        <div className="star" style={{ top: '50%', left: '80%', width: '1px', height: '1px' }}></div>
        <div className="star" style={{ top: '60%', left: '45%', width: '2px', height: '2px' }}></div>
        <div className="star" style={{ top: '70%', left: '10%', width: '3px', height: '3px' }}></div>
        <div className="star" style={{ top: '80%', left: '70%', width: '1px', height: '1px' }}></div>
        <div className="star" style={{ top: '90%', left: '25%', width: '2px', height: '2px' }}></div>
        <div className="star" style={{ top: '12%', left: '65%', width: '1px', height: '1px' }}></div>
        <div className="star" style={{ top: '22%', left: '45%', width: '2px', height: '2px' }}></div>
        <div className="star" style={{ top: '32%', left: '8%', width: '3px', height: '3px' }}></div>
        <div className="star" style={{ top: '42%', left: '92%', width: '1px', height: '1px' }}></div>
        <div className="star" style={{ top: '52%', left: '55%', width: '2px', height: '2px' }}></div>
        <div className="star" style={{ top: '62%', left: '18%', width: '1px', height: '1px' }}></div>
        <div className="star" style={{ top: '72%', left: '88%', width: '3px', height: '3px' }}></div>
        <div className="star" style={{ top: '82%', left: '38%', width: '2px', height: '2px' }}></div>
        <div className="star" style={{ top: '92%', left: '72%', width: '1px', height: '1px' }}></div>

        {/* Shooting Stars */}
        <div className="shooting-star" style={{ top: '15%', animationDelay: '0s' }}></div>
        <div className="shooting-star" style={{ top: '55%', animationDelay: '2s' }}></div>
        <div className="shooting-star" style={{ top: '85%', animationDelay: '5s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="gradient-text text-6xl md:text-7xl font-bold mb-6 text-glow-purple">
              GoSwift
            </h1>
            <p className="text-text-secondary text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-glow-subtle">
              Connect across the digital universe with real-time messaging
            </p>
            <p className="text-text-muted text-lg mb-12 max-w-3xl mx-auto">
              Experience the future of communication with our secure, fast, and beautiful chat platform
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="space-card p-6 text-center float" style={{ animationDelay: '0s' }}>
              <Zap className="w-12 h-12 mx-auto mb-4 text-nebula-purple" />
              <h3 className="text-text-primary text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-text-muted">Real-time messaging with WebSocket technology</p>
            </div>

            <div className="space-card p-6 text-center float" style={{ animationDelay: '0.5s' }}>
              <Shield className="w-12 h-12 mx-auto mb-4 text-nebula-magenta" />
              <h3 className="text-text-primary text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-text-muted">End-to-end encryption and JWT authentication</p>
            </div>

            <div className="space-card p-6 text-center float" style={{ animationDelay: '1s' }}>
              <Users className="w-12 h-12 mx-auto mb-4 text-nebula-pink" />
              <h3 className="text-text-primary text-xl font-semibold mb-2">Group Chats</h3>
              <p className="text-text-muted">Create conversations with multiple users</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-card p-8 text-center max-w-md mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Rocket className="w-16 h-16 text-nebula-purple mr-3" />
            </div>
            <h2 className="text-text-primary text-2xl font-bold mb-4 text-glow-subtle">
              Start Your Journey
            </h2>
            <p className="text-text-muted mb-6">
              Join thousands of users already connecting across the digital universe
            </p>
            <div className="space-y-8">
              <Link href="/login">
                <Button className="gradient-button w-full text-xl py-6 px-8">
                  Sign In to Your Adventure
                </Button>
              </Link>
              <Link href="/register">
                <Button className="space-outline-button w-full text-xl py-6 px-8">
                  Create New Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
