'use client';

import React, { useState } from 'react';
import { Badge, Check, Star } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { createCheckoutSession } from '~/actions/billing/create-checkout-session';
import { getStripeClient } from '@workspace/billing/stripe-client';
import { toast } from '@workspace/ui/components/sonner';
import { ProfileDto } from '~/types/dtos/profile-dto';
import { useSessionRecording } from '~/app/posthog-provider';
import { useActiveOrganization } from '~/hooks/use-active-organization';
import { postHogRecording } from '../../../projects/epics/advanced-tools/common/upgrade-to-pro-dialog';
import { SubscriptionPlanDto } from '~/types/dtos/subscription-plan-dto';
import { createBillingPortalSessionUrl } from '~/actions/billing/create-billing-portal-session-url';
export type PricingProps = {
  profile: ProfileDto;
  plan: SubscriptionPlanDto;
};
const Pricing = ({ profile, plan }: PricingProps) => {
  const [teamSize] = useState('1');
  const { startRecording } = useSessionRecording();
  const organization = useActiveOrganization();
  const [loading, setLoading] = useState(false);
  const isFreePlan = plan?.displayName === 'Free';
  const freeFeatures = [
    'Perfect for beginners',
    '1 Epic',
    'UnLimited Seats',
    '1 Project',
    'Limited features',
    'Regeneration NOT allowed',
    'Regular support',
  ];

  const proFeatures = [
    'Perfect for advanced users',
    '5 Epics/month per seat',
    'Billed per seat',
    'Unlimited Projects',
    'All features and tools unlocked',
    'Regeneration Allowed (up to 3 times per item)',
    'Premium Support',
  ];

  const enterpriseFeatures = [
    'For large-scale teams & organizations',
    'Unlimited Epics',
    'Custom Seat Package',
    'Unlimited Projects',
    'All features and tools unlocked',
    'Unlimited Regeneration',
    'Priority Support',
  ];

  const calculateProPrice = (members: string) => {
    const memberCount = parseInt(members);
    return memberCount * 20;
  };

  const isEnterprise = parseInt(teamSize) >= 30;

  const handleContactSales = () => {
    window.open(
      '_blank',
      'noopener,noreferrer',
    );
  };
  const handleUpgrade = async (): Promise<void> => {
    const result = await createCheckoutSession();
    if (result?.data?.session?.id) {
      const stripe = await getStripeClient();
      const { error } = await stripe!.redirectToCheckout({
        sessionId: result.data.session.id,
      });
      if (error?.message) {
        toast.error(error.message);
      }
    } else {
      toast.error('Failed to create checkout session. Please try again.');
    }
  };

  const handleBillingPortalRedirect = async (): Promise<void> => {
    const result = await createBillingPortalSessionUrl();
    if (result?.data?.url) {
      window.location.href = result.data.url;
    } else {
      toast.error('Failed to create billing portal session. Please try again.');
    }
  };

  const handleBillingRedirect = async (): Promise<void> => {
    setLoading(true);
    const data: postHogRecording = {
      organizationName: organization.name,
      eventName: 'upgrade-event',
    };
    if (profile.email) data.email = profile.email;
    startRecording({
      ...data,
    });
    try {
      if (isFreePlan) {
        await handleUpgrade();
      } else {
        await handleBillingPortalRedirect();
      }
    } catch (error) {
      console.error('Billing redirect error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" bg-background overflow-visible">
      <div className="max-w-7xl mx-auto p-6 overflow-visible">
        {/* Header Section with higher z-index */}
        <div className="text-center mb-20 relative z-[100] overflow-visible">
          <h1 className="text-4xl font-bold text-foreground mb-8">
            Pricing plans
          </h1>
        </div>

        {/* Pricing Cards with lower z-index */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12 relative z-10">
          {/* Free Plan */}
          <Card className="relative border-border bg-card">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-card-foreground">
                Free
              </CardTitle>
              <div className="mt-4">
                <div className="text-4xl font-bold text-card-foreground">
                  $0
                </div>
                <div className="text-muted-foreground">/month for 1 member</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button variant="outline" className="w-full" disabled>
                Free Plan
              </Button>

              <div className="space-y-3">
                {freeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-card-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-primary bg-card shadow-lg scale-105">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
              <Star className="h-3 w-3 mr-1" />
              Most Popular
            </Badge>

            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-card-foreground">
                Pro
              </CardTitle>
              <div className="mt-4">
                <div className="text-4xl font-bold text-card-foreground">
                  ${isEnterprise ? 'Custom' : calculateProPrice(teamSize)}
                </div>
                <div className="text-muted-foreground">
                  {isEnterprise
                    ? 'Contact sales'
                    : `/month for ${teamSize} ${teamSize === '1' ? 'member' : 'members'}`}
                </div>
                {!isEnterprise && parseInt(teamSize) > 1 && (
                  <div className="text-sm text-muted-foreground mt-1">
                    $20 per seat
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleBillingRedirect}
                loading={loading}
                disabled={loading}
              >
                {isEnterprise
                  ? 'Contact Sales'
                  : isFreePlan
                    ? 'Upgrade to Pro'
                    : 'Change subscription'}
              </Button>

              <div className="space-y-3">
                {proFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span
                      className={`text-sm text-card-foreground ${index === 0 ? 'font-medium' : ''}`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="relative border-border bg-card">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-card-foreground">
                Enterprise
              </CardTitle>
              <div className="mt-4">
                <div className="text-4xl font-bold text-card-foreground">
                  Custom
                </div>
                <div className="text-muted-foreground">
                  Starting at 30 seats
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleContactSales}
              >
                Contact Sales
              </Button>

              <div className="space-y-3">
                {enterpriseFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span
                      className={`text-sm text-card-foreground ${index === 0 ? 'font-medium' : ''}`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
