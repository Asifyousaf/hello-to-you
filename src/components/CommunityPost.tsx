
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface CommunityPostProps {
  post: {
    id: string;
    author: {
      name: string;
      avatar: string;
      username: string;
    };
    content: string;
    image?: string;
    likes: number;
    comments: number;
    timePosted: string;
    likedByMe?: boolean;
  };
}

const CommunityPost = ({ post }: CommunityPostProps) => {
  const [liked, setLiked] = useState(post.likedByMe || false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  
  const handleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };
  
  const handleShare = () => {
    toast({
      title: "Post shared",
      description: "The post has been shared to your profile",
    });
  };
  
  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="p-4 pb-2 flex flex-row items-center space-y-0">
        <div className="flex items-center flex-1">
          <Avatar className="h-10 w-10 mr-3 border">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{post.author.name}</div>
            <div className="text-xs text-gray-500">@{post.author.username} • {post.timePosted}</div>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <p className="mb-4">{post.content}</p>
        {post.image && (
          <div className="rounded-md overflow-hidden mb-2">
            <img src={post.image} alt="Post content" className="w-full object-cover" />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-2 border-t flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLike} 
          className={`flex items-center ${liked ? 'text-red-500' : 'text-gray-500'}`}
        >
          <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-red-500' : ''}`} />
          {likeCount}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-500"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          {post.comments}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-500"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </CardFooter>
      
      {showComments && (
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex items-center mb-4">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            <input 
              type="text" 
              placeholder="Write a comment..." 
              className="w-full border rounded-full px-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div className="text-center text-sm text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        </div>
      )}
    </Card>
  );
};

export default CommunityPost;
