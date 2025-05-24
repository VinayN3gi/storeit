'use client';
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { actionsDropdownItems } from '@/constants';
import { constructDownloadUrl } from '@/lib/utils';
import Link from 'next/link';

type Document = {
    $collectionId?: string;
    $createdAt?: string;
    $databaseId?: string;
    $id?: string;
    $permissions?: string[];
    $updatedAt?: string;
    accountId: string;
    bucketFileId: string;
    extension?: string;
    name: string;
    owners?: string[] | null;
    size?: number;
    type: string;
    url: string;
    users?: string[];
};

interface CardProps {
    file: Document;
}

const ActionDropdown = ({ file }: CardProps) => {
    const [isMoadlOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [action, setAction] = useState<ActionType | null>(null);

    return (
        <Dialog open={isMoadlOpen} onOpenChange={setIsModalOpen}>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger className="shad-no-focus">
                    <Image src="/assets/icons/dots.svg" alt="dots" width={34} height={34} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel className="max-w-[200px] truncate">
                        {file.name!}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {actionsDropdownItems.map((actionItems) => (
                        <DropdownMenuItem
                            key={actionItems.value}
                            className="shad-dropdown-item"
                            onClick={() => {
                                setAction(actionItems);
                                if (
                                    ['Rename', 'Share', 'Delete', 'Details'].includes(
                                        actionItems.value
                                    )
                                ) {
                                    setIsModalOpen(true);
                                }
                            }}
                        >
                            {actionItems.label == 'Download' ? (
                                <Link
                                    href={constructDownloadUrl(file.bucketFileId)}
                                    download={file.name}
                                    className="flex items-center gap-2"
                                >
                                    <Image
                                        src={actionItems.icon}
                                        alt={actionItems.label}
                                        width={30}
                                        height={30}
                                    />
                                    {actionItems.label}
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={actionItems.icon}
                                        alt={actionItems.label}
                                        width={30}
                                        height={30}
                                    />
                                    {actionItems.label}
                                </div>
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </Dialog>
    );
};

export default ActionDropdown;
