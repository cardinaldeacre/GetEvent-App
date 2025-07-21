import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout'; // Pastikan ini mengacu pada AuthSplitLayout yang sudah dimodifikasi

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="" description=""> {/* Tetap kosongkan title dan description di sini */}
            <Head title="Login" />

            {/* Ini adalah konten yang akan dirender sebagai 'children' di AuthSplitLayout */}
            {/* Ini adalah bagian FORMULIR LOGIN Anda */}
            <div className="mb-8">
                {/* Logo GetEvent Anda di sini */}
                <img src="images/logo.png" alt="GetEvent Logo" className="h-12 w-auto mx-auto" />
                <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Login to getevent
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Login to getevent to access special features
                </p>
            </div>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Input email or username"
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        tabIndex={2}
                        autoComplete="current-password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Input password"
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="flex items-center">
                    <Checkbox
                        id="show_password"
                        name="show_password"
                        checked={showPassword}
                        onCheckedChange={(checked: boolean) => setShowPassword(checked)}
                    />
                    <Label htmlFor="show_password" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        Show password
                    </Label>

                    {canResetPassword && (
                        <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                            Forgot password?
                        </TextLink>
                    )}
                </div>

                <Button type="submit" className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md" tabIndex={4} disabled={processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                    Login
                </Button>

                <Button
                    type="button"
                    onClick={() => window.location.href = route('register')}
                    className="w-full bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800 py-2 rounded-md"
                    tabIndex={5}
                    disabled={processing}
                >
                    Register new account
                </Button>
            </form>

            {/* Bagian ini sebelumnya ada di sini, tapi sekarang sudah pindah ke AuthSplitLayout */}
            {/* <div className="text-center text-sm text-muted-foreground"> ... </div> */}
        </AuthLayout>
    );
}