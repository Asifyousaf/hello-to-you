
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );
    
    // Get the session to identify the user
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();
    
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const { action, post } = await req.json();
    
    if (action === 'create') {
      // Create a new post
      const { data, error } = await supabaseClient
        .from('community_posts')
        .insert({
          user_id: session.user.id,
          content: post.content,
          title: post.title,
          category: post.category,
          image_url: post.image_url || null,
        })
        .select('*, profiles(full_name, avatar_url)');
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'list') {
      // List posts with user information
      const { data, error } = await supabaseClient
        .from('community_posts')
        .select('*, profiles(full_name, avatar_url)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'like') {
      // Like/unlike a post
      const postId = post.id;
      
      // Check if user has already liked the post
      const { data: existingLike, error: likeCheckError } = await supabaseClient
        .from('post_likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      if (likeCheckError) throw likeCheckError;
      
      if (existingLike) {
        // Remove the like
        const { error: unlikeError } = await supabaseClient
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', session.user.id);
        
        if (unlikeError) throw unlikeError;
        
        // Decrement the likes count
        const { data: updatedPost, error: updateError } = await supabaseClient
          .from('community_posts')
          .update({ likes_count: post.likes_count - 1 })
          .eq('id', postId)
          .select();
        
        if (updateError) throw updateError;
        
        return new Response(
          JSON.stringify({ action: 'unliked', post: updatedPost[0] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        // Add the like
        const { error: likeError } = await supabaseClient
          .from('post_likes')
          .insert({ post_id: postId, user_id: session.user.id });
        
        if (likeError) throw likeError;
        
        // Increment the likes count
        const { data: updatedPost, error: updateError } = await supabaseClient
          .from('community_posts')
          .update({ likes_count: post.likes_count + 1 })
          .eq('id', postId)
          .select();
        
        if (updateError) throw updateError;
        
        return new Response(
          JSON.stringify({ action: 'liked', post: updatedPost[0] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
