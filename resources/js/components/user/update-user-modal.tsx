import { useForm, usePage } from '@inertiajs/react';
import { PencilIcon } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

import { Auth, Role, ServerError, User } from '@/types';

interface UpdateUserModalProps {
    roles: Role[];
    user: User;
}

export default function UpdateUserModal({ roles = [], user }: UpdateUserModalProps) {
    const { t } = useTranslation();
    const nameInput = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);

    const initialData = {
        name: user.name ?? '',
        phone: user.phone ?? '',
        role: user.roles?.[0]?.name ?? '',
        email: user.email ?? '',
        password: '',
    };

    const { data, setData, put, processing, reset, errors, clearErrors } = useForm(initialData);

    const { auth } = usePage().props as { auth?: Auth };
    const isAdmin = auth?.user?.roles?.some((role) => role.name === 'Admin');

    useEffect(() => {
        setData(initialData);
    }, [user]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(`/user/${user.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                setOpen(false);
                toast.success(t('updated_successfully'));
            },
            onError: (err: ServerError) => {
                nameInput.current?.focus();
                toast.error(err.error || t('update_failed'));
            },
        });
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none dark:focus:ring-green-500"
            >
                <PencilIcon className="h-4 w-4" />
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="dark:border-gray-400">
                    <DialogTitle>{t('modal.update_title')}</DialogTitle>
                    <DialogDescription>{t('modal.update_description')}</DialogDescription>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">{t('name')}</Label>
                            <Input id="name" ref={nameInput} value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <Label htmlFor="phone">{t('phone')}</Label>
                            <Input id="phone" type="number" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                            <InputError message={errors.phone} />
                        </div>

                        {isAdmin && (
                            <div>
                                <Label>{t('role')}</Label>

                                <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                    <SelectTrigger className="w-full">
                                        <span>{data.role ? roles.find((r) => r.name === data.role)?.name : t('select_test')}</span>
                                    </SelectTrigger>

                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role.id} value={role.name}>
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <InputError message={errors.role} />
                            </div>
                        )}

                        <div>
                            <Label htmlFor="email">{t('email')}</Label>
                            <Input id="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            <InputError message={errors.email} />
                        </div>

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

                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        reset();
                                        clearErrors();
                                    }}
                                >
                                    {t('cancel')}
                                </Button>
                            </DialogClose>

                            <Button type="submit" disabled={processing}>
                                {t('save')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
