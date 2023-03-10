import React, { useState, useRef, useEffect } from 'react';
import config from '../../config';
import dayjs from 'dayjs';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import OutletIcon from '@mui/icons-material/Outlet';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SentimentVeryDissatisfiedRoundedIcon from '@mui/icons-material/SentimentVeryDissatisfiedRounded';
import SickIcon from '@mui/icons-material/Sick';

export default function AlbumCarousel(props: any) {
    console.log('Carousel', props.cardInfo);
    const emotionType: any = (): any => {
        if (props.cardInfo.expressionLabel == 'happy') {
            return <InsertEmoticonIcon />;
        } else if (props.cardInfo.expressionLabel == 'angry') {
            return <LocalFireDepartmentIcon />;
        } else if (props.cardInfo.expressionLabel == 'fearful') {
            return <SentimentVeryDissatisfiedRoundedIcon />;
        } else if (props.cardInfo.expressionLabel == 'surprised') {
            return <OutletIcon />;
        } else if (props.cardInfo.expressionLabel == 'sad') {
            return <SentimentDissatisfiedIcon />;
        } else if (props.cardInfo.expressionLabel == 'disgusted') {
            return <SickIcon />;
        }
    };

    return (
        <div>
            <h3 style={{ fontSize: '15px', textAlign: 'center', paddingTop: '5px' }}>
                {' '}
                {dayjs(props.cardInfo.createdAt).tz('utc').format('YYYY년 MM월 DD일')}
            </h3>
            <div>
                <video controls loop src={`https://${config.aws.cdn_name}/${props.cardInfo.videoUrl}`} width="500px" height="380px"></video>
            </div>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <span style={{ marginRight: '10px' }}>
                    {emotionType()}
                    {props.cardInfo.expressionLabel}
                </span>
                <span>{props.cardInfo.comment}</span>
            </div>
        </div>
    );
}
