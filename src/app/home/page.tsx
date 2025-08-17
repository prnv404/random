
'use client';

import { Phone, BarChart, FileText, Database, ShieldCheck, Star, Users, Workflow, Search, Goal, ArrowRight, Smartphone, MessageSquare, IndianRupee, Languages, Cloud, UserCheck, Bell, Check, FileX2, Rocket, KeyRound, UserCog, DatabaseZap, ShieldHalf, BadgeCheck, MessageCircle, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/logo';
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';


const AnimatedSection = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (ref.current) {
                        observer.unobserve(ref.current);
                    }
                }
            },
            {
                rootMargin: '0px',
                threshold: 0.1,
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <section
            ref={ref}
            className={cn(
                'py-20 md:py-28 transition-all duration-700 ease-out',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
                className
            )}
            {...props}
        >
            {children}
        </section>
    );
};

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.04 2C6.58 2 2.15 6.53 2.15 12.11c0 1.85.5 3.6 1.39 5.14L2.5 22l5.02-1.34a9.921 9.921 0 0 0 4.52 1.18h.01c5.56 0 10.01-4.53 10.01-10.11S17.6 2 12.04 2zM9.51 17.43c-.24.13-.53.2-1.12.35-.59.15-1.18.16-1.63.1-.45-.06-1.12-.22-1.63-.73-.51-.51-.87-1.13-.98-1.34-.11-.21-.77-1.34-.77-2.58s.8-2.25 1.1-2.52c.3-.27.65-.35.88-.35.22 0 .41.02.58.03.22.02.36.03.5.25.13.21.48.9.53 1 .05.1.08.21.03.34-.05.13-.08.21-.15.3-.08.08-.15.18-.27.3s-.22.25-.33.39c-.1.14-.2.27-.08.52.13.25.61 1.05 1.25 1.63.85.8 1.55 1.1 1.78 1.23.23.13.36.1.51.05.15-.05.65-.3 1.25-.61s1.02-1.01 1.18-1.34c.16-.34.33-.52.55-.52.22,0,.41-.02.59.08.18.1.41.48.48.56s.25.21.28.34c.03.13.03.73-.21 1.34-.24.61-1.55 1.83-1.8 2.06-.25.22-.48.33-.75.33-.27.01-1.72-3-1.72-3z"/>
    </svg>
);

const GoogleDriveIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M7.71 5l-4.86 8.42l1.63 2.82h14.97l1.63-2.82L16.29 5H7.71zM8.5 17.5l-3.3-5.71l-1.63 2.82L8.5 20.32l3.29-5.71h-6.6zM15.5 17.5l3.3-5.71l1.63 2.82L15.5 20.32l-3.29-5.71h6.6z"/>
    </svg>
);


