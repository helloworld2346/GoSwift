'use client';

import { ReactNode } from 'react';

interface SpaceBackgroundProps {
    children: ReactNode;
    className?: string;
}

export function SpaceBackground({ children, className = '' }: SpaceBackgroundProps) {
    return (
        <div className={`space-bg min-h-screen relative overflow-hidden ${className}`}>
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

            {/* Content */}
            {children}
        </div>
    );
}
