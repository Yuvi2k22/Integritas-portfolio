'use server';
import { getAuthOrganizationContext } from '@workspace/auth/context';
import { prisma } from '@workspace/database/client';
import { getDedupedBillingDetails } from '../billing/get-billing-details';
import { format } from 'date-fns';

function formatStripeDate(timestamp: number): string {
  return format(new Date(timestamp * 1000), 'MMM dd, hh:mm a');
}

function parseCustomDateString(dateStr: string) {
  const currentYear = new Date().getFullYear();
  const fullDateStr = `${dateStr} ${currentYear}`;

  const parsedDate = new Date(fullDateStr);

  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date format. Expected format: 'Jul 23, 02:46 PM'");
  }

  return parsedDate;
}

export async function getOrganizationEpicCount() {
  try {
    const ctx = await getAuthOrganizationContext();
    const orgId = ctx.organization.id;
    let plan = ctx.organization.tier.toLowerCase();
    let epicsCount = 0;
    let billingDate;
    if (plan?.includes('pending')) {
      const planDetails = await getDedupedBillingDetails();
      plan = planDetails?.plan?.displayName?.toLowerCase();
    }
    if (plan === 'free') {
      // All-time epic count
      epicsCount = await prisma.epic.count({
        where: {
          project: {
            organizationId: orgId,
          },
        },
      });
    } else if (plan === 'pro') {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      //Monthly epic count
      epicsCount = await prisma.epic.count({
        where: {
          project: {
            organizationId: orgId,
          },
          createdAt: {
            gte: startOfMonth,
          },
        },
      });
      const planDetails = await getDedupedBillingDetails();
      const currentPlan = planDetails?.plan;
      if (currentPlan.stripeCurrentPeriodStart) {
        const stripeStartTime = formatStripeDate(
          currentPlan.stripeCurrentPeriodStart,
        );
        billingDate = parseCustomDateString(stripeStartTime);
      }
    }

    const data: any = {
      organizationId: orgId,
    };
    if (billingDate) {
      data.createdAt = { lte: billingDate };
    }

    const members = await prisma.membership.count({
      where: { ...data },
    });
    return {
      organizationTier: plan,
      epicsCount,
      members,
    };
  } catch (error) {
    console.log('Error fetching organization epic count:', error);
    return {
      serverError: 'Failed to fetch organization epic count',
    };
  }
}
