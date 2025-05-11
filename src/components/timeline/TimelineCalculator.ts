import TimeSpan from "@/time/TimeSpan";
import Time from "@/time/Time";
import { BookingBlockProps } from "@/components/timeline/components/TimelineBlock";
import { TimelineData } from "@/components/timeline/Timeline";
import { compare } from "@/util/CompareUtils";

export class TimelineCalculator {
    readonly startTime: Time;
    readonly endTime: Time;
    readonly marginSize: number;
    readonly amountOfTimeSteps: number;

    readonly amountOfTimeBlocks: number;
    readonly amountOfSubTimeBlocks: number;

    readonly activeAreaSize: number;
    readonly activeAreaTimeSpan: TimeSpan;

    readonly timeStepSize: number;

    constructor(config: {
        data: TimelineData[],
        currentTime: Time,
        startTime: Time,
        endTime: Time,
        automaticTimeBoundsOnOverflow: boolean,
        automaticAmountOfTimeSteps: boolean,
        amountOfTimeSteps: number,
        amountOfSubTimeSteps: number,
        marginSize: number
    }) {
        this.startTime = (
            config.automaticTimeBoundsOnOverflow && this.calculateStartTimeIfOverflowing(config.data, config.startTime) ||
            config.startTime
        );
        this.endTime = (
            config.automaticTimeBoundsOnOverflow && this.calculateEndTimeIfOverflowing(config.data, config.endTime, config.currentTime) ||
            config.endTime
        );

        const wasStartOrEndTimeAdjusted = !this.startTime.equals(config.startTime) || !this.endTime.equals(config.endTime);
        this.amountOfTimeSteps = (
            wasStartOrEndTimeAdjusted || config.automaticAmountOfTimeSteps
                ? this.calculateAutomaticTimeSteps()
                : config.amountOfTimeSteps
        );

        this.marginSize = config.marginSize;

        this.amountOfTimeBlocks = this.amountOfTimeSteps - 1;
        this.amountOfSubTimeBlocks = config.amountOfSubTimeSteps + 1;

        this.activeAreaSize = 100 - 2 * this.marginSize;
        this.activeAreaTimeSpan = TimeSpan.ofTimeDifference(this.startTime, this.endTime);

        this.timeStepSize = this.activeAreaSize / this.amountOfTimeBlocks;
    }

    private calculateStartTimeIfOverflowing(data: TimelineData[], startTime: Time) {
        const startTimeOfEarliestBlock = this.getEarliestBlock(data)?.startTime;

        if (startTimeOfEarliestBlock && compare(startTimeOfEarliestBlock, 'lessThan', startTime)) {
            const minutes = startTimeOfEarliestBlock.asTimeSpan().minutes;
            return Time.of(
                startTimeOfEarliestBlock.asTimeSpan().hours,
                minutes >= 30 ? 30 : 0
            );
        }
    }

    private calculateEndTimeIfOverflowing(data: TimelineData[], endTime: Time, currentTime: Time) {
        const latestBlock = this.getLatestBlock(data, currentTime);
        const endTimeOfLatestBlock = latestBlock ? latestBlock.endTime ?? currentTime : undefined;

        if (endTimeOfLatestBlock && compare(endTimeOfLatestBlock, 'greaterThan', endTime)) {
            const minutes = endTimeOfLatestBlock.asTimeSpan().minutes;
            const hours = endTimeOfLatestBlock.asTimeSpan().hours;
            if (minutes == 0) {
                return Time.of(hours, 0);
            } else if (minutes > 30) {
                return Time.of(hours + 1, 0);
            } else {
                return Time.of(hours, 30);
            }
        }
    }

    private getEarliestBlock(data: TimelineData[]) {
        return data.sort((a, b) => a.startTime.compareTo(b.startTime)).at(0);
    }

    private getLatestBlock(data: TimelineData[], currentTime: Time) {
        return data.sort((a, b) => (b.endTime ?? currentTime).compareTo(a.endTime ?? currentTime)).at(0);
    }

    private calculateAutomaticTimeSteps() {
        const timelineLength = TimeSpan.ofTimeDifference(this.startTime, this.endTime);

        const calculateMajorSteps = (stepSize: TimeSpan) => {
            const majorSteps = TimeSpan.ratio(TimeSpan.ofTimeDifference(this.startTime, this.endTime), stepSize) + 1;
            return Number.isInteger(majorSteps) ? majorSteps : undefined;
        }

        let majorSteps: number | undefined;

        if (compare(timelineLength, 'greaterOrEqualThan', TimeSpan.ofString('16:00'))) {
            majorSteps = (
                calculateMajorSteps(TimeSpan.ofHours(2)) ??
                calculateMajorSteps(TimeSpan.ofHours(3))
            );
        } else if (compare(timelineLength, 'greaterOrEqualThan', TimeSpan.ofString('15:00'))) {
            majorSteps = (
                calculateMajorSteps(TimeSpan.ofHours(2)) ??
                calculateMajorSteps(TimeSpan.ofHours(3))
            );
        } else if (compare(timelineLength, 'greaterOrEqualThan', TimeSpan.ofString('8:00'))) {
            majorSteps = (
                calculateMajorSteps(TimeSpan.ofHours(1)) ??
                calculateMajorSteps(TimeSpan.ofHours(2)) ??
                calculateMajorSteps(TimeSpan.ofHours(3))
            );
        } else if (compare(timelineLength, 'greaterOrEqualThan', TimeSpan.ofString('4:00'))) {
            majorSteps = (
                calculateMajorSteps(TimeSpan.ofMinutes(30)) ??
                calculateMajorSteps(TimeSpan.ofHours(1))
            );
        } else {
            majorSteps = (
                calculateMajorSteps(TimeSpan.ofMinutes(15)) ??
                calculateMajorSteps(TimeSpan.ofMinutes(30)) ??
                calculateMajorSteps(TimeSpan.ofHours(1))
            );
        }

        return majorSteps ?? 2;
    }

    private mapTimeToPosition(time: Time) {
        const percentageOfActiveArea = TimeSpan.ratio(
            TimeSpan.ofTimeDifference(this.startTime, time),
            this.activeAreaTimeSpan
        );
        return percentageOfActiveArea * this.activeAreaSize + this.marginSize;
    }

    private mapTimeSpanToSize(timeSpan: TimeSpan) {
        return TimeSpan.ratio(timeSpan, this.activeAreaTimeSpan) * this.activeAreaSize;
    }

    createTimeSteps() {
        const timeStepInMinutes = this.activeAreaTimeSpan.reduceToMinutes() / this.amountOfTimeBlocks;

        const timeSteps = [];
        for (let i = 0; i < this.amountOfTimeSteps; i++) {
            timeSteps.push({
                position: this.marginSize + i * this.timeStepSize,
                time: i == this.amountOfTimeSteps - 1
                    ? this.endTime
                    : this.startTime.asTimeSpan().add(TimeSpan.ofMinutes(timeStepInMinutes * i)).asTime(),
            });
        }
        return timeSteps;
    }

    createSubTimeSteps() {
        const subTimeStepSize = this.timeStepSize / this.amountOfSubTimeBlocks;

        const subTimeSteps: { position: number }[] = [];
        for (let i = 1; i < this.amountOfTimeBlocks * this.amountOfSubTimeBlocks; i++) {
            if (i % this.amountOfSubTimeBlocks === 0) {
                continue;
            }
            subTimeSteps.push({ position: this.marginSize + i * subTimeStepSize });
        }
        return subTimeSteps;
    }


    createTimelineBlockBlueprints(data: TimelineData[], currentTime: Time, isDarkTheme: boolean): BookingBlockProps[] {
        return data
            .map(
                block => {
                    const endTime = block.endTime ?? currentTime;

                    const rightOverflow = compare(endTime, 'greaterThan', this.endTime);
                    const leftOverflow = compare(block.startTime, 'lessThan', this.startTime);

                    const clampedBlockStartTime = leftOverflow ? this.startTime : block.startTime;
                    const clampedBlockEndTime = rightOverflow ? this.endTime : endTime;

                    const isBlockOutOfBounds = (
                        compare(endTime, 'lessOrEqualThan', this.startTime) ||
                        compare(block.startTime, 'greaterOrEqualThan', this.endTime)
                    );

                    return isBlockOutOfBounds
                        ? null
                        : {
                            title: block.title,
                            startTime: block.startTime,
                            endTime,
                            leftOverflow: leftOverflow,
                            rightOverflow: rightOverflow,
                            color: block.color,
                            isOpen: block.endTime == undefined,
                            size: this.mapTimeSpanToSize(TimeSpan.ofTimeDifference(clampedBlockStartTime, clampedBlockEndTime)),
                            position: this.mapTimeToPosition(clampedBlockStartTime),
                            className: block.className,
                            onClick: block.onClick,
                            isDarkTheme
                        }
                }
            )
            .filter(block => block != null);
    }

    isCurrentTimeInsideActiveArea(currentTime: Time) {
        return (
            compare(currentTime, 'greaterOrEqualThan', this.startTime) &&
            compare(currentTime, 'lessOrEqualThan', this.endTime)
        );
    }

    createTimelineBackgroundImageGradient(marginColor: string) {
        const mainSize = `${100 - this.marginSize}%`;

        return `linear-gradient(
            to right,
            ${marginColor} ${this.marginSize}%,
            transparent ${this.marginSize}%,
            transparent ${mainSize},
            ${marginColor} ${mainSize}
        )`;
    }

    calculateNowLinePosition(currentTime: Time) {
        return this.mapTimeToPosition(currentTime);
    }

}
