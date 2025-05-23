'use client';

import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import SignIn from "./sign-in";
import Header from "./ui/Header";

const HeroAnimation = () => {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-30"></div>
            {/* Hexagon grid pattern */}
            <svg
                className="absolute inset-0 w-full h-full opacity-10"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <pattern
                        id="hexagons"
                        width="50"
                        height="43.4"
                        patternUnits="userSpaceOnUse"
                        patternTransform="scale(2)"
                    >
                        <path
                            d="M25 0 L50 14.4 L50 38.6 L25 53 L0 38.6 L0 14.4 Z"
                            fill="none"
                            stroke="#00FF88"
                            strokeWidth="1"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hexagons)" />
            </svg>

            {/* Static glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
                style={{
                    background:
                        "radial-gradient(circle at center, rgba(0,255,136,0.2) 0%, transparent 70%)",
                }}
            />
        </div>
    );
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, ready } = usePrivy()

    return <body className="min-h-screen flex flex-col sen">
        <div className="min-h-screen flex flex-col">
            <Header />
            <HeroAnimation />
            {!ready ? <div className="w-full h-screen flex flex-col justify-center items-center">
                <Image src="/loading.gif" alt="loading" width={300} height={300} className="pb-8" />
            </div> :
                user != null ? children :

                    <SignIn />
            }
        </div>

    </body>
}