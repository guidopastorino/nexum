import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usernameOrEmail: { label: "Usuario o Email", type: "text", placeholder: "Usuario o Email" },
        password: { label: "Password", type: "password", placeholder: "Contraseña" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("No credentials provided");

        await dbConnect();

        const { usernameOrEmail, password } = credentials;

        const user = await User.findOne({
          $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
        });

        if (!user) {
          throw new Error("No se encontró el usuario");
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
          throw new Error("Contraseña incorrecta");
        }

        return { id: user._id, name: user.fullname, email: user.email };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
    updateAge: 24 * 60 * 60, // Actualizar la sesión cada 24 horas
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      await dbConnect();

      let username =
        profile?.name?.toLowerCase().replace(/\s+/g, "") ||
        `user${Date.now().toString().slice(-8)}`;

      if (account?.provider === "google") {
        const existingUser = await User.findOne({ email: profile?.email });

        if (existingUser && !existingUser.googleId) {
          return "/unauthorized";
        } else if (!existingUser) {
          const newUser = new User({
            fullname: profile?.name,
            email: profile?.email,
            googleId: profile?.sub,
            username,
            role: "user",
            profileImage: (profile as any).picture || null,
          });

          try {
            await newUser.save();
          } catch (error) {
            console.error("Error al guardar el usuario:", error);
            return false;
          }
        }
      }
      return true;
    },
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
    },
  },
};