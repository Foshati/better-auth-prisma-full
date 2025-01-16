import { betterAuth } from "better-auth";
import {
	bearer,
	admin,
	multiSession,
	organization,
	twoFactor,
	oneTap,
	oAuthProxy,
	openAPI,
	oidcProvider,
} from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { reactInvitationEmail } from "./email/invitation";
import { reactResetPasswordEmail } from "./email/rest-password";
import { resend } from "./email/resend";
import db from "@/lib/db";
import { passkey } from "better-auth/plugins/passkey";


// Email configuration
// "delivered@resend.dev"
const from = process.env.BETTER_AUTH_EMAIL || "noreply@foshati.ir";
const to = process.env.TEST_EMAIL;

export const auth = betterAuth({
	secret: process.env.BETTER_AUTH_SECRET,
	database: prismaAdapter(db, {
		provider: 'postgresql'
	}),

	session: {
		freshAge: 0,
	},

	emailVerification: {
		async sendVerificationEmail({ user, url }) {
			await resend.emails.send({
				from,
				to: to || user.email,
				subject: "Verify your email address",
				html: `<a href="${url}">Verify your email address</a>`
			});
		}
	},

	account: {
		accountLinking: {
			trustedProviders: ["google", "github", "demo-app"]
		}
	},

	emailAndPassword: {
		enabled: true,
		async sendResetPassword({ user, url }) {
			await resend.emails.send({
				from,
				to: user.email,
				subject: "Reset your password",
				react: reactResetPasswordEmail({
					username: user.email,
					resetLink: url
				})
			});
		}
	},

	socialProviders: {
		google: {
			clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
		},
		github: {
			clientId: process.env.GITHUB_CLIENT_ID || "",
			clientSecret: process.env.GITHUB_CLIENT_SECRET || ""
		},
	},

	trustedOrigins: [
		"https://localhost:3000/api/auth",
		'https://localhost:3000/auth',
		'https://localhost:3000/sign-in',
		'https://localhost:3000/forgot-password',
		'https://localhost:3000',
		"https://localhost:3000/dashboard"
	],

	plugins: [
		organization({
			async sendInvitationEmail(data) {
				await resend.emails.send({
					from,
					to: data.email,
					subject: "You've been invited to join an organization",
					react: reactInvitationEmail({
						username: data.email,
						invitedByUsername: data.inviter.user.name,
						invitedByEmail: data.inviter.user.email,
						teamName: data.organization.name,
						inviteLink: process.env.NODE_ENV === "development"
							? `http://localhost:3000/accept-invitation/${data.id}`
							: `${process.env.BETTER_AUTH_URL}/accept-invitation/${data.id}`
					})
				});
			}
		}),
		twoFactor({
			otpOptions: {
				async sendOTP({ user, otp }) {
					await resend.emails.send({
						from,
						to: user.email,
						subject: "Your OTP",
						html: `Your OTP is ${otp}`
					});
				}
			}
		}),
		passkey(),
		openAPI(),
		bearer(),
		admin(),
		multiSession(),
		oneTap(),
		oAuthProxy(),
		nextCookies(),
		oidcProvider({
			loginPage: "/sign-in"
		})
	]
});