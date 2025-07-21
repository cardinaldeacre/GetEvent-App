import { type SharedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import AuthLayout from '@/layouts/auth-layout';
import { FormEventHandler, useEffect, useState } from 'react';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
}

export default function Auth() {

    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    // reset password on component unmount
    useEffect(() => {
        return () => {
            reset('password');
        }
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    }

    if (processing) {
        return (
            <AuthSplitLayout>
                <Head title='Login' />

                <div className="flex min-h-screen ">
                    <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900">
                        <div className="w-full max-w-sm mx-auto">
                            <div className="mb-8">
                                <svg className="h-10 w-auto text-indigo-600 dark:text-indigo-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM9 14c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zM15 14c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zM9 10a1 1 0 100-2 1 1 0 000 2z" />
                                </svg>
                                <h2 className='mt-4 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
                                    Login to GetEvent
                                </h2>
                                <p className='mt-2 text-center tex-sm text-gray-600 dark:text-gray-400'>
                                    Login to GetEvent to access special
                                </p>
                            </div>

                            <form className="flex flex-col gap-6" onSubmit={submit}>
                                <div className="grid gap">
                                    <Label htmlFor='email'>Email/Usernaname</Label>
                                    <Input
                                        id='email'
                                        type="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete='email'
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        disabled={processing}
                                        placeholder='Input email or username'
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="flex items-center">
                                    <Input
                                        id='show_password'
                                        type="checkbox"
                                        checked={showPassword}
                                        onChange={(e) => setShowPassword(e.target.checked)}
                                        disabled={processing}
                                        className='rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500'
                                    />
                                    <Label htmlFor='show_password' className='ml-2 text-sm text-gray-600 dark:text-gray-400'>
                                        Show password
                                    </Label>
                                </div>

                                {/* Login Button */}
                                <Button type='submit' className='mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md' tabIndex={3} disabled={processing}>
                                    {processing && <LoaderCircle className='h-4 w-4 animate-spin mr-2' />}
                                    Login
                                </Button>

                                <Button
                                    type='button'
                                    onClick={() => window.location.href = route('register')}
                                    className='w-full bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800 py-2 rounded-md'
                                    tabIndex={4}
                                    disabled={processing}
                                >
                                    Register
                                </Button>

                                {/* Forgot Password */}
                                <div className="text-center text-sm">
                                    <TextLink href={route('password.request')} tabIndex={5}>
                                        Forgot your password?
                                    </TextLink>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </AuthSplitLayout>);
    }
}
