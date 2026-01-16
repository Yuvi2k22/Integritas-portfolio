// Convention:
// - Everything lowercase is an object
// - Everything uppercase is a string (the route)

import { keys } from '../keys';

export const baseUrl = {
  Dashboard: keys().NEXT_PUBLIC_DASHBOARD_URL,
  Marketing: keys().NEXT_PUBLIC_MARKETING_URL,
} as const;

export const routes = {
  dashboard: {
    Api: `${baseUrl.Dashboard}/api`,
    auth: {
      changeEmail: {
        Expired: `${baseUrl.Dashboard}/auth/change-email/expired`,
        Index: `${baseUrl.Dashboard}/auth/change-email`,
        Invalid: `${baseUrl.Dashboard}/auth/change-email/invalid`,
        Request: `${baseUrl.Dashboard}/auth/change-email/request`,
      },
      Error: `${baseUrl.Dashboard}/auth/error`,
      forgetPassword: {
        Index: `${baseUrl.Dashboard}/auth/forgot-password`,
        Success: `${baseUrl.Dashboard}/auth/forgot-password/success`,
      },
      Index: `${baseUrl.Dashboard}/auth`,
      RecoveryCode: `${baseUrl.Dashboard}/auth/recovery-code`,
      resetPassword: {
        Expired: `${baseUrl.Dashboard}/auth/reset-password/expired`,
        Index: `${baseUrl.Dashboard}/auth/reset-password`,
        Request: `${baseUrl.Dashboard}/auth/reset-password/request`,
        Success: `${baseUrl.Dashboard}/auth/reset-password/success`,
      },
      SignIn: `${baseUrl.Dashboard}/auth/sign-in`,
      SignUp: `${baseUrl.Dashboard}/auth/sign-up`,
      Totp: `${baseUrl.Dashboard}/auth/totp`,
      verifyEmail: {
        Expired: `${baseUrl.Dashboard}/auth/verify-email/expired`,
        Index: `${baseUrl.Dashboard}/auth/verify-email`,
        Request: `${baseUrl.Dashboard}/auth/verify-email/request`,
        Success: `${baseUrl.Dashboard}/auth/verify-email/success`,
      },
    },
    Index: `${baseUrl.Dashboard}/`,
    invitations: {
      AlreadyAccepted: `${baseUrl.Dashboard}/invitations/already-accepted`,
      Index: `${baseUrl.Dashboard}/invitations`,
      Request: `${baseUrl.Dashboard}/invitations/request`,
      Revoked: `${baseUrl.Dashboard}/invitations/revoked`,
    },
    onboarding: {
      Index: `${baseUrl.Dashboard}/onboarding`,
      Organization: `${baseUrl.Dashboard}/onboarding/organization`,
      User: `${baseUrl.Dashboard}/onboarding/user`,
    },
    organizations: {
      Index: `${baseUrl.Dashboard}/organizations`,
      slug: {
        Contacts: `${baseUrl.Dashboard}/organizations/[slug]/contacts`,
        Home: `${baseUrl.Dashboard}/organizations/[slug]/projects`,
        Index: `${baseUrl.Dashboard}/organizations/[slug]`,
        settings: {
          account: {
            Index: `${baseUrl.Dashboard}/organizations/[slug]/settings/account`,
            Notifications: `${baseUrl.Dashboard}/organizations/[slug]/settings/account/notifications`,
            Profile: `${baseUrl.Dashboard}/organizations/[slug]/settings/account/profile`,
            Security: `${baseUrl.Dashboard}/organizations/[slug]/settings/account/security`,
          },
          Index: `${baseUrl.Dashboard}/organizations/[slug]/settings`,
          organization: {
            Billing: `${baseUrl.Dashboard}/organizations/[slug]/settings/organization/billing`,
            Developers: `${baseUrl.Dashboard}/organizations/[slug]/settings/organization/developers`,
            General: `${baseUrl.Dashboard}/organizations/[slug]/settings/organization/general`,
            Index: `${baseUrl.Dashboard}/organizations/[slug]/settings/organization`,
            Members: `${baseUrl.Dashboard}/organizations/[slug]/settings/organization/members`,
          },
        },
        projects: {
          Index: `${baseUrl.Dashboard}/organizations/[slug]/projects`,
          project: {
            Index: `${baseUrl.Dashboard}/organizations/[slug]/projects/[projectSlug]`,
            epics: {
              epic: {
                Index: `${baseUrl.Dashboard}/organizations/[slug]/projects/[projectSlug]/epics/[epicSlug]`,
                UploadUIScreens: `${baseUrl.Dashboard}/organizations/[slug]/projects/[projectSlug]/epics/[epicSlug]/upload-ui-screens`,
                DescribeScreens: `${baseUrl.Dashboard}/organizations/[slug]/projects/[projectSlug]/epics/[epicSlug]/describe-screens`,
                BackendLogics: `${baseUrl.Dashboard}/organizations/[slug]/projects/[projectSlug]/epics/[epicSlug]/backend-logics`,
                AppFlow: `${baseUrl.Dashboard}/organizations/[slug]/projects/[projectSlug]/epics/[epicSlug]/app-flow`,
                ScreenDocs: `${baseUrl.Dashboard}/organizations/[slug]/projects/[projectSlug]/epics/[epicSlug]/screen-docs`,
                UserStories: `${baseUrl.Dashboard}/organizations/[slug]/projects/[projectSlug]/epics/[epicSlug]/user-stories`,
              },
            },
          },
        },
      },
    },
  },
  marketing: {
    Api: `${baseUrl.Marketing}/api`,
    Blog: `${baseUrl.Marketing}/blog`,
    Careers: `${baseUrl.Marketing}/careers`,
    Contact: `${baseUrl.Marketing}/contact`,
    CookiePolicy: `${baseUrl.Marketing}/cookie-policy`,
    Docs: `${baseUrl.Marketing}/docs`,
    Index: `${baseUrl.Marketing}/`,
    Pricing: `${baseUrl.Marketing}/pricing`,
    PrivacyPolicy: `${baseUrl.Marketing}/privacy-policy`,
    Roadmap: 'https://achromatic.canny.io',
    Story: `${baseUrl.Marketing}/story`,
    TermsOfUse: `${baseUrl.Marketing}/terms-of-use`,
  },
} as const;

