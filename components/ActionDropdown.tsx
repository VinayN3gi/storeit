'use client';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { Input } from './ui/input';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { deleteFile, renameFile, updatedFile } from '@/lib/action/file.action';
import { usePathname } from 'next/navigation';
import { FileDetails, ShareInput } from './ActionModalContent';
import { useFileContext } from '@/provider/FileContext';

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

type ActionValue = 'rename' | 'share' | 'delete' | 'details';

type ActionType = {
    value: ActionValue;
    label: string;
    icon?: string;
};

const ActionDropdown = ({ file }: CardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [action, setAction] = useState<ActionType | null>(null);
    const [name, setName] = useState(file.name);
    const [isLoading, setLoading] = useState(false);
    const path = usePathname();
    const [emails,setEmails]=useState<string[]>([]);
    const {triggerRefresh}=useFileContext()


    const closeAllModals = () => {
        setIsDropdownOpen(false);
        setIsModalOpen(false);
        setAction(null);
        setName(file.name);
    };

    const handleAction = async () => {
        if (!action) return;
        setLoading(true);
        let success = false;

        const actions = {
            rename: () => renameFile({ fileId: file.$id!, name, extension: file.extension!, path }),
            share: () => updatedFile({fileId:file.$id!,emails,path}),
            delete: () => deleteFile({fileId:file.$id!,path,bucketFileId:file.bucketFileId})
        };

        success = await actions[action.value as keyof typeof actions]();

        if (success) closeAllModals();
        triggerRefresh()
        setLoading(false);
    };


    const renderDialogContent = () => {
        if (!action) return null;
        const { value, label } = action;

        return (
            <DialogContent className="shad-dialog button">
                <DialogHeader className="flex flex-col gap-3">
                    <DialogTitle className="text-center text-light-100">{label}</DialogTitle>
                    {value === "rename" && (
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    )}
                    {value === "details"  && <FileDetails file={file as Required<Document>} />}
                    {
                        value=="share" && <ShareInput file={file as Required<Document>} onInputChange={setEmails}
                        />
                    }
                    {
                        value=="delete" && (
                            <p className='delete-confirmation'>
                                Are you sure you want to delete {' '}
                                <span className='delete-file-name'>{file.name}</span>
                            </p>
                        )
                    }
                </DialogHeader>
                {['rename', 'delete', 'share'].includes(value) && (
                    <DialogFooter className="flex flex-col gap-3 md:flex-row">
                        <Button className="modal-cancel-button" onClick={closeAllModals}>
                            Cancel
                        </Button>
                        <Button className="capitalize modal-submit-button" onClick={handleAction}>
                            {!isLoading && <p>{value}</p>}
                            {isLoading && (
                                <motion.div
                                    className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"
                                    initial={{ rotate: 0 }}
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
                                />
                            )}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        );
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger className="shad-no-focus">
                    <Image src="/assets/icons/dots.svg" alt="dots" width={34} height={34} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel className="max-w-[200px] truncate">
                        {file.name}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {actionsDropdownItems.map((actionItems) => (
                        <DropdownMenuItem
                            key={actionItems.value}
                            className="shad-dropdown-item"
                            onClick={() => {
                                setAction({
                                    ...actionItems,
                                    value: actionItems.value as ActionValue,
                                });
                                if (
                                    ['rename', 'share', 'delete', 'details'].includes(
                                        actionItems.value
                                    )
                                ) {
                                    setIsModalOpen(true);
                                }
                            }}
                        >
                            {actionItems.label === 'Download' ? (
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
            {renderDialogContent()}
        </Dialog>
    );
};

export default ActionDropdown;
