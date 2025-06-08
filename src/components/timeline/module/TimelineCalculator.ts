import TimeSpan from "@/time/TimeSpan";
import Time from "@/time/Time";
import { TimelineBlockProps } from "@/components/timeline/module/components/TimelineBlock";
import { compare } from "@/util/CompareUtils";
import { TimelineMarkerProps } from "@/components/timeline/module/components/TimelineMarker";
import { TimelineBlock, TimelineConfiguration, TimelineMarker } from "@/components/timeline/module/TimelineTypes";


export class TimelineCalculator {
    private readonly config: TimelineConfiguration;

    private readonly blocks: TimelineBlock[];

    private readonly startTime: Time;
    private readonly endTime: Time;
    private readonly amountOfTimeSteps: number;

    private readonly amountOfTimeBlocks: number;
    private readonly amountOfSubTimeBlocks: number;

    private readonly activeAreaSize: number;
    private readonly activeAreaTimeSpan: TimeSpan;

    private readonly timeStepSize: number;

    private constructor(configuration: TimelineConfiguration, blocks: TimelineBlock[]) {
        this.config = configuration;

        this.blocks = blocks;
        this.startTime = this.calculateStartTime();
        this.endTime = this.calculateEndTime();
        this.amountOfTimeSteps = this.calculateAmountOfTimeSteps();
        this.amountOfTimeBlocks = this.amountOfTimeSteps - 1;
        this.amountOfSubTimeBlocks = configuration.amountOfSubTimeSteps + 1;
        this.activeAreaSize = 100 - 2 * configuration.marginSize;
        this.activeAreaTimeSpan = TimeSpan.ofTimeDifference(this.startTime, this.endTime);
        this.timeStepSize = this.activeAreaSize / this.amountOfTimeBlocks;
    }

    public static withContext(configuration: TimelineConfiguration, blocks: TimelineBlock[]) {
        return new TimelineCalculator(configuration, blocks);
    }

    createTimeSteps() {
        const timeStepInMinutes = this.activeAreaTimeSpan.reduceToMinutes() / this.amountOfTimeBlocks;

        return Array.from({ length: this.amountOfTimeSteps })
            .map((_, index) => (
                {
                    position: this.config.marginSize + index * this.timeStepSize,
                    time: index == this.amountOfTimeSteps - 1
                        ? this.endTime
                        : this.startTime.asTimeSpan().add(TimeSpan.ofMinutes(timeStepInMinutes * index)).asTime(),
                }
            ));
    }

    createSubTimeSteps() {
        const subTimeStepSize = this.timeStepSize / this.amountOfSubTimeBlocks;

        return Array.from({ length: this.amountOfTimeBlocks * this.amountOfSubTimeBlocks })
            .map((_, index) => {
                if (index % this.amountOfSubTimeBlocks === 0) {
                    return null;
                }
                return { position: this.config.marginSize + index * subTimeStepSize }
            })
            .filter(subTimeStep => subTimeStep != null);
    }

    createTimelineBlockProps(): TimelineBlockProps[] {
        return this.blocks
            .filter(block => {
                const blockEndTime = block.endTime ?? this.requireCurrentTime();
                const isBlockOutOfBounds = (
                    compare(blockEndTime, 'lessOrEqualThan', this.startTime) ||
                    compare(block.startTime, 'greaterOrEqualThan', this.endTime) ||
                    compare(block.startTime, 'greaterThan', blockEndTime)
                );
                return !isBlockOutOfBounds;
            })
            .map(block => {
                const blockEndTime = block.endTime ?? this.requireCurrentTime();

                const rightOverflow = compare(blockEndTime, 'greaterThan', this.endTime);
                const leftOverflow = compare(block.startTime, 'lessThan', this.startTime);

                const clampedBlockStartTime = leftOverflow ? this.startTime : block.startTime;
                const clampedBlockEndTime = rightOverflow ? this.endTime : blockEndTime;

                return {
                    block: {
                        ...block,
                        endTime: blockEndTime,
                        height: block.height ?? this.config.defaultBlockHeight
                    },
                    rightOverflow,
                    leftOverflow,
                    isOpen: block.endTime == undefined,
                    size: this.mapTimeSpanToSize(TimeSpan.ofTimeDifference(clampedBlockStartTime, clampedBlockEndTime)),
                    position: this.mapTimeToPosition(clampedBlockStartTime)
                };
            });
    }

    createTimelineMarkerProps(markers: TimelineMarker[] = []): TimelineMarkerProps[] {
        return markers
            .filter(marker => {
                const isMakerOutOfBounds = (
                    compare(marker.time, 'lessThan', this.startTime) ||
                    compare(marker.time, 'greaterThan', this.endTime)
                );
                return !isMakerOutOfBounds;
            })
            .map(marker => (
                {
                    marker: {
                        ...marker,
                        height: marker.height ?? this.config.defaultMarkerHeight,
                        color: marker.color ?? this.config.theme.defaultMarkerColor
                    },
                    position: this.mapTimeToPosition(marker.time)
                }
            ));
    }

    createTimelineBackgroundImageGradient() {
        const mainSize = `${100 - this.config.marginSize}%`;
        const marginColor = this.config.theme.marginColor;
        const backgroundColor = this.config.theme.backgroundColor;

        return `linear-gradient(
            to right,
            ${marginColor} ${this.config.marginSize}%,
            ${backgroundColor} ${this.config.marginSize}%,
            ${backgroundColor} ${mainSize},
            ${marginColor} ${mainSize}
        )`;
    }

    private requireCurrentTime(): Time {
        if (!this.config.currentTime) {
            throw new Error();
        }
        return this.config.currentTime;
    }

    private calculateStartTimeIfOverflowing(data: TimelineBlock[], startTime: Time) {
        const startTimeOfEarliestBlock = this.getEarliestBlock(data)?.startTime;

        if (startTimeOfEarliestBlock && compare(startTimeOfEarliestBlock, 'lessThan', startTime)) {
            return Time.of(
                startTimeOfEarliestBlock.hours(),
                startTimeOfEarliestBlock.minutes() >= 30 ? 30 : 0
            );
        }
    }

    private calculateEndTimeIfOverflowing(data: TimelineBlock[], endTime: Time, currentTime: Time) {
        const latestBlock = this.getLatestBlock(data, currentTime);
        const endTimeOfLatestBlock = latestBlock ? latestBlock.endTime ?? currentTime : undefined;

        if (endTimeOfLatestBlock && compare(endTimeOfLatestBlock, 'greaterThan', endTime)) {
            const minutes = endTimeOfLatestBlock.minutes();
            const hours = endTimeOfLatestBlock.hours();
            if (minutes == 0) {
                return Time.of(hours, 0);
            } else if (minutes > 30) {
                return Time.of(hours + 1, 0);
            } else {
                return Time.of(hours, 30);
            }
        }
    }

    private getEarliestBlock(data: TimelineBlock[]) {
        return data.sort((a, b) => a.startTime.compareTo(b.startTime)).at(0);
    }

    private getLatestBlock(data: TimelineBlock[], currentTime: Time) {
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
        return percentageOfActiveArea * this.activeAreaSize + this.config.marginSize;
    }

    private mapTimeSpanToSize(timeSpan: TimeSpan) {
        return TimeSpan.ratio(timeSpan, this.activeAreaTimeSpan) * this.activeAreaSize;
    }

    private calculateStartTime() {
        return (
            this.config.automaticTimeBoundsOnOverflow &&
            this.calculateStartTimeIfOverflowing(this.blocks, this.config.startTime) ||
            this.config.startTime
        );
    }

    private calculateEndTime() {
        return (
            this.config.automaticTimeBoundsOnOverflow &&
            this.calculateEndTimeIfOverflowing(this.blocks, this.config.endTime, this.requireCurrentTime()) ||
            this.config.endTime
        );
    }

    private calculateAmountOfTimeSteps() {
        const wasStartOrEndTimeAdjusted = !this.startTime.equals(this.config.startTime) || !this.endTime.equals(this.config.endTime);
        return (
            wasStartOrEndTimeAdjusted || this.config.automaticAmountOfTimeSteps
                ? this.calculateAutomaticTimeSteps()
                : this.config.amountOfTimeSteps
        );
    }

}
