import { useGetGames } from '@/api/games-api';
import {
    useUpdateUserBySelf,
    type UpdateUserBySelfRequest,
    type User,
} from '@/api/user-api';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { GENDER } from '@/types/enums';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Loader2, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { FileUpload, FileUploadTrigger } from '../ui/file-upload';

const updateProfileFormSchema = z.object({
    profile: z.object({
        firstName: z.string().min(1, 'First name is required'),
        middleName: z.string().optional(),
        lastName: z.string().min(1, 'Last name is required'),
        contactNumber: z.string().optional(),
        gender: z.enum(GENDER).optional(),
        dateOfBirth: z.string().optional(),
        joiningDate: z.string().optional(),
    }),
    avatar: z.string().optional(),
    gameInterests: z.array(z.string()).optional(),
}) satisfies z.ZodType<UpdateUserBySelfRequest>;

type Props = {
    user: User;
};

export function UpdateProfileDialog({ user }: Props) {
    const updateUserMutation = useUpdateUserBySelf();
    const { data: games = [] } = useGetGames();
    const [open, setOpen] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    const avatarPreview =
        files.length > 0
            ? URL.createObjectURL(files[0])
            : user.profile?.avatarUrl || '';

    const handleRemove = () => {
        setFiles([]);
    };

    const form = useForm<UpdateUserBySelfRequest>({
        //@ts-ignore
        resolver: zodResolver(updateProfileFormSchema),
        defaultValues: {
            profile: {
                firstName: user.profile?.firstName || '',
                middleName: user.profile?.middleName || '',
                lastName: user.profile?.lastName || '',
                contactNumber: user.profile?.contactNumber || '',
                gender: user.profile?.gender,
                dateOfBirth: user.profile?.dateOfBirth
                    ? new Date(user.profile.dateOfBirth)
                          .toISOString()
                          .split('T')[0]
                    : '',
                joiningDate: user.profile?.joiningDate
                    ? new Date(user.profile.joiningDate)
                          .toISOString()
                          .split('T')[0]
                    : '',
            },
            avatar: user.profile?.avatarUrl || '',
            gameInterests: user.interestedInGames?.map((g) => g.id) || [],
        },
    });

    const onSubmit = async (data: UpdateUserBySelfRequest) => {
        const formData = new FormData();
        formData.append('profile.firstName', data.profile?.firstName || '');
        formData.append('profile.middleName', data.profile?.middleName || '');
        formData.append('profile.lastName', data.profile?.lastName || '');
        formData.append(
            'profile.contactNumber',
            data.profile?.contactNumber || ''
        );
        formData.append('profile.gender', data.profile?.gender || '');
        formData.append('profile.dateOfBirth', data.profile?.dateOfBirth || '');
        formData.append('profile.joiningDate', data.profile?.joiningDate || '');

        data.gameInterests?.forEach((gameId) => {
            formData.append('gameInterests[]', gameId);
        });

        if (files.length > 0) {
            formData.append('avatar', files[0]);
        }

        await updateUserMutation.mutate(formData, {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    const onInvalid = (errors: any) => {
        const messages = Object.values(errors).map((err: any) => err.message);
        messages.reverse().forEach((msg: string) => toast.error(msg));
    };

    const selectedGameIds = form.watch('gameInterests') || [];

    const handleGameToggle = (gameId: string) => {
        const current = form.getValues('gameInterests') || [];
        if (current.includes(gameId)) {
            form.setValue(
                'gameInterests',
                current.filter((id) => id !== gameId)
            );
        } else {
            form.setValue('gameInterests', [...current, gameId]);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Profile
                </Button>
            </DialogTrigger>

            <DialogContent className="flex max-h-[min(700px,85vh)] flex-col gap-0 p-0 sm:max-w-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
                        <DialogHeader className="px-6 pt-6">
                            <DialogTitle>Update Profile</DialogTitle>
                        </DialogHeader>

                        <ScrollArea className="px-6 py-4 h-[500px]">
                            <div className="space-y-5">
                                <div className="flex flex-col items-center gap-4">
                                    <FileUpload
                                        value={files}
                                        onValueChange={setFiles}
                                        accept="image/*"
                                        maxFiles={1}
                                        maxSize={2 * 1024 * 1024}
                                    >
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="group relative cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                                    <Avatar className="size-24">
                                                        <AvatarImage
                                                            src={avatarPreview}
                                                            alt="Avatar"
                                                        />
                                                        <AvatarFallback>
                                                            {user
                                                                .userName?.[0] ||
                                                                'U'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                                        <Camera className="size-6 text-white" />
                                                    </div>
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="center">
                                                <FileUploadTrigger asChild>
                                                    <DropdownMenuItem>
                                                        <Camera className="mr-2 size-4" />
                                                        Upload photo
                                                    </DropdownMenuItem>
                                                </FileUploadTrigger>
                                                {files.length > 0 && (
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={handleRemove}
                                                    >
                                                        <Trash2 className="mr-2 size-4" />
                                                        Remove photo
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </FileUpload>
                                    <div className="text-center">
                                        <p className="font-medium">John Doe</p>
                                        <p className="text-sm text-muted-foreground">
                                            Click avatar to change
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="firstName">
                                        First Name*
                                    </Label>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        placeholder="Your first name"
                                        {...form.register('profile.firstName')}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="middleName">
                                        Middle Name
                                    </Label>
                                    <Input
                                        id="middleName"
                                        type="text"
                                        placeholder="Your middle name"
                                        {...form.register('profile.middleName')}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="lastName">Last Name*</Label>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        placeholder="Your last name"
                                        {...form.register('profile.lastName')}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="contactNumber">
                                        Contact Number
                                    </Label>
                                    <Input
                                        id="contactNumber"
                                        type="text"
                                        placeholder="+91 9999999999"
                                        {...form.register(
                                            'profile.contactNumber'
                                        )}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select
                                        value={form.watch('profile.gender')}
                                        onValueChange={(value) =>
                                            form.setValue(
                                                'profile.gender',
                                                value as any
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MALE">
                                                Male
                                            </SelectItem>
                                            <SelectItem value="FEMALE">
                                                Female
                                            </SelectItem>
                                            <SelectItem value="OTHER">
                                                Other
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="dateOfBirth">
                                        Date of Birth
                                    </Label>
                                    <Input
                                        id="dateOfBirth"
                                        type="date"
                                        {...form.register(
                                            'profile.dateOfBirth'
                                        )}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="joiningDate">
                                        Joining Date
                                    </Label>
                                    <Input
                                        id="joiningDate"
                                        type="date"
                                        {...form.register(
                                            'profile.joiningDate'
                                        )}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label>Game Interests</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {games.map((game) => (
                                            <Button
                                                key={game.id}
                                                type="button"
                                                variant={
                                                    selectedGameIds.includes(
                                                        game?.id as string
                                                    )
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                onClick={() =>
                                                    handleGameToggle(
                                                        game?.id as string
                                                    )
                                                }
                                            >
                                                {game.name}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>

                        <DialogFooter className="flex-row justify-end gap-3 border-t px-6 py-4">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>

                            <Button
                                type="submit"
                                disabled={updateUserMutation.isPending}
                            >
                                {updateUserMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Update Profile
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
