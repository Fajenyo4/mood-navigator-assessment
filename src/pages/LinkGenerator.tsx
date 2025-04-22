
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { generateAccessToken } from '@/utils/accessTokens';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Copy } from 'lucide-react';

const LinkGenerator: React.FC = () => {
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('en');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Generate the access token
      const accessLink = await generateAccessToken(email);
      
      // Add language parameter
      const linkWithLang = `${accessLink}&lang=${language}`;
      
      setGeneratedLink(linkWithLang);
      toast.success("Access link generated successfully!");
    } catch (error: any) {
      console.error('Link generation error:', error);
      toast.error(`Failed to generate link: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Generate Access Link</CardTitle>
          <CardDescription>
            Create an easy access link for users to take the assessment without registration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isGenerating}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select 
                value={language} 
                onValueChange={setLanguage}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="zh-cn">Simplified Chinese</SelectItem>
                  <SelectItem value="zh-hk">Traditional Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : "Generate Access Link"}
            </Button>
            
            {generatedLink && (
              <div className="mt-4 p-3 bg-gray-100 rounded-md relative">
                <p className="text-sm break-all pr-8">{generatedLink}</p>
                <Button
                  variant="ghost"
                  size="sm" 
                  className="absolute top-1 right-1 h-8 w-8 p-0"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkGenerator;