export const apiRoutes = {
  Api: routes.dashboard.Api,
  projects: {
    epics: {
      uploadUIFiles: `${routes.dashboard.Api}/epics/upload-ui-files`,
      analyzeUIFiles: `${routes.dashboard.Api}/epics/analyze-ui-files`,
      backendLogics: `${routes.dashboard.Api}/epics/backend-logics`,
      generateAppFlow: `${routes.dashboard.Api}/epics/generate-app-flow`,
      generateAllScreens: `${routes.dashboard.Api}/epics/generate-all-screens`,
      generateAdvancedTool: `${routes.dashboard.Api}/epics/generate-advanced-tool`,
    },
  },
};

export function replaceOrgSlug(route: string, slug: string): string {
  if (route.indexOf('[slug]') === -1) {
    throw new Error(
      `Invalid route: ${route}. Route must contain the placeholder [slug].`,
    );
  }

  return route.replaceAll('[slug]', slug);
}

/**
 * Enum representing route slugs used in URL paths.
 * Provides placeholders for dynamic route segments.
 */
export enum RouteSlugs {
  OrgSlug = '[slug]', // Placeholder for organization slug
  ProjectSlug = '[projectSlug]', // Placeholder for project slug
  EpicSlug = '[epicSlug]', // Placeholder for epic slug
}

/**
 * Replaces slugs in URL routes with provided values.
 *
 * @param route - The route string containing slugs to be replaced.
 * @param slugs - An object mapping RouteSlugs to their corresponding values.
 * @returns The route with all slugs replaced by their respective values.
 */
export function replaceRouteSlugs(
  route: string,
  slugs: { [key in RouteSlugs]?: string },
): string {
  let replacedRoute = route;

  // Iterate over each slug-value pair and replace all occurrences of the slug in the route
  Object.entries(slugs).forEach(([slug, value]) => {
    if (value) {
      replacedRoute = replacedRoute.replaceAll(slug, value);
    }
  });

  return replacedRoute;
}

export function getPathname(route: string, baseUrl: string): string {
  return new URL(route, baseUrl).pathname;
}

export function getOrganizationLogoUrl(
  organizationId: string,
  hash: string,
): string {
  return `${routes.dashboard.Api}/organization-logos/${organizationId}?v=${hash}`;
}

export function getUserImageUrl(userId: string, hash: string): string {
  return `${routes.dashboard.Api}/user-images/${userId}?v=${hash}`;
}

export function getContactImageUrl(contactId: string, hash: string): string {
  return `${routes.dashboard.Api}/contact-images/${contactId}?v=${hash}`;
}
