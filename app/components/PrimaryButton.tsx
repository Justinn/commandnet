import styled, { css } from 'styled-components';
import Link from 'next/link';

const buttonStyles = css`
  display: inline-block;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 1.1rem;
  font-weight: 700;
  text-decoration: none;
  margin-top: 2rem;
  box-shadow: 0 0 0.5rem ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, color 0.2s;
  &:hover {
    background: ${({ theme }) => theme.colors.textSecondary};
    box-shadow: 0 0 1.5rem ${({ theme }) => theme.colors.primary}, 0 0 0.5rem ${({ theme }) => theme.colors.textSecondary};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 0.5rem 1.2rem;
    margin-top: 1rem;
  }
`;

export const PrimaryButton = styled.button`
  ${buttonStyles}
`;

export const PrimaryLinkButton = styled(Link)`
  ${buttonStyles}
`; 