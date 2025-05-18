import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { Resend } from "resend";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);
const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      async sendVerificationRequest({ identifier, url }) {
        try {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: identifier,
            subject: "Sign in to CommandNet",
            html: `<p>Sign in by clicking <a href="${url}">here</a></p>`
          });
        } catch (error) {
          console.error("Error sending email:", error);
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST }; 