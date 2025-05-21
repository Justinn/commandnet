"use client";

import Image from "next/image";
import { HeaderBar, HeaderToolbar, Title, NeonBar, LogoWrapper } from "./Header.styles";

export default function Header() {
  return (
    <HeaderBar style={{ position: 'relative' }}>
      <HeaderToolbar>
        <LogoWrapper>
          <Image src="/images/logo.png" alt="CommandNet Logo" fill style={{ objectFit: 'contain' }} />
        </LogoWrapper>
      </HeaderToolbar>
      <NeonBar />
    </HeaderBar>
  );
} 