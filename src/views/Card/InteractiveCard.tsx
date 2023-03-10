import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import { InsertEmoticon, SentimentDissatisfied, LocalFireDepartment, Sick, SentimentVeryDissatisfiedRounded, Outlet } from '@mui/icons-material';
import OutletIcon from '@mui/icons-material/Outlet';

import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration, { Duration } from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';

import config from '../../config';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

const getTimeDiff = (timeToCompare: Dayjs): string => {
    const timeDiffDuration: Duration = dayjs.duration(dayjs().diff(timeToCompare));
    const hourDiff: number = parseInt(timeDiffDuration.format('H'));
    const minuteDiff: number = parseInt(timeDiffDuration.format('m'));
    const secondDiff: number = parseInt(timeDiffDuration.format('s'));

    const hourDiffString: string = hourDiff === 0 ? '' : `${hourDiff}시간 `;
    const minuteDiffString: string = minuteDiff === 0 ? '' : `${minuteDiff}분 `;

    return `${hourDiffString}${minuteDiffString}${secondDiff}초 전`;
};

export default function InteractiveCard(properties: any) {
    const videoList = properties;

    const expressionLabel = videoList.properties.expressionLabel;
    let emotionIcon;
    if (expressionLabel === 'happy') emotionIcon = <InsertEmoticon color="primary" sx={{ marginRight: 1, color: '#6666cc' }} />;
    else if (expressionLabel === 'sad') emotionIcon = <SentimentDissatisfied color="primary" sx={{ marginRight: 1, color: '#6666cc' }} />;
    else if (expressionLabel === 'angry') emotionIcon = <LocalFireDepartment color="primary" sx={{ marginRight: 1, color: '#6666cc' }} />;
    else if (expressionLabel === 'disgusted') emotionIcon = <Sick color="primary" sx={{ marginRight: 1, color: '#6666cc' }} />;
    else if (expressionLabel === 'fearful')
        emotionIcon = <SentimentVeryDissatisfiedRounded color="primary" sx={{ marginRight: 1, color: '#6666cc' }} />;
    else emotionIcon = <Outlet sx={{ marginRight: 1, color: '#6666cc' }} />;

    return (
        <Card
            variant="outlined"
            orientation="horizontal"
            sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                width: 400,
                gap: 2,
                my: 2,
                '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
            }}
        >
            <AspectRatio ratio="1" sx={{ width: 90 }}>
                <img src={`https://${config.aws.cdn_name}/${properties.properties.thumbnailUrl}`} loading="lazy" alt="" />
            </AspectRatio>
            <div>
                <Typography level="h2" fontSize="lg" id="card-description" mb={0.5}>
                    {getTimeDiff(dayjs(videoList.properties.createdAt))}
                </Typography>
                <Chip variant="outlined" size="md" sx={{ pointerEvents: 'none', mt: 2 }}>
                    {emotionIcon}
                    {videoList.properties.expressionLabel}
                </Chip>
            </div>
        </Card>
    );
}
