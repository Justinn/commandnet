import styled from 'styled-components';

export const Container = styled.div`
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 4rem);
  font-family: ${({ theme }) => theme.fonts.main};
  text-align: center;

  @media (max-width: 600px) {
    padding: 1rem;
    min-height: calc(100vh - 4.5rem);
  }
`;

export const Title = styled.h3`
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: 0 0 0.75rem ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
  font-family: ${({ theme }) => theme.fonts.main};

  @media (max-width: 600px) {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
`;

export const Subtitle = styled.h6`
  max-width: 37.5rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4rem;
  font-size: 1.1rem;
  font-family: ${({ theme }) => theme.fonts.main};

  @media (max-width: 600px) {
    font-size: 0.95rem;
    margin-bottom: 2rem;
    max-width: 90vw;
  }
`; 