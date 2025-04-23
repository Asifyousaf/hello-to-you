
import { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Image, Smile, MapPin, User, X } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface CreatePostProps {
  onPost: (content: string, image?: string) => void;
  userAvatar?: string;
}

const CreatePost = ({ onPost, userAvatar }: CreatePostProps) => {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const handlePost = () => {
    if (content.trim() === '') {
      toast({
        title: "Cannot post",
        description: "Please write something before posting",
        variant: "destructive"
      });
      return;
    }
    
    setIsPosting(true);
    
    // Simulate posting delay
    setTimeout(() => {
      onPost(content, selectedImage || undefined);
      setContent('');
      setSelectedImage(null);
      setIsPosting(false);
      
      toast({
        title: "Post created",
        description: "Your post has been published to the community"
      });
    }, 1000);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10">
            {userAvatar ? (
              <img src={userAvatar} alt="User avatar" />
            ) : (
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's on your fitness journey?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full resize-none focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-200"
              rows={3}
            />
            
            {selectedImage && (
              <div className="relative mt-2 rounded-md overflow-hidden border">
                <img 
                  src={selectedImage} 
                  alt="Selected" 
                  className="max-h-64 w-full object-contain"
                />
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white text-gray-600 hover:bg-gray-200"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex justify-between">
        <div className="flex space-x-2">
          <label className="cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload}
            />
            <div className="flex items-center text-gray-500 hover:text-purple-500 hover:bg-purple-50 p-2 rounded-md">
              <Image className="h-4 w-4 mr-1" />
              <span className="text-sm">Photo</span>
            </div>
          </label>
          
          <div className="flex items-center text-gray-500 hover:text-purple-500 hover:bg-purple-50 p-2 rounded-md cursor-pointer">
            <Smile className="h-4 w-4 mr-1" />
            <span className="text-sm">Feeling</span>
          </div>
          
          <div className="flex items-center text-gray-500 hover:text-purple-500 hover:bg-purple-50 p-2 rounded-md cursor-pointer">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">Location</span>
          </div>
        </div>
        
        <Button 
          onClick={handlePost}
          disabled={content.trim() === '' || isPosting}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isPosting ? 'Posting...' : 'Post'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreatePost;
