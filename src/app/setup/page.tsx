
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, PlusCircle, Trash2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';

export default function SetupPage() {
  const [orgName, setOrgName] = useState('');
  const [orgLogo, setOrgLogo] = useState<string | null>(null);
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  const handleLogoUpload = () => {
    // Simulate logo upload
    setOrgLogo('https://placehold.co/100x100.png');
    toast({
      title: 'Logo Uploaded',
      description: 'A placeholder logo has been set.',
    });
  };

  const handleAddEmail = () => {
    if (currentEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmail) && !invitedEmails.includes(currentEmail)) {
      setInvitedEmails([...invitedEmails, currentEmail]);
      setCurrentEmail('');
    } else if (invitedEmails.includes(currentEmail)) {
         toast({
            variant: 'destructive',
            title: 'Duplicate Email',
            description: 'This email has already been invited.',
        });
    } else {
        toast({
            variant: 'destructive',
            title: 'Invalid Email',
            description: 'Please enter a valid email address.',
        });
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setInvitedEmails(invitedEmails.filter((email) => email !== emailToRemove));
  };
  
  const handleCompleteSetup = () => {
      if(!orgName) {
           toast({
            variant: 'destructive',
            title: 'Organization Name Required',
            description: 'Please enter a name for your organization.',
        });
        return;
      }
      toast({
          title: 'Setup Complete!',
          description: `Welcome to ${orgName}! Redirecting you to the dashboard.`,
      });
      router.push('/dashboard');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
        <div className="flex items-center gap-2 mb-8">
            <Logo className="h-8 w-8 text-primary" />
        </div>
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome! Let's set up your organization.</CardTitle>
          <CardDescription>
            This information will help personalize your experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">1. Organization Details</h3>
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input 
                id="org-name" 
                placeholder="e.g., My Akshaya Center" 
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
                />
            </div>
            <div className="space-y-2">
              <Label>Organization Logo (Optional)</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={orgLogo || undefined} data-ai-hint="logo company" />
                    <AvatarFallback className="text-3xl">{orgName.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
                <Button variant="outline" onClick={handleLogoUpload}>
                    <Upload className="mr-2 h-4 w-4"/> 
                    Upload Logo
                </Button>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">2. Invite Team Members</h3>
            <div className="flex items-center gap-2">
              <Input
                type="email"
                placeholder="Enter email to invite..."
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddEmail()}
              />
              <Button onClick={handleAddEmail}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {invitedEmails.length > 0 && <Label>Pending Invitations</Label>}
              <div className="rounded-md border">
                {invitedEmails.map((email) => (
                  <div key={email} className="flex items-center justify-between p-2 border-b last:border-b-0">
                    <span className="text-sm text-muted-foreground">{email}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleRemoveEmail(email)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" onClick={handleCompleteSetup}>
            Complete Setup & Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
