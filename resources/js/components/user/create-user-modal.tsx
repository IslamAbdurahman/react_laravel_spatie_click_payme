import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCreate } from 'react-icons/io5';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
import { baseButton } from '@/components/ui/baseButton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ServerError } from '@/types';

export default function CreateUserModal() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const nameInput = useRef<HTMLInputElement>(null);

    const initialData = {
        name: '',
        phone: '',
        email: '',
        password: '',
    };

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm(initialData);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('user.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                setOpen(false);
                toast.success(t('created_successfully'));
            },
            onError: (err: ServerError) => {
                nameInput.current?.focus();
                toast.error(err.error || t('create_failed'));
            },
        });
    };

    const handleCancel = () => {
        reset();
        clearErrors();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className={`${baseButton} bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700`}>
                    <IoCreate className="h-4 w-4" />
                    {t('create')}
                </button>
            </DialogTrigger>

            <DialogContent className="dark:border-gray-400">
                <DialogTitle>{t('modal.create_title')}</DialogTitle>
                <DialogDescription>{t('modal.create_description')}</DialogDescription>

                <form onSubmit={submit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <Label htmlFor="name">{t('name')}</Label>
                        <Input id="name" ref={nameInput} value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                    </div>

                    {/* Phone */}
                    <div>
                        <Label htmlFor="phone">{t('phone')}</Label>
                        <Input id="phone" type="number" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                        <InputError message={errors.phone} />
                    </div>

                    {/* Email */}
                    <div>
                        <Label htmlFor="email">{t('email')}</Label>
                        <Input id="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                        <InputError message={errors.email} />
                    </div>

                    {/* Password */}
                    <div>
                        <Label htmlFor="password">{t('password')}</Label>
                        <Input
                            id="password"
                            type="number"
                            inputMode="numeric"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} />
                    </div>

                    {/* Footer */}
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button
                                variant="secondary"
                                onClick={handleCancel}
                                className="bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                            >
                                {t('cancel')}
                            </Button>
                        </DialogClose>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                            {t('save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
