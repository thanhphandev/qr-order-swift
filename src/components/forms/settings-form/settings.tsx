"use client"

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useForm, useFieldArray } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SettingsFormSchema, SettingsFormValues } from '@/schemas/settings';
import { createOrUpdateSettings } from '@/actions/settings.action';
import { toast } from 'sonner';
import LogoUpload from '@/components/forms/settings-form/logo-upload';

const SettingsForm = ({ initialData }: { initialData?: SettingsFormValues | null }) => {
    const [loading, setLoading] = useState(false);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(SettingsFormSchema),
        defaultValues: initialData || {
            restaurantName: "",
            logoUrl: "",
            description: "",
            tables: 0,
            tablesPerZone: [],
            contactInfo: { address: "", phone: "", email: "" },
            bankAccount: { bankName: "", accountNumber: "", accountName: "" },
            socialMedia: { facebook: "", zalo: "", instagram: "" },
            telegramToken: "",
            chatId: ""
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "tablesPerZone"
    });

    const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        const value = e.target.value;
        field.onChange(value === '' ? 0 : parseInt(value, 10));
    };

    const onSubmit = async (values: SettingsFormValues) => {
        try {
            setLoading(true);
            await createOrUpdateSettings(values);
            toast.success('Cài đặt đã được lưu');
        } catch (error) {
            toast.error('Lỗi khi lưu cài đặt');
        } finally {
            setLoading(false);
        }
    };

    const FormSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <Card className="transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-orange-800">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {children}
            </CardContent>
        </Card>
    );

    return (
        <div className="container max-w-5xl mx-auto p-4 space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Logo Section */}
                    <div className="flex justify-center">
                        <FormField
                            control={form.control}
                            name="logoUrl"
                            render={({ field: { value, onChange } }) => (
                                <FormItem>
                                    <FormLabel className="cursor-pointer">
                                        <LogoUpload value={value || ''} onChange={onChange} />
                                        <input type="hidden" name="image" value={value || ''} />
                                    </FormLabel>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Basic Information */}
                    <FormSection title="Thông tin cơ bản">
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="restaurantName"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Tên nhà hàng</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập tên nhà hàng" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Mô tả</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Mô tả về nhà hàng" className="resize-none h-24" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="tables"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tổng số bàn</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="1"
                                                placeholder="Nhập số bàn"
                                                onChange={(e) => handleNumberInput(e, field)}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-center justify-between">
                                <FormLabel className="text-base">Phân bổ bàn theo khu vực</FormLabel>
                                <Button
                                    type="button"
                                    onClick={() => append({ zone: '', count: 1 })}
                                    className="bg-orange-500 hover:bg-orange-600"
                                    size="sm"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Thêm khu vực
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-3 items-start">
                                        <FormField
                                            control={form.control}
                                            name={`tablesPerZone.${index}.zone`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input placeholder="Tên khu vực" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`tablesPerZone.${index}.count`}
                                            render={({ field }) => (
                                                <FormItem className="w-28">
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            placeholder="Số bàn"
                                                            onChange={(e) => handleNumberInput(e, field)}
                                                            value={field.value || ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => remove(index)}
                                            className="shrink-0"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FormSection>

                    {/* Contact Information */}
                    <FormSection title="Thông tin liên hệ">
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="contactInfo.address"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Địa chỉ</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập địa chỉ" {...field} />
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
                                        <FormLabel>Số điện thoại</FormLabel>
                                        <FormControl>
                                            <Input type="tel" placeholder="Nhập số điện thoại" {...field} />
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
                                            <Input type="email" placeholder="Nhập email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </FormSection>

                    {/* Bank Account */}
                    <FormSection title="Tài khoản ngân hàng">
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="bankAccount.bankName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên ngân hàng</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập tên ngân hàng" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bankAccount.accountNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số tài khoản</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập số tài khoản" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bankAccount.accountName"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Tên chủ tài khoản</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập tên chủ tài khoản" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </FormSection>

                    {/* Social Media */}
                    <FormSection title="Mạng xã hội">
                        <div className="grid gap-4 md:grid-cols-3">
                            <FormField
                                control={form.control}
                                name="socialMedia.facebook"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Facebook</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Link Facebook" {...field} />
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
                                            <Input placeholder="ID Zalo" {...field} />
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
                                            <Input placeholder="Tài khoản Instagram" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </FormSection>

                    {/* Telegram Token */}
                    <FormSection title="Cài đặt Bot">
                        <FormField
                            control={form.control}
                            name="telegramToken"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telegram Bot Token</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập token bot Telegram" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="chatId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>chatID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập ChatID Telegram" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </FormSection>

                    <Button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 rounded-xl text-white font-semibold transition-colors"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            'Lưu cài đặt'
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default SettingsForm;