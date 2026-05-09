import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Heart,
  MessageCircle,
  BookOpen,
  Users,
  TrendingUp,
  Calendar,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { fetchCommunityContent } from '@/lib/api';

const iconByName: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  TrendingUp,
  Calendar,
};

export default function Community() {
  const { data } = useQuery({ queryKey: ['community-content'], queryFn: fetchCommunityContent });
  const stories = data?.stories ?? [];
  const tips = data?.tips ?? [];
  const upcomingEvents = data?.events ?? [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-nature-gradient py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-4">
              <Users className="mr-1 h-3 w-3" />
              Community
            </Badge>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Community <span className="text-gradient">Stories & Tips</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Get inspired by stories from our community and learn best practices.
            </p>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Featured Stories</h2>
                <p className="text-muted-foreground">Real impact from real people</p>
              </div>
              <Button variant="outline">
                View All Stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {stories.map((story) => (
                <Card key={story.id} variant="interactive" className="overflow-hidden">
                  <div className="relative aspect-video">
                    <img
                      src={story.image_url ?? '/placeholder.svg'}
                      alt={story.title}
                      className="h-full w-full object-cover"
                    />
                    <Badge className="absolute left-3 top-3" variant="secondary">
                      {story.category}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{story.title}</h3>
                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                      {story.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">{story.author}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(story.published_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {story.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {story.comments_count}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-2">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Food Safety & Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tips.map((tip) => {
                    const Icon = iconByName[tip.icon] ?? Sparkles;
                    return (
                      <div
                        key={tip.id}
                        className="flex items-start gap-4 rounded-lg bg-muted/30 p-4"
                      >
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="mb-1 font-medium">{tip.title}</h4>
                          <p className="text-sm text-muted-foreground">{tip.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
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
                      key={event.id}
                      className="flex items-start justify-between rounded-lg bg-muted/30 p-4"
                    >
                      <div>
                        <h4 className="mb-1 font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.event_date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">{event.location}</p>
                      </div>
                      <Badge variant="muted">
                        <Users className="mr-1 h-3 w-3" />
                        {event.attendees}
                      </Badge>
                    </div>
                  ))}
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
