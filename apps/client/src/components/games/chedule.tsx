import { useState } from 'react';
import {
    format,
    startOfWeek,
    addDays,
    parse,
    addMinutes,
    getWeek,
} from 'date-fns';
import type { components } from '@/types/generated/api';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import BookSlotDialog from './book-slot-dialog';
import BookedSlotDialog from './booked-slot-dialog';

type GameSlotResponse = components['schemas']['GameSlotResponse'];
type GameResponse = components['schemas']['GameResponse'];

interface Props {
    readonly game: GameResponse;
    readonly referenceDate?: Date;
    readonly weekStartsOn?: 0 | 1;
}

export default function Schedule({
    game,
    referenceDate = new Date(),
    weekStartsOn = 1,
}: Props) {
    const [bookSlotOpen, setBookSlotOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{
        day: string;
        time: string;
    } | null>(null);
    const [bookedSlotDialogOpen, setBookedSlotDialogOpen] = useState(false);
    const [selectedBookedSlot, setSelectedBookedSlot] =
        useState<GameSlotResponse | null>(null);
    // build an array of seven Date objects representing the current week
    const weekStart = startOfWeek(referenceDate, { weekStartsOn });
    let days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    const dayNameToIndex: Record<string, number> = {
        SUNDAY: 0,
        MONDAY: 1,
        TUESDAY: 2,
        WEDNESDAY: 3,
        THURSDAY: 4,
        FRIDAY: 5,
        SATURDAY: 6,
    };
    const startIdx =
        dayNameToIndex[
            game.openingDayOfWeek ?? (weekStartsOn === 1 ? 'MONDAY' : 'SUNDAY')
        ];
    const endIdx =
        dayNameToIndex[
            game.closingDayOfWeek ??
                (weekStartsOn === 1 ? 'FRIDAY' : 'SATURDAY')
        ];
    if (startIdx != null && endIdx != null) {
        days = days.filter((d) => {
            const idx = d.getDay();
            return idx >= startIdx && idx <= endIdx;
        });
    }

    // parse opening/closing times and generate time slots
    const open = game.openTime
        ? parse(game.openTime, 'HH:mm:ss', new Date())
        : null;
    const close = game.closeTime
        ? parse(game.closeTime, 'HH:mm:ss', new Date())
        : null;
    const duration = game.slotDuration ?? 60;
    const slots: Date[] = [];

    if (open && close) {
        let cur = open;
        while (cur < close) {
            slots.push(cur);
            cur = addMinutes(cur, duration);
        }
    }

    // index the slots by day+startTime so we can quickly look them up in the table
    const slotMap = new Map<string, GameSlotResponse>();
    game.gameSlots?.forEach((s) => {
        if (s.day && s.startTime) {
            const key = `${s.day} ${s.startTime}`;
            slotMap.set(key, s);
        }
    });

    const weekNumber = getWeek(referenceDate, { weekStartsOn });

    return (
        <>
            <div className="overflow-auto w-full pr-4">
                <Table
                    className="w-full table-fixed"
                    style={{
                        ['--first-col' as any]: '6rem',
                        ['--days' as any]: days.length,
                    }}
                >
                    <colgroup>
                        <col style={{ width: 'var(--first-col)' }} />
                        {days.map((d) => (
                            <col
                                key={d.toString()}
                                style={{
                                    width: `calc((100% - var(--first-col)) / var(--days))`,
                                }}
                            />
                        ))}
                    </colgroup>

                    <TableHeader>
                        <TableRow>
                            <TableHead className="bg-accent h-[50px] font-semibold rounded-tl-lg text-sm text-center sticky top-0 z-20 border-muted/50">
                                Week {weekNumber}
                            </TableHead>
                            {days.map((d, idx) => (
                                <TableHead
                                    key={d.toString()}
                                    className={
                                        'bg-accent text-center text-sm  sticky top-0 z-20  border-muted/50 ' +
                                        (idx === days.length - 1
                                            ? ' rounded-tr-lg'
                                            : '')
                                    }
                                >
                                    <div className="text-sm font-semibold">
                                        {format(d, 'EEE')} {format(d, 'd')}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {slots.map((t) => (
                        <TableRow
                            key={t.toString()}
                            className="h-[80px] hover:bg-transparent"
                        >
                            <TableCell className="text-sm pb-12 text-center text-muted-foreground pr-4 border-2 border-l-0 border-b-0 border-muted/50 w-24">
                                {format(t, 'h:mm a')}
                            </TableCell>
                            {days.map((d) => {
                                const dayKey = format(d, 'yyyy-MM-dd');
                                const timeKey = format(t, 'HH:mm:ss');
                                const slot = slotMap.get(
                                    `${dayKey} ${timeKey}`
                                );

                                const handleSlotClick = () => {
                                    // Open dialog for booked slots
                                    if (slot?.booked) {
                                        setSelectedBookedSlot(slot);
                                        setBookedSlotDialogOpen(true);
                                    } else {
                                        // Open dialog for empty slots
                                        setSelectedSlot({
                                            day: dayKey,
                                            time: timeKey,
                                        });
                                        setBookSlotOpen(true);
                                    }
                                };

                                return (
                                    <TableCell
                                        key={dayKey}
                                        onClick={handleSlotClick}
                                        className={
                                            'text-sm border-2 border-muted/50 hover:bg-muted/30 cursor-pointer border-r-0 border-b-0' +
                                            (slot?.booked
                                                ? ' bg-red-100 text-red-800'
                                                : '')
                                        }
                                    >
                                        {slot ? (
                                            <span className="text-sm">
                                                {slot.booked ? (
                                                    <div className="text-wrap text-center">
                                                        Booked by{' '}
                                                        {
                                                            slot.organiser
                                                                ?.userName
                                                        }{' '}
                                                        and{' '}
                                                        {slot.players?.length}{' '}
                                                        others
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                            </span>
                                        ) : null}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

        <BookSlotDialog
            gameId={game.id}
            maxPlayers={game.maxSlotPlayers}
            preFillDay={selectedSlot?.day}
            preFillTime={selectedSlot?.time}
            isOpen={bookSlotOpen}
            onOpenChange={setBookSlotOpen}
        />

        <BookedSlotDialog
            gameId={game.id}
            slot={selectedBookedSlot ?? undefined}
            isOpen={bookedSlotDialogOpen}
            onOpenChange={setBookedSlotDialogOpen}
        />
    </>
    );
}
