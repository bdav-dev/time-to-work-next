import TimeSpan from "@/time/TimeSpan";
import Time from "@/time/Time";
import { BookingBlockProps } from "@/components/timeline/components/TimelineBlock";
import { TimelineData } from "@/components/timeline/Timeline";
import { compare } from "@/util/CompareUtils";

export class TimelineCalculator {
    readonly startTime: Time;
    readonly endTime: Time;
    readonly offTimeSize: number;
    readonly amountOfTimeSteps: number;

    readonly amountOfTimeBlocks: number;
    readonly amountOfSubTimeBlocks: number;

    readonly activeAreaSize: number;
    readonly activeAreaTimeSpan: TimeSpan;

    readonly timeStepSize: number;

    constructor(configuration: {
        startTime: Time,
        endTime: Time,
        offTimeSize: number,
        amountOfTimeSteps: number,
        amountOfSubTimeSteps: number,
    }) {
        this.startTime = configuration.startTime;
        this.endTime = configuration.endTime;
        this.offTimeSize = configuration.offTimeSize;
        this.amountOfTimeSteps = configuration.amountOfTimeSteps;

        this.amountOfTimeBlocks = configuration.amountOfTimeSteps - 1;
        this.amountOfSubTimeBlocks = configuration.amountOfSubTimeSteps + 1;

        this.activeAreaSize = 100 - 2 * this.offTimeSize;
        this.activeAreaTimeSpan = TimeSpan.ofTimeDifference(this.startTime, this.endTime);

        this.timeStepSize = this.activeAreaSize / this.amountOfTimeBlocks;
    }

    private mapTimeToPosition(time: Time) {
        const percentageOfActiveArea = TimeSpan.ratio(
            TimeSpan.ofTimeDifference(this.startTime, time),
            this.activeAreaTimeSpan
        );
        return percentageOfActiveArea * this.activeAreaSize + this.offTimeSize;
    }

    private mapTimeSpanToSize(timeSpan: TimeSpan) {
        return TimeSpan.ratio(timeSpan, this.activeAreaTimeSpan) * this.activeAreaSize;
    }

    createTimeSteps() {
        const timeStep = this.activeAreaTimeSpan.divide(this.amountOfTimeBlocks);

        const timeSteps = [];
        for (let i = 0; i < this.amountOfTimeSteps; i++) {
            timeSteps.push({
                position: this.offTimeSize + i * this.timeStepSize,
                time: this.startTime.asTimeSpan().add(timeStep.multiply(i)).asTime(),
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
            subTimeSteps.push({ position: this.offTimeSize + i * subTimeStepSize });
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

    createTimelineBackgroundImageGradient(offTimeColor: string) {
        const mainSize = `${100 - this.offTimeSize}%`;

        return `linear-gradient(
            to right,
            ${offTimeColor} ${this.offTimeSize}%,
            transparent ${this.offTimeSize}%,
            transparent ${mainSize},
            ${offTimeColor} ${mainSize}
        )`;
    }

    calculateNowLinePosition(currentTime: Time) {
        return this.mapTimeToPosition(currentTime);
    }
}