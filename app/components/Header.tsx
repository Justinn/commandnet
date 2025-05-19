"use client";

import styled from 'styled-components';

const HeaderBar = styled.header`
  width: 100%;
  background: ${({ theme }) => theme.colors.headerGradient};
  box-shadow: none;
  border-bottom: 0.02rem solid ${({ theme }) => theme.colors.primary};
  padding: 0;
  @media (max-width: 600px) {
    min-height: 3.5rem;
  }
`;

const HeaderToolbar = styled.div`
  display: flex;
  align-items: center;
  min-height: 5.5rem;
  padding: 0;
  @media (max-width: 600px) {
    min-height: 3.5rem;
    padding: 0 0.5rem;
    justify-content: center;
  }
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  font-family: var(--font-share-tech-mono);
  font-weight: 900;
  font-size: 2.5rem;
  letter-spacing: 0.12em;
  text-shadow: 0 0 2rem ${({ theme }) => theme.colors.primary}, 0 0 1rem ${({ theme }) => theme.colors.primary};
  text-align: center;
  line-height: 1.1;
  margin: 0;
  @media (max-width: 600px) {
    font-size: 1.3rem;
    text-shadow: 0 0 1rem ${({ theme }) => theme.colors.primary};
    text-align: center;
    width: 100%;
  }
`;

const NeonBar = styled.div`
  height: 0.25rem;
  width: 100%;
  background: linear-gradient(90deg, #00bfff 0%, #0a0f1a 100%);
  box-shadow: 0 0 1.5rem #00bfff;
  @media (max-width: 600px) {
    height: 0.18rem;
  }
`;

export default function Header() {
  return (
    <HeaderBar style={{ position: 'relative' }}>
      <HeaderToolbar>
        <Title>CommandNet</Title>
      </HeaderToolbar>
      <NeonBar />
    </HeaderBar>
  );
}