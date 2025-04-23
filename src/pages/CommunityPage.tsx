
import { useState } from 'react';
import Layout from '../components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UsersRound, Flame, Trophy, Search } from 'lucide-react';
import CommunityPost from '../components/CommunityPost';
import CreatePost from '../components/CreatePost';
import { Input } from "@/components/ui/input";

// Sample community posts
const initialPosts = [
  {
    id: "1",
    author: {
      name: "Emma Watson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      username: "emma_fit"
    },
    content: "Just completed my first 5K run! So proud of this milestone. What started as a personal challenge has become a passion. Anyone else training for a race soon?",
    image: "https://images.unsplash.com/photo-1593352216923-dd286c555f84?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: 42,
    comments: 8,
    timePosted: "2 hours ago"
  },
  {
    id: "2",
    author: {
      name: "Michael Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      username: "mike_fitness"
    },
    content: "Here's my meal prep for the week! High protein, balanced carbs, and healthy fats. Consistency is key to reaching your nutrition goals. What's your favorite meal prep recipe?",
    image: "https://images.unsplash.com/photo-1547496502-affa22d38842?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: 78,
    comments: 16,
    timePosted: "5 hours ago",
    likedByMe: true
  },
  {
    id: "3",
    author: {
      name: "Sarah Lee",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      username: "sarah_yoga"
    },
    content: "Finding inner peace through yoga. After 30 days of daily practice, I've noticed significant improvements in my flexibility and mental clarity. Meditation and mindfulness are truly transformative!",
    likes: 53,
    comments: 7,
    timePosted: "1 day ago"
  }
];

const popularCommunities = [
  { name: "Weight Training", members: 14532 },
  { name: "Runner's World", members: 12256 },
  { name: "Nutrition & Recipes", members: 9874 },
  { name: "Yoga & Meditation", members: 7642 },
  { name: "Fitness Beginners", members: 5321 }
];

const CommunityPage = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleCreatePost = (content: string, image?: string) => {
    const newPost = {
      id: Date.now().toString(),
      author: {
        name: "You",
        avatar: "",
        username: "user123"
      },
      content,
      image,
      likes: 0,
      comments: 0,
      timePosted: "Just now"
    };
    
    setPosts([newPost, ...posts]);
  };
  
  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Layout>
      <div className="pt-24 pb-16 bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Fitness Community</h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8">
            Connect with like-minded individuals, share your fitness journey, and get inspired.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-3/4">
            <Tabs defaultValue="feed" className="w-full mb-6">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="feed">
                    <Flame className="h-4 w-4 mr-2" />
                    Feed
                  </TabsTrigger>
                  <TabsTrigger value="trending">
                    <Trophy className="h-4 w-4 mr-2" />
                    Trending
                  </TabsTrigger>
                </TabsList>
                
                <div className="relative w-full max-w-xs">
                  <Input 
                    type="text" 
                    placeholder="Search posts..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <TabsContent value="feed">
                <CreatePost onPost={handleCreatePost} />
                
                {filteredPosts.length > 0 ? (
                  filteredPosts.map(post => (
                    <CommunityPost key={post.id} post={post} />
                  ))
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-4">No posts matching your search.</p>
                    {searchTerm && (
                      <Button onClick={() => setSearchTerm('')} variant="outline">
                        Clear search
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="trending">
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Trending topics coming soon!</h3>
                  <p className="text-gray-500">We're working on bringing you the hottest fitness topics and trends.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="w-full md:w-1/4">
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <UsersRound className="h-4 w-4 mr-2 text-purple-600" />
                Popular Communities
              </h3>
              <div className="space-y-3">
                {popularCommunities.map((community, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{community.name}</span>
                      <span className="text-xs text-gray-500">{community.members.toLocaleString()} members</span>
                    </div>
                    {index < popularCommunities.length - 1 && <Separator className="mt-2" />}
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                Browse All Communities
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Join the Challenge</h3>
              <p className="text-sm text-gray-700 mb-4">
                Participate in our 30-day fitness challenge and track your progress with the community.
              </p>
              <Button variant="outline" className="w-full border-purple-300 bg-white">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityPage;
