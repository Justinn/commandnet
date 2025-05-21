import styled, { css, DefaultTheme } from 'styled-components';

const mobileMedia = '@media (max-width: 600px)';

const headerPrimaryColor = ({ theme }: { theme: DefaultTheme }) => theme.colors.primary;
const headerGradient = ({ theme }: { theme: DefaultTheme }) => theme.colors.headerGradient;

export const HeaderBar = styled.header`
  width: 100%;
  background: ${headerGradient};
  box-shadow: none;
  border-bottom: 0.02rem solid ${headerPrimaryColor};
  padding: 0;
  ${mobileMedia} {
    min-height: 3.5rem;
  }
`;

export const HeaderToolbar = styled.div`
  display: flex;
  align-items: center;
  min-height: 5.5rem;
  padding-left: 2rem;
  ${mobileMedia} {
    min-height: 3.5rem;
    padding: 0 0.5rem;
    justify-content: center;
  }
`;

export const Title = styled.h2`
  color: ${headerPrimaryColor};
  font-family: var(--font-share-tech-mono);
  font-weight: 900;
  font-size: 2.5rem;
  letter-spacing: 0.12em;
  text-shadow: 0 0 2rem ${headerPrimaryColor}, 0 0 1rem ${headerPrimaryColor};
  text-align: center;
  line-height: 1.1;
  margin: 0;
  ${mobileMedia} {
    font-size: 1.3rem;
    text-shadow: 0 0 1rem ${headerPrimaryColor};
    text-align: center;
    width: 100%;
  }
`;

export const NeonBar = styled.div`
  height: 0.25rem;
  width: 100%;
  background: linear-gradient(90deg, #00bfff 0%, #0a0f1a 100%);
  box-shadow: 0 0 1.5rem #00bfff;
  ${mobileMedia} {
    height: 0.18rem;
  }
`;

export const LogoWrapper = styled.div`
  position: relative;
  width: 12rem;
  height: 7rem;
  display: flex;
  align-items: center;
  @media (max-width: 600px) {
    width: 8rem;
    height: 2rem;
    margin-right: 0.6rem;
  }
`; 