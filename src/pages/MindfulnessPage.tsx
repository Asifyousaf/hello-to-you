
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Moon, Volume2, Sun, CloudSun, Activity } from "lucide-react";
import MindfulnessSession from '../components/MindfulnessSession';
import useSounds from '../hooks/useSounds';
import { useToast } from "@/components/ui/use-toast";

const MindfulnessPage = () => {
  const [activeSession, setActiveSession] = useState<boolean>(false);
  const [sessionType, setSessionType] = useState<string>('');
  const [sessionDuration, setSessionDuration] = useState<number>(0);
  const { toast } = useToast();
  const sounds = useSounds();
  
  // Preload sounds when the page mounts
  useEffect(() => {
    // Test sound to ensure audio is working
    const testSound = () => {
      if (sounds.isLoaded.chimes) {
        sounds.play('chimes', { volume: 0.3 });
        toast({
          title: "Sound Check",
          description: "If you can't hear the chimes, please check your device's volume settings.",
        });
      } else {
        setTimeout(testSound, 1000); // Try again in a second
      }
    };
    
    // Delay to ensure sounds have time to load
    const timer = setTimeout(testSound, 2000);
    
    return () => {
      clearTimeout(timer);
      sounds.stopAll();
    };
  }, []);

  const handleStartSession = (type: string, duration: number) => {
    setSessionType(type);
    setSessionDuration(duration);
    setActiveSession(true);
    
    // Play a sound to indicate session start
    if (sounds.isLoaded.chimes) {
      sounds.play('chimes', { volume: 0.3 });
    }
  };

  const handleCompleteSession = () => {
    toast({
      title: "Session Completed",
      description: `Great job completing your ${sessionType.toLowerCase()} session!`,
    });
    setActiveSession(false);
    
    // Play completion sound
    if (sounds.isLoaded.chimes) {
      sounds.play('chimes', { volume: 0.5 });
    }
  };

  const handleCancelSession = () => {
    setActiveSession(false);
    
    // Stop any playing sounds
    sounds.stopAll();
  };
  
  const sessions = [
    {
      type: "Meditation",
      icon: <Moon className="h-6 w-6 text-blue-500" />,
      description: "Clear your mind and focus on your breath",
      durations: [5, 10, 15, 20],
      color: "bg-blue-500",
    },
    {
      type: "Deep Breathing",
      icon: <Volume2 className="h-6 w-6 text-green-500" />,
      description: "Reduce stress through controlled breathing",
      durations: [3, 5, 10, 15],
      color: "bg-green-500",
    },
    {
      type: "Body Scan",
      icon: <Activity className="h-6 w-6 text-purple-500" />,
      description: "Tune into your body's sensations",
      durations: [5, 10, 15, 20],
      color: "bg-purple-500",
    },
    {
      type: "Morning Calm",
      icon: <Sun className="h-6 w-6 text-amber-500" />,
      description: "Start your day with clarity and purpose",
      durations: [5, 10, 15],
      color: "bg-amber-500",
    },
    {
      type: "Evening Wind Down",
      icon: <CloudSun className="h-6 w-6 text-indigo-500" />,
      description: "Release tension before sleep",
      durations: [10, 15, 20],
      color: "bg-indigo-500",
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {!activeSession ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Mindfulness Practice</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Take time for yourself with guided mindfulness exercises. Regular practice can reduce stress, 
                improve focus, and enhance overall wellbeing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <Card key={session.type} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className={`p-3 rounded-full ${session.color.replace('bg', 'bg-opacity-20')} mr-3`}>
                        {session.icon}
                      </div>
                      <CardTitle>{session.type}</CardTitle>
                    </div>
                    <CardDescription>{session.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4">Choose duration (minutes):</p>
                    <div className="flex flex-wrap gap-2">
                      {session.durations.map((duration) => (
                        <Button 
                          key={duration}
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStartSession(session.type, duration)}
                          className="flex items-center"
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {duration} min
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Benefits of Mindfulness</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">Reduces Stress</h3>
                  <p className="text-gray-600">
                    Regular mindfulness practice activates your parasympathetic nervous system,
                    reducing stress hormones and promoting calm.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Improves Focus</h3>
                  <p className="text-gray-600">
                    Training your attention through mindfulness enhances concentration and mental clarity,
                    helping you stay focused on tasks.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Enhances Well-being</h3>
                  <p className="text-gray-600">
                    Mindfulness helps you appreciate the present moment, leading to greater
                    overall happiness and satisfaction.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center py-12">
            <MindfulnessSession
              sessionType={sessionType}
              duration={sessionDuration}
              onComplete={handleCompleteSession}
              onCancel={handleCancelSession}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MindfulnessPage;
