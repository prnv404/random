
'use client';
import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';


const mockFeedback = [
    {
        id: 'fb-1',
        customerName: 'Priya Sharma',
        customerAvatar: 'https://i.pravatar.cc/150?u=priya',
        employeeName: 'Anjali Nair',
        serviceName: 'Passport Application',
        rating: 5,
        comment: 'Excellent service! The process was very smooth and Anjali was extremely helpful and knowledgeable. Got my application done in no time.',
    },
    {
        id: 'fb-2',
        customerName: 'Amit Kumar',
        customerAvatar: 'https://i.pravatar.cc/150?u=amit',
        employeeName: 'Suresh Menon',
        serviceName: 'PAN Card',
        rating: 3,
        comment: 'Good experience overall, but there was a bit of a wait and Suresh seemed a little busy. Happy with the outcome though.',
    },
    {
        id: 'fb-3',
        customerName: 'Rohan Desai',
        customerAvatar: 'https://i.pravatar.cc/150?u=rohan',
        employeeName: 'Anjali Nair',
        serviceName: 'Property Tax Payment',
        rating: 2,
        comment: 'The payment failed twice and the staff member, Anjali, could not figure out why. I had to come back the next day. Very frustrating experience.',
    },
    {
        id: 'fb-4',
        customerName: 'Sunita Joshi',
        customerAvatar: 'https://i.pravatar.cc/150?u=sunita',
        employeeName: 'Bipin George',
        serviceName: 'Water Bill',
        rating: 4,
        comment: 'Quick and efficient service from Bipin. He explained the process clearly. I would recommend this center.',
    },
     {
        id: 'fb-5',
        customerName: 'Vijay Singh',
        customerAvatar: 'https://i.pravatar.cc/150?u=vijay',
        employeeName: 'Suresh Menon',
        serviceName: 'Driving License',
        rating: 5,
        comment: 'Suresh was very professional. He guided me through all the steps for the license application.',
    },
    {
        id: 'fb-6',
        customerName: 'Meera Patel',
        customerAvatar: 'https://i.pravatar.cc/150?u=meera',
        employeeName: 'Bipin George',
        serviceName: 'Aadhaar Update',
        rating: 5,
        comment: 'Bipin was amazing! So patient and quick. The best experience I\'ve had at a service center.',
    },
    {
        id: 'fb-7',
        customerName: 'Karan Verma',
        customerAvatar: 'https://i.pravatar.cc/150?u=karan',
        employeeName: 'Anjali Nair',
        serviceName: 'PAN Card',
        rating: 4,
        comment: 'Everything went smoothly. Anjali is very efficient. Just a small suggestion to improve the seating area.',
    }
];

type Feedback = typeof mockFeedback[0];

const FeedbackCard = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="flex items-start gap-4 p-4 border-b last:border-b-0">
            <Avatar className="h-10 w-10 border">
                <AvatarImage src={feedback.customerAvatar} alt={feedback.customerName} data-ai-hint="person avatar" />
                <AvatarFallback>{feedback.customerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-sm">{feedback.customerName}</p>
                        <p className="text-xs text-muted-foreground">{feedback.serviceName} by {feedback.employeeName}</p>
                    </div>
                     <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={cn("h-4 w-4", i < feedback.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30')} />
                        ))}
                    </div>
                </div>
                 <p className="text-sm text-muted-foreground mt-2 italic">"{feedback.comment}"</p>
            </div>
        </div>
    )
}

const FeedbackSummary = () => {
    const summary = useMemo(() => {
        const totalReviews = mockFeedback.length;
        if (totalReviews === 0) return { averageRating: 0, totalReviews: 0, distribution: [] };

        const totalRating = mockFeedback.reduce((acc, fb) => acc + fb.rating, 0);
        const averageRating = totalRating / totalReviews;

        const distribution = [5, 4, 3, 2, 1].map(rating => {
            const count = mockFeedback.filter(fb => fb.rating === rating).length;
            return {
                rating,
                count,
                percentage: (count / totalReviews) * 100,
            };
        });

        return {
            averageRating: parseFloat(averageRating.toFixed(1)),
            totalReviews,
            distribution,
        };
    }, []);

    return (
        <div className="p-6">
            <div className="flex flex-col items-center justify-center gap-2 mb-6">
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <div className="flex items-center gap-2">
                    <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
                    <span className="text-4xl font-bold">{summary.averageRating}</span>
                    <span className="text-sm text-muted-foreground self-end">/ 5</span>
                </div>
                <p className="text-xs text-muted-foreground">Based on {summary.totalReviews} reviews</p>
            </div>

            <div className="space-y-3">
                {summary.distribution.map(item => (
                    <div key={item.rating} className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1 w-12">
                           <span>{item.rating}</span>
                           <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                        </div>
                        <Progress value={item.percentage} className="h-2 flex-1" />
                        <span className="w-10 text-right font-medium">{item.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const FeedbackAnalytics = () => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Customer Feedback Analytics</CardTitle>
                    <Badge variant="outline" className="text-green-600 border-green-600/40">Coming Soon</Badge>
                </div>
                <CardDescription>
                    A live look at your service quality and what customers are saying.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
            <div className="grid md:grid-cols-2">
                <FeedbackSummary />
                <div className="border-l">
                    <ScrollArea className="h-[480px]">
                    {mockFeedback.map(feedback => (
                        <FeedbackCard key={feedback.id} feedback={feedback} />
                    ))}
                    </ScrollArea>
                </div>
            </div>
            </CardContent>
        </Card>
    )
};

export { mockFeedback };
