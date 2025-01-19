"use client"

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2, Upload, Building2, Phone, Mail, CreditCard, Facebook, MessageCircle, Camera, Instagram, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const settingsFormSchema = z.object({
  restaurantName: z.string().min(2, 'Tên không được để trống'),
  logoUrl: z.string().optional(),
  description: z.string().optional(),
  contactInfo: z.object({
    address: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
    phone: z.string().min(10, 'Số điện thoại không chính xác'),
    email: z.string().email().optional(),
    bankAccount: z.object({
      bankName: z.string().min(2, 'Tên ngân hàng không chính xác'),
      accountNumber: z.string().min(5, 'Số tài khoản không chính xác'),
      accountName: z.string().min(2, 'Tên tài khoản không chính xác'),
    }).optional(),
  }),
  socialMedia: z.object({
    facebook: z.string().url().optional(),
    zalo: z.string().optional(),
    instagram: z.string().url().optional(),
  }).optional(),
  notifications: z.object({
    enableEmail: z.boolean().default(false),
    enableTelegram: z.boolean().default(false),
    enableMessenger: z.boolean().default(false),
  }).optional(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

const defaultValues: Partial<SettingsFormValues> = {
  restaurantName: '',
  description: '',
  contactInfo: {
    address: '',
    phone: '',
    email: '',
    bankAccount: {
      bankName: '',
      accountNumber: '',
      accountName: '',
    },
  },
  socialMedia: {
    facebook: '',
    zalo: '',
    instagram: '',
  },
  notifications: {
    enableEmail: false,
    enableTelegram: false,
    enableMessenger: false,
  },
};

export default function App() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
  });

  async function onSubmit(data: SettingsFormValues) {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success("Your settings have been saved successfully.",);
    
    setIsLoading(false);
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-orange-50">
          <TabsTrigger value="general" className="data-[state=active]:bg-orange-500 border-l-2 data-[state=active]:text-white">
            General
          </TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Contact
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Notifications
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>
                    Update your restaurant profile information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={form.watch('logoUrl')} />
                      <AvatarFallback className="bg-orange-100">
                        <Camera className="h-8 w-8 text-orange-500" />
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" className="space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Upload Logo</span>
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name="restaurantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restaurant Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter restaurant name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your restaurant"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Social Media</CardTitle>
                  <CardDescription>
                    Connect your social media accounts.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="socialMedia.facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <div className="flex space-x-2">
                            <Facebook className="h-5 w-5 text-blue-600" />
                            <Input placeholder="Facebook profile URL" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialMedia.zalo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zalo</FormLabel>
                        <FormControl>
                          <div className="flex space-x-2">
                            <MessageCircle className="h-5 w-5 text-blue-500" />
                            <Input placeholder="Zalo ID" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialMedia.instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <div className="flex space-x-2">
                            <Instagram className="h-5 w-5 text-pink-600" />
                            <Input placeholder="Instagram profile URL" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Update your contact details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="contactInfo.address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <div className="flex space-x-2">
                            <Building2 className="h-5 w-5 text-orange-500" />
                            <Input placeholder="Restaurant address" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactInfo.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <div className="flex space-x-2">
                            <Phone className="h-5 w-5 text-orange-500" />
                            <Input placeholder="Contact phone number" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactInfo.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="flex space-x-2">
                            <Mail className="h-5 w-5 text-orange-500" />
                            <Input placeholder="Contact email" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bank Account</CardTitle>
                  <CardDescription>
                    Add your bank account details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="contactInfo.bankAccount.bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <div className="flex space-x-2">
                            <CreditCard className="h-5 w-5 text-orange-500" />
                            <Input placeholder="Enter bank name" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactInfo.bankAccount.accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter account number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactInfo.bankAccount.accountName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter account name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how you want to receive notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="notifications.enableEmail"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Email Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive notifications via email
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notifications.enableTelegram"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Telegram Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive notifications via Telegram
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notifications.enableMessenger"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Messenger Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive notifications via Messenger
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600"
                disabled={isLoading}
              >
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}