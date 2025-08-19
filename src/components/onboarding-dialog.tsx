
'use client';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/contexts/auth-context';
import { updateUserProfile } from '@/services/user';
import type { User } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface OnboardingDialogProps {
    isOpen: boolean;
    user: User;
    onFinished: (user: User) => void;
}

export const OnboardingDialog = ({ isOpen, user, onFinished }: OnboardingDialogProps) => {
    const { authToken } = useAuthContext();
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setPhone(user.phone || '');
        }
    }, [user]);

    const handleSubmit = async () => {
        if (!name || !phone) {
            toast({ variant: 'destructive', title: 'Missing Information', description: 'Please provide both your name and phone number.' });
            return;
        }
        setIsSubmitting(true);
        try {
            const updatedUser = await updateUserProfile(user.id, { name, phone }, authToken);
            toast({ title: 'Profile Updated!', description: 'Your information has been saved successfully.' });
            onFinished(updatedUser);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Update Failed', description: error instanceof Error ? error.message : 'Could not update your profile.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-md" hideCloseButton>
                <DialogHeader>
                    <DialogTitle>Complete Your Profile</DialogTitle>
                    <DialogDescription>
                        Please provide your name and phone number to continue.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? 'Saving...' : 'Save and Continue'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
