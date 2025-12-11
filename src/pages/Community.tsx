import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  Users,
  TrendingUp,
  Calendar,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const successStories = [
  {
    id: 1,
    title: 'How Green Valley Restaurant Saved 10,000 Meals',
    excerpt: 'From food waste to feeding families - one restaurant\'s journey to making a difference.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600',
    author: 'Maria Santos',
    role: 'Owner, Green Valley Restaurant',
    date: 'Dec 8, 2024',
    likes: 234,
    comments: 45,
    category: 'Success Story',
  },
  {
    id: 2,
    title: 'Volunteer Spotlight: Alex\'s 500th Delivery',
    excerpt: 'Meet Alex Johnson, who has completed 500 food deliveries and counting.',
    image: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=600',
    author: 'Community Team',
    role: 'ZeroWaste Connect',
    date: 'Dec 5, 2024',
    likes: 567,
    comments: 89,
    category: 'Volunteer Spotlight',
  },
  {
    id: 3,
    title: 'Hope Community Center: Feeding Families Daily',
    excerpt: 'How one community center serves 200 families every week through food redistribution.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600',
    author: 'Sarah Chen',
    role: 'Director, Hope Community Center',
    date: 'Dec 2, 2024',
    likes: 189,
    comments: 32,
    category: 'Community Impact',
  },
];

const tips = [
  {
    icon: Sparkles,
    title: 'Food Storage Best Practices',
    description: 'Learn how to properly store different food types to maximize freshness.',
  },
  {
    icon: TrendingUp,
    title: 'Reducing Restaurant Waste',
    description: 'Tips for restaurants to minimize food waste while donating surplus.',
  },
  {
    icon: Calendar,
    title: 'Planning Effective Pickups',
    description: 'Schedule pickups at optimal times for best food quality.',
  },
];

const upcomingEvents = [
  {
    title: 'Community Food Drive',
    date: 'Dec 15, 2024',
    location: 'Central Park',
    attendees: 156,
  },
  {
    title: 'Volunteer Training Session',
    date: 'Dec 18, 2024',
    location: 'Online',
    attendees: 42,
  },
  {
    title: 'Restaurant Partner Workshop',
    date: 'Dec 22, 2024',
    location: 'City Hall',
    attendees: 28,
  },
];

export default function Community() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-nature-gradient py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-4">
              <Users className="h-3 w-3 mr-1" />
              50,000+ Community Members
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Community <span className="text-gradient">Stories & Tips</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get inspired by stories from our community, learn best practices, and connect with others fighting food waste.
            </p>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Featured Stories</h2>
                <p className="text-muted-foreground">Real impact from real people</p>
              </div>
              <Button variant="outline">
                View All Stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {successStories.map((story) => (
                <Card key={story.id} variant="interactive" className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-3 left-3" variant="secondary">
                      {story.category}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{story.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {story.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">{story.author}</p>
                        <p className="text-xs text-muted-foreground">{story.date}</p>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {story.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {story.comments}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Tips & Events */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Tips */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Food Safety & Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tips.map((tip) => (
                    <div
                      key={tip.title}
                      className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="p-2 rounded-lg bg-primary/10">
                        <tip.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Tips
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-accent-foreground" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.title}
                      className="flex items-start justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div>
                        <h4 className="font-medium mb-1">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                        <p className="text-xs text-muted-foreground">{event.location}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="muted">
                          <Users className="h-3 w-3 mr-1" />
                          {event.attendees}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Events
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
