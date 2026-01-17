'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { MailIcon, MapPinIcon, PhoneIcon, SendIcon, CheckCircleIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { toast } from '@workspace/ui/components/sonner';
import { Textarea } from '@workspace/ui/components/textarea';

import { GridSection } from '~/components/fragments/grid-section';
import { SiteHeading } from '~/components/fragments/site-heading';



export function Contact(): React.JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!formData.firstName || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (formData.message.length < 10) {
      toast.error('Message must be at least 10 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { submitContactForm } = await import('~/app/actions/contact');
      const result = await submitContactForm(formData);

      if (result.success) {
        setIsSubmitted(true);
        toast.success('Message sent successfully! We\'ll get back to you soon.');

        // Reset form after delay
        setTimeout(() => {
          setFormData({ firstName: '', lastName: '', email: '', message: '' });
          setIsSubmitted(false);
        }, 3000);
      } else {
        toast.error(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <GridSection>
      <div ref={sectionRef} className="container space-y-20 py-20">
        {/* Animated Header */}
        <div
          className="transition-all duration-700 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <SiteHeading
            badge="Contact"
            title={
              <>
                Let&apos;s build something
                <br /> amazing together!
              </>
            }
          />
        </div>

        <div className="lg:container lg:max-w-6xl">
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:gap-20">
            {/* Left Column - Contact Info */}
            <div
              className="order-2 space-y-8 text-center lg:order-1 lg:w-1/2 lg:text-left transition-all duration-700 ease-out"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
                transitionDelay: '200ms',
              }}
            >
              <h3 className="m-0 hidden max-w-fit text-4xl font-semibold lg:block">
                Ready to start your project?
              </h3>
              <p className="text-muted-foreground lg:max-w-[80%]">
                Have an idea you&apos;d like to bring to life? Or just want to say hello?
                We&apos;re always excited to hear about new projects and opportunities.
                Drop us a message and we&apos;ll get back to you within 24 hours.
              </p>
              <div className="space-y-4">
                <h4 className="hidden text-lg font-medium lg:block">
                  Get in touch
                </h4>
                <div className="flex flex-col items-center gap-4 lg:items-start">
                  <ContactInfo
                    icon={MailIcon}
                    text="vijaykrishnakanthk@gmail.com"
                    delay={400}
                    isVisible={isVisible}
                  />
                  <ContactInfo
                    icon={PhoneIcon}
                    text="+91 98765 43210"
                    delay={500}
                    isVisible={isVisible}
                  />
                  <ContactInfo
                    icon={MapPinIcon}
                    text="India (Remote Worldwide)"
                    delay={600}
                    isVisible={isVisible}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <Card
              className="order-1 mx-auto w-full max-w-lg shadow-lg lg:order-2 lg:w-1/2 transition-all duration-700 ease-out hover:shadow-xl"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0) scale(1)' : 'translateX(40px) scale(0.95)',
                transitionDelay: '300ms',
              }}
            >
              <CardContent className="flex flex-col gap-6 p-6 lg:p-10">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 grid w-full items-center gap-1.5 sm:col-span-1">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="transition-all duration-300 focus:scale-[1.02]"
                      />
                    </div>
                    <div className="col-span-2 grid w-full items-center gap-1.5 sm:col-span-1">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="transition-all duration-300 focus:scale-[1.02]"
                      />
                    </div>
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="johndoe@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="transition-all duration-300 focus:scale-[1.02]"
                    />
                  </div>
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your project..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="transition-all duration-300 focus:scale-[1.01]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full gap-2 transition-all duration-300 hover:scale-[1.02]"
                    disabled={isSubmitting || isSubmitted}
                  >
                    {isSubmitted ? (
                      <>
                        <CheckCircleIcon className="size-4" />
                        Message Sent!
                      </>
                    ) : isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <SendIcon className="size-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </GridSection>
  );
}

type ContactInfoProps = {
  icon: React.ElementType;
  text: string;
  delay: number;
  isVisible: boolean;
};

function ContactInfo({
  icon: Icon,
  text,
  delay,
  isVisible,
}: ContactInfoProps): React.JSX.Element {
  return (
    <div
      className="flex items-center gap-3 text-sm lg:w-64 transition-all duration-500 hover:text-primary"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
        <Icon className="size-5 shrink-0 text-primary" />
      </div>
      <span className="font-medium">{text}</span>
    </div>
  );
}
