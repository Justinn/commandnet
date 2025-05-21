import styled from "styled-components";

export const Form = styled.form`
  width: 100%;
  background: none;
  border-radius: 0;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: stretch;
`;

export const ContentWrapper = styled.div`
  width: 32rem;
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  @media (max-width: 600px) {
    width: 100%;
    padding: 1rem 0.5rem 0.7rem 0.5rem;
    max-width: 100%;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

export const Label = styled.label`
  color: ${({ theme }) => theme.colors.primary};
  font-family: var(--font-share-tech-mono);
  font-size: 1.05rem;
  font-weight: 600;
`;

export const Input = styled.input`
  padding: 0.7rem 1rem;
  border-radius: 0.4rem;
  border: 1px solid ${({ theme }) => theme.colors.primary + "55"};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.1rem;
  font-family: ${({ theme }) => theme.fonts.main};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0.3rem ${({ theme }) => theme.colors.primary};
  }
`;

export const EmailDisplay = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
`;

export const SuccessMsg = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.1rem;
  margin-top: 0.7rem;
  text-align: center;
  min-height: 2.2rem;
  word-break: break-word;
`;

export const ErrorMsg = styled.div`
  color: #ff4d4f;
  font-size: 1.05rem;
  margin-top: 0.7rem;
  text-align: center;
  min-height: 2.2rem;
  word-break: break-word;
`; 