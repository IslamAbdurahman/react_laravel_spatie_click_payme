import DeleteItemModal from '@/components/delete-item-modal';
import CreateUserModal from '@/components/user/create-user-modal';
import UpdateUserModal from '@/components/user/update-user-modal';
import { Auth, Role, SearchData, type UserPaginate } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface UserTableProps extends UserPaginate {
    roles: Role[];
    searchData: SearchData;
}

const UserTable = ({ roles, searchData, ...user }: UserTableProps) => {
    const { t } = useTranslation();
    const { auth } = usePage().props as unknown as { auth?: Auth };
    const isAdmin = auth?.user?.roles?.some((role) => role.name === 'Admin');

    const { delete: deleteUser, reset, errors: deleteError, clearErrors } = useForm();

    const handleDelete = (id: number) => {
        deleteUser(`/user/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                toast.success(t('deleted_successfully'));
            },
            onError: (err) => {
                const errorMessage = err?.error || t('delete_failed');
                toast.error(errorMessage);
            },
        });
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-gray-800 dark:text-gray-100">
                <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">{t('n')}</th>
                        <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">{t('name')}</th>
                        <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">{t('username')}</th>
                        <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">{t('telegram_id')}</th>
                        <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">{t('phone')}</th>
                        <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">{t('email')}</th>
                        <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">{t('created_at')}</th>
                        <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                            <CreateUserModal />
                        </th>
                    </tr>
                </thead>

                <tbody className="bg-white dark:bg-gray-800">
                    {user.data.map((item, index) => {
                        const globalIndex = (user.current_page - 1) * user.per_page + index + 1;

                        return (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">{globalIndex}</td>
                                <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                                    <Link href={`/user/${item.id}`} className="text-blue-600 hover:underline dark:text-blue-400">
                                        {item.name} (
                                        {item.roles?.map((role) => (
                                            <span key={role.id} className="text-gray-500 dark:text-gray-400">
                                                {role.name}
                                            </span>
                                        ))}
                                        )
                                    </Link>
                                </td>
                                <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">{item.username}</td>
                                <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">{item.telegram_id}</td>
                                <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">{item.phone}</td>
                                <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">{item.email}</td>
                                <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                                    {new Date(item.created_at).toLocaleString('sv-SE').replace('T', ' ')}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                                    <div className="inline-flex gap-1 rounded-md shadow-sm">
                                        <UpdateUserModal roles={roles} user={item} />
                                        {isAdmin && <DeleteItemModal item={item} onDelete={handleDelete} />}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-4 flex flex-col items-center justify-between gap-2 text-sm text-gray-600 sm:flex-row dark:text-gray-300">
                <div>
                    {t('showing', {
                        from: user.from,
                        to: user.to,
                        total: user.total,
                    })}
                </div>

                <div className="flex flex-wrap gap-1">
                    {user.links.map((link, index) => (
                        <Link
                            key={index}
                            href={`${link.url ?? '?'}&search=${searchData.search}&per_page=${searchData.per_page}`}
                            className={`rounded-md px-3 py-1 text-sm transition focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                link.active
                                    ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white'
                                    : !link.url
                                      ? 'cursor-not-allowed text-gray-400 dark:text-gray-500'
                                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserTable;