export default function LandingPage() {
  const features = [
    {
      icon: <Database className="h-8 w-8 text-primary" />,
      title: 'Simple Customer CRM',
      description: 'Easily store customer details, track service history, and manage documents all in one place.',
    },
    {
      icon: <Workflow className="h-8 w-8 text-primary" />,
      title: 'Streamlined Service Hub',
      description: 'Manage all your service requests with a visual Kanban board, from pending to completed.',
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Simple Marketing Tools',
      description: 'Send promotional offers and reminders via SMS & WhatsApp to specific customer segments.',
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: 'Simple Billing',
      description: 'Generate invoices with a single click and keep track of all payments effortlessly.',
    },
    {
      icon: (
        <div className="flex items-center space-x-2">
            <WhatsAppIcon className="h-8 w-8 text-green-500" />
            <Mail className="h-8 w-8 text-blue-500" />
            <Phone className="h-7 w-7 text-gray-600" />
            <MessageSquare className="h-7 w-7 text-sky-500" />
        </div>
      ),
      title: 'Multi-Channel Communication',
      description: 'Engage with your customers through their preferred channels: SMS, Email, WhatsApp, and automated voice calls.',
    },
    {
      icon: <GoogleDriveIcon className="h-8 w-8 text-primary" />,
      title: 'Secure Document Storage',
      description: "Store scanned documents in your own Google Drive, so you always have control over your customers' data.",
    },
    {
      icon: <Bell className="h-8 w-8 text-primary" />,
      title: 'Automated Expiry Alerts',
      description: 'Never miss a renewal. Automatically track document expiry dates and notify customers in advance.',
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: 'Role-Based Security & Control',
      description: 'Assign specific roles to your employees, ensuring they only access the information and features they need to.',
    },
     {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: 'AI-Powered Analytics',
      description: 'Get AI-generated performance reports and customer insights to make smarter business decisions.',
    },
  ];

  const testimonials = [
      {
          name: 'Sunil P.',
          role: 'Akshaya Center Owner, Thrissur',
          avatar: 'https://placehold.co/100x100.png',
          testimonial: 'This CRM has transformed my Akshaya Center. Managing services and marketing is now so simple. The built-in calling feature is a huge plus!',
          rating: 5,
      },
      {
          name: 'Geetha N.',
          role: 'Akshaya Entrepreneur, Kozhikode',
          avatar: 'https://placehold.co/100x100.png',
          testimonial: "The customer management dashboard is fantastic. We can track all our transactions and history in one place. It has made us much more efficient.",
          rating: 5,
      },
      {
          name: 'Rajesh K.',
          role: 'e-Center Operator, Kochi',
          avatar: 'https://placehold.co/100x100.png',
          testimonial: 'The marketing tools are surprisingly effective. Sending promotional messages via WhatsApp has brought in more customers for us. A must-have tool!',
          rating: 4,
      }
  ]

  const howItWorks = [
    {
      icon: <Workflow className="h-10 w-10 text-primary" />,
      title: 'Sign Up & Configure',
      description: 'Create your account in minutes and configure your Akshaya Center details and services.',
    },
    {
      icon: <Search className="h-10 w-10 text-primary" />,
      title: 'Manage & Transact',
      description: 'Use the all-in-one dashboard to manage services, bill customers, and track payments seamlessly.',
    },
    {
      icon: <Goal className="h-10 w-10 text-primary" />,
      title: 'Analyze & Grow',
      description: 'Leverage analytics and marketing tools to understand your performance and grow your customer base.',
    },
  ];
  
  const pricingTiers = [
    {
        name: "Starter",
        price: null,
        period: null,
        description: "For new centers getting started.",
        features: [
            "Up to 100 Customers",
            "Service Management",
            "Billing & Invoicing",
            "Payment Tracking (UPI, Card, Cash)",
            "Cloud Backup & Security",
            "1 User Included",
            "Community Support"
        ],
        cta: "Contact Sales",
    },
    {
        name: "Professional",
        price: null,
        period: null,
        description: "For growing centers that need more power.",
        features: [
            "Up to 1000 Customers",
            "Everything in Starter, plus:",
            "Built-in Calling & CRM",
            "Customer Service Alerts (SMS, WhatsApp)",
            "Digital Marketing Tools",
            "Advanced Analytics & Reports",
            "Multi-User Access (1 User included)",
            "₹300/month for each additional user",
            "Priority Email Support"
        ],
        cta: "Contact Sales",
        popular: true
    },
    {
        name: "Enterprise",
        price: null,
        description: "For large centers or multi-location businesses.",
        features: [
            "Unlimited Customers",
            "All Professional Features",
            "Unlimited User Access",
            "Dedicated Account Manager",
            "Custom Integrations",
            "24/7 Premium Support",
        ],
        cta: "Contact Sales"
    }
  ]

  const securityFeatures = [
    {
        icon: <GoogleDriveIcon className="h-8 w-8 text-primary" />,
        title: "Your Data, Your Drive",
        description: "Uploaded documents are stored in your own Google Drive, ensuring you always have control and ownership."
    },
    {
        icon: <UserCog className="h-8 w-8 text-primary" />,
        title: "Role-Based Access Control",
        description: "Assign specific roles to your employees, ensuring they only access the information and features they need to perform their jobs."
    },
    {
        icon: <ShieldCheck className="h-8 w-8 text-primary" />,
        title: "End-to-End Data Protection",
        description: "Your data is encrypted both in transit (using SSL/TLS) and at rest, ensuring it is protected at all stages from unauthorized access."
    },
    {
        icon: <KeyRound className="h-8 w-8 text-primary" />,
        title: "Secure Authentication",
        description: "We enforce strong password policies and secure login mechanisms to protect your center's account from unauthorized entry."
    },
    {
        icon: <BadgeCheck className="h-8 w-8 text-primary" />,
        title: "Built on Compliant Infrastructure",
        description: "Our platform is hosted on secure infrastructure that complies with global standards like SOC 2 and ISO 27001."
    },
     {
        icon: <ShieldHalf className="h-8 w-8 text-primary" />,
        title: "Regular Security Audits",
        description: "We conduct periodic security audits and vulnerability scanning to proactively protect your data and ensure system integrity."
    },
  ];


  return (
    <div className="bg-background text-foreground">
      <main className='container'>
        <section className="relative overflow-hidden py-20 md:py-32 text-center rounded-xl">
            <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent from-0% to-40%"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent from-0% to-20%"></div>
             <div
                aria-hidden="true"
                className="absolute inset-0 z-[-1] grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
            >
                <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
                <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
            </div>
          <div className="max-w-4xl mx-auto relative">
            <Badge variant="outline" className="mb-6 border-primary/30 text-primary font-semibold bg-background/50 backdrop-blur-sm">
                Simple CRM & Marketing for Service Centers
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
              The Simple CRM & Marketing Tool for Your Service Center
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Stop juggling spreadsheets. Deepen customer relationships and drive repeat business with a simple platform for customer management, targeted marketing, and service tracking.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild className="group">
                <Link href="/dashboard">
                    Start Your Free Trial
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                 <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <AnimatedSection id="features">
           <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold">A CRM That Works The Way You Do</h2>
                <p className="mt-4 text-muted-foreground">
                    From managing customer data to launching marketing campaigns, our features are built to streamline your center's operations.
                </p>
            </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                <CardHeader>
                  <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>

        {/* Anti-Spreadsheet Section */}
        <AnimatedSection className="bg-muted/50 rounded-xl">
            <div className="grid md:grid-cols-2 items-center gap-12">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold">Ready to Break Up with Your Spreadsheet?</h2>
                    <p className="mt-4 text-muted-foreground">We know you have a "final_v3_real_final.xlsx" file somewhere. It's time to let go of the chaos.</p>
                    <ul className="mt-6 space-y-3 text-left">
                        <li className="flex items-start gap-3">
                            <FileX2 className="h-6 w-6 text-destructive mt-1 shrink-0" />
                            <span><strong className='text-foreground'>No more endless tabs.</strong> All your services, customers, and payments in one unified dashboard.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <FileX2 className="h-6 w-6 text-destructive mt-1 shrink-0" />
                            <span><strong className='text-foreground'>No more broken formulas.</strong> Automate your billing and reporting with 100% accuracy.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Rocket className="h-6 w-6 text-green-500 mt-1 shrink-0" />
                            <span><strong className='text-foreground'>Just streamlined operations.</strong> Save time, reduce errors, and focus on growing your business.</span>
                        </li>
                    </ul>
                </div>
                <div className="flex justify-center">
                    <Image src="https://iili.io/FQXrBLJ.png" alt="Illustration of a messy spreadsheet turning into a clean dashboard" width={500} height={400} className="rounded-lg shadow-2xl" data-ai-hint="spreadsheet illustration" />
                </div>
            </div>
        </AnimatedSection>
        
        {/* How It Works Section */}
        <AnimatedSection id="how-it-works">
             <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold">Go Digital in 3 Simple Steps</h2>
                <p className="mt-4 text-muted-foreground">
                    Our platform is intuitive and easy to set up. Get your Akshaya Center online in minutes.
                </p>
            </div>
            <div className="relative mt-16 max-w-5xl mx-auto">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 hidden md:block" />
                <div className="grid md:grid-cols-3 gap-12 relative">
                    {howItWorks.map((step, index) => (
                         <div key={index} className="flex flex-col items-center text-center p-6 rounded-lg bg-background transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20 shadow-lg text-primary">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </AnimatedSection>
        
        {/* Security Section */}
        <AnimatedSection id="security" className="bg-muted/50 rounded-xl">
             <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold">Your Data, Your Trust, Our Priority</h2>
                <p className="mt-4 text-muted-foreground">
                    We're committed to the highest standards of security, so you can focus on your business with peace of mind.
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
                {securityFeatures.map((feature) => (
                    <div key={feature.title} className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg w-fit h-fit">
                           {feature.icon}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">{feature.title}</h3>
                            <p className="text-muted-foreground mt-1">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </AnimatedSection>

        {/* Pricing Section */}
        <AnimatedSection id="pricing">
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
                <p className="mt-4 text-muted-foreground">
                    Choose the plan that's right for your Akshaya Center. No hidden fees.
                </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
                {pricingTiers.map((tier) => (
                    <Card key={tier.name} className={cn("flex flex-col", tier.popular && "border-primary shadow-2xl relative")}>
                        {tier.popular && (
                            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
                        )}
                        <CardHeader>
                            <CardTitle className="text-2xl">{tier.name}</CardTitle>
                            <CardDescription>{tier.description}</CardDescription>
                            <div className="flex items-center h-10">
                                {tier.price && <IndianRupee className="h-8 w-8 mr-1" />}
                                <span className="text-4xl font-bold">{tier.price}</span>
                                {tier.period && <span className="text-muted-foreground self-end mb-1 ml-1">{tier.period}</span>}
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                           <ul className="space-y-3">
                                {tier.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <Check className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                                        <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                           </ul>
                        </CardContent>
                         <div className="p-6">
                            <Button className="w-full" variant={tier.popular ? 'default' : 'outline'}>{tier.cta}</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </AnimatedSection>

        {/* Testimonials Section */}
        <AnimatedSection id="testimonials">
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold">Trusted by Akshaya Entrepreneurs in Kerala</h2>
                 <p className="mt-4 text-muted-foreground">
                    See how SNAP GRID is helping Akshaya centers across the state succeed.
                </p>
            </div>
            <div className="mt-12">
                 <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full max-w-5xl mx-auto"
                >
                    <CarouselContent>
                        {testimonials.map((testimonial, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                 <div className="p-1 h-full">
                                    <Card className="flex flex-col justify-between h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                                        <CardHeader>
                                           <div className="flex items-center gap-4">
                                                <Avatar>
                                                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint="person avatar" />
                                                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold">{testimonial.name}</p>
                                                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                                </div>
                                           </div>
                                        </CardHeader>
                                        <CardContent>
                                            <blockquote className="text-muted-foreground italic">"{testimonial.testimonial}"</blockquote>
                                        </CardContent>
                                        <div className="p-6 pt-0 flex gap-1">
                                            {Array.from({length: 5}).map((_, i) => (
                                                <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} />
                                            ))}
                                        </div>
                                    </Card>
                                 </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </AnimatedSection>

         {/* CTA Section */}
        <AnimatedSection className="text-center bg-primary/10 rounded-xl">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Grow Your Akshaya Center?</h2>
                <p className="text-muted-foreground mb-8">
                    Join hundreds of smart entrepreneurs and take control of your business today. Get started for free, no credit card required.
                </p>
                <Button size="lg" asChild className="group">
                    <Link href="/dashboard">
                        Start Your Free Trial
                        <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </Button>
            </div>
        </AnimatedSection>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <Logo className="h-5 w-5" />
                <span className="font-semibold">SNAP GRID</span>
            </div>
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} SNAP GRID. All rights reserved.</p>
             <div className="flex items-center gap-4 text-muted-foreground">
                <Link href="#" className="text-sm hover:text-foreground transition-colors">Privacy Policy</Link>
                <Link href="#" className="text-sm hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
