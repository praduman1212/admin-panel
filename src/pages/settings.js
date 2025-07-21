import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sun, Moon, User, Shield, Settings, Eye, Lock, Mail, UserCircle, Palette, Monitor, Smartphone } from "lucide-react";
import { useTheme } from "@/context/Theme.context";
import { toast } from "sonner";
import { useAuth } from "@/context/Auth.context";
import { useEffect } from "react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUserProfile, isLoading: authLoading } = useAuth();

  // UI settings state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    avatar: "",
    joinDate: "",
    lastLogin: "",
  });

  // When user changes, update formData
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        avatar: user.photoURL || "",
        joinDate: user.createdAt
          ? new Date(user.createdAt.seconds ? user.createdAt.seconds * 1000 : user.createdAt).toLocaleDateString()
          : "",
        lastLogin: user.lastLogin
          ? new Date(user.lastLogin.seconds ? user.lastLogin.seconds * 1000 : user.lastLogin).toLocaleString()
          : ""
      }));
    }

  }, [user]);


  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      await updateUserProfile({
        name: formData.name,
        email: formData.email,
        // add other fields as needed
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
    setIsLoading(false);
  };

  const handleAppearanceUpdate = (type, value) => {
    if (type === 'darkMode') {
      setTheme(value ? 'dark' : 'light');
      toast.success(`${value ? 'Dark' : 'Light'} mode enabled`);
    } else if (type === 'compactMode') {
      setIsCompactMode(value);
      toast.success(`Compact mode ${value ? 'enabled' : 'disabled'}`);
    }
  };

  const handlePasswordChange = async () => {
    setIsLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Updating password...',
        success: 'Password updated successfully!',
        error: 'Failed to update password',
      }
    );
    setIsLoading(false);
  };

  return (
    <div
      className="min-h-screen transition-all duration-300"
      
    >
      <div className="max-w-7xl mx-auto sm:p-6 lg:p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              <span>Settings</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                <span >Manage your account preferences and customize your experience</span>
              </p>
            </div>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
          <TabsList className="grid w-full h-12 grid-cols-3 lg:w-fit lg:grid-cols-3 bg-white/70 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 backdrop-blur-sm  rounded-xl">
          <TabsTrigger 
            value="profile" 
            className="transition-all duration-200 rounded-lg px-4 py-2.5 border-2 border-transparent data-[state=active]:border-[var(--color,_#6366f1)] data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm text-black dark:text-white"
            
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger 
            value="appearance" 
            className="transition-all duration-200 rounded-lg px-4 py-2.5 border-2 border-transparent data-[state=active]:border-[var(--color,_#6366f1)] data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm text-black dark:text-white"
           
          >
            <Palette className="w-4 h-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="transition-all duration-200 rounded-lg px-4 py-2.5 border-2 border-transparent data-[state=active]:border-[var(--color,_#6366f1)] data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm text-black dark:text-white"
          
          >
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
         
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Profile Card */}
              <Card className="lg:col-span-1 bg-white/70 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <Avatar className="w-24 h-24 border-4 border-blue-500/20">
                      <AvatarImage src={formData.avatar} alt={formData.name} />
                      <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {formData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">
                    {formData.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {formData.email}
                  </CardDescription>
                  <Badge variant="secondary" className="mt-2 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300">
                    {formData.role}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <UserCircle className="w-4 h-4" />
                      <span>Joined {formData.joinDate}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <Eye className="w-4 h-4" />
                      <span>Last active {formData.lastLogin}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Form */}
              <Card className="lg:col-span-2 bg-white/70 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <User className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Update your personal details and profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <UserCircle className="w-4 h-4" />
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Mail className="w-4 h-4" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white transition-colors"
                        />
                      </div>
                    </div>
                    <Separator className="bg-gray-200 dark:bg-gray-700" />
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleProfileUpdate}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 transition-all duration-200"
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="bg-white/70 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Palette className="w-5 h-5" />
                  Appearance Settings
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Customize how the interface looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                        {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                      </div>
                      <div>
                        <Label htmlFor="dark-mode" className="text-base font-medium text-gray-900 dark:text-white">
                          Dark Mode
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Switch between light and dark themes for better viewing experience
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={theme === 'dark'}
                      onCheckedChange={(checked) => handleAppearanceUpdate('darkMode', checked)}
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </div>
                </div>
              
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-white/70 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Manage your account security and password settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Lock className="w-4 h-4" />
                        Current Password
                      </Label>
                      <Input 
                        id="current-password" 
                        type="password" 
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white transition-colors"
                        placeholder="Enter your current password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Lock className="w-4 h-4" />
                        New Password
                      </Label>
                      <Input 
                        id="new-password" 
                        type="password" 
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white transition-colors"
                        placeholder="Enter your new password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Lock className="w-4 h-4" />
                        Confirm New Password
                      </Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white transition-colors"
                        placeholder="Confirm your new password"
                      />
                    </div>
                  </div>
                  <Separator className="bg-gray-200 dark:bg-gray-700" />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handlePasswordChange}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-2 transition-all duration-200"
                    >
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        
        </Tabs>
      </div>
    </div>
  );
}