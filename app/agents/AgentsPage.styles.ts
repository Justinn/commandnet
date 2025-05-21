import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 60rem;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  box-sizing: border-box;
  @media (max-width: 600px) {
    padding: 1.2rem 0.5rem;
    height: 100dvh;
  }
`;

export const Title = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  font-family: var(--font-share-tech-mono);
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 2.5rem;
  text-align: center;
  text-shadow: 0 0 1.2rem ${({ theme }) => theme.colors.primary};
  @media (max-width: 600px) {
    font-size: 1.3rem;
    margin-bottom: 1.2rem;
  }
`; 