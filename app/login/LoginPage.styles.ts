import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  font-family: ${({ theme }) => theme.fonts.main};
`;

export const Title = styled.h4`
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
  text-shadow: 0 0 0.75rem ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.main};
  text-align: center;
`;

export const Form = styled.form`
  width: 20rem;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-family: ${({ theme }) => theme.fonts.main};
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.paper};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  font-family: ${({ theme }) => theme.fonts.main};
  margin-bottom: 1.5rem;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export const Alert = styled.div<{ $severity: 'success' | 'error' }>`
  margin-top: 1.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: ${({ theme }) => theme.fonts.main};
  color: ${({ $severity, theme }) =>
    $severity === 'success' ? '#0a0' : theme.colors.primary};
  background: ${({ $severity, theme }) =>
    $severity === 'success' ? 'rgba(0,255,128,0.08)' : 'rgba(0,191,255,0.08)'};
  border: 1px solid
    ${({ $severity, theme }) =>
      $severity === 'success' ? '#0a0' : theme.colors.primary};
`; 