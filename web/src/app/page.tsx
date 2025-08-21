'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Shield, Users, Rocket, Sparkles } from 'lucide-react';
import {
  PageTransition,
  StaggerContainer,
  StaggerItem,
  CosmicTransition,
  FloatingElement
} from '@/components/ui/page-transition';
import { SpaceBackground } from '@/components/ui/space-background';

export default function HomePage() {
  return (
    <SpaceBackground>

      {/* Main Content */}
      <PageTransition className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          {/* Hero Section */}
          <StaggerContainer className="text-center mb-12">
            <StaggerItem>
              <CosmicTransition>
                <h1 className="gradient-text text-6xl md:text-7xl font-bold mb-6 text-glow-purple">
                  GoSwift
                </h1>
              </CosmicTransition>
            </StaggerItem>
            <StaggerItem>
              <p className="text-text-secondary text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-glow-subtle">
                Connect across the digital universe with real-time messaging
              </p>
            </StaggerItem>
            <StaggerItem>
              <p className="text-text-muted text-lg mb-12 max-w-3xl mx-auto">
                Experience the future of communication with our secure, fast, and beautiful chat platform
              </p>
            </StaggerItem>
          </StaggerContainer>

          {/* Features Grid */}
          <StaggerContainer className="grid md:grid-cols-3 gap-6 mb-12">
            <StaggerItem>
              <FloatingElement>
                <div className="space-card p-6 text-center">
                  <Zap className="w-12 h-12 mx-auto mb-4 text-nebula-purple" />
                  <h3 className="text-text-primary text-xl font-semibold mb-2">Lightning Fast</h3>
                  <p className="text-text-muted">Real-time messaging with WebSocket technology</p>
                </div>
              </FloatingElement>
            </StaggerItem>

            <StaggerItem>
              <FloatingElement>
                <div className="space-card p-6 text-center">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-nebula-magenta" />
                  <h3 className="text-text-primary text-xl font-semibold mb-2">Secure & Private</h3>
                  <p className="text-text-muted">End-to-end encryption and JWT authentication</p>
                </div>
              </FloatingElement>
            </StaggerItem>

            <StaggerItem>
              <FloatingElement>
                <div className="space-card p-6 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-nebula-pink" />
                  <h3 className="text-text-primary text-xl font-semibold mb-2">Group Chats</h3>
                  <p className="text-text-muted">Create conversations with multiple users</p>
                </div>
              </FloatingElement>
            </StaggerItem>
          </StaggerContainer>

          {/* CTA Section */}
          <StaggerItem>
            <CosmicTransition>
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
            </CosmicTransition>
          </StaggerItem>
        </div>
      </PageTransition>
    </SpaceBackground>
  );
}
