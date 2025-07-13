import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import InputError from '@/components/input-error';
import LanguageBar from '@/components/language';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { FcGoogle } from 'react-icons/fc';

type LoginForm = {
    email_or_phone: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email_or_phone: '',
        password: '',
        remember: false,
    });

    const { t } = useTranslation();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title={t('login.title')} description={t('login.description')}>
            <Head title={t('login.submit')} />

            <LanguageBar />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email_or_phone">{t('login.email_or_phone')}</Label>
                        <Input
                            id="email_or_phone"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email_or_phone"
                            value={data.email_or_phone}
                            onChange={(e) => setData('email_or_phone', e.target.value)}
                            placeholder={t('login.email_placeholder')}
                        />
                        <InputError message={errors.email_or_phone} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">{t('login.password')}</Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                    {t('login.forgot')}
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder={t('login.password_placeholder')}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                            tabIndex={3}
                        />
                        <Label htmlFor="remember">{t('login.remember')}</Label>
                    </div>

                    <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        {t('login.submit')}
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    {t('login.no_account')}{' '}
                    <TextLink href={route('register')} tabIndex={5}>
                        {t('login.signup')}
                    </TextLink>
                </div>
            </form>

            <a
                href={route('google.redirect')}
                tabIndex={5}
                className="flex items-center gap-2 border p-2 rounded h-10 hover:bg-gray-100 hover:text-black transition"
            >
                <FcGoogle className="text-xl" />
                <span className="text-sm font-medium">{t('login.google')}</span>
            </a>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{t('login.status_success')}</div>}
        </AuthLayout>
    );
}
