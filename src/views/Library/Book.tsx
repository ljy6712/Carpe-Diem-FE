import React from 'react';
import { styled, ThemeProvider } from '@mui/material/styles';
import config from '../../config';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Typography from '@mui/joy/Typography';

const Div = styled('div')`
    position: relative;
    margin: auto;
    height: 250px;
    cursor: pointer;
    transition: ${({ theme }) =>
        theme.transitions.create(['transform'], {
            duration: theme.transitions.duration.standard,
        })};

    &:hover {
        transform: scale(1.1);
        .title {
            display: block;
            top: 40%;
            position: absolute;
            left: 15%;
            text-overflow: ellipsis;
        }
        .image {
            opacity: 0.2;
        }
    }
    .title {
        display: none;
        position: absolute;
        color: #fff;
        font-size: 18px;
        font-family: IBMPlexSansKR-Regular;
        font-weight: bold;
    }
`;

const Book = (props: any) => {
    return (
        <Div>
            <img
                className="image"
                style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                src={`https://${config.aws.cdn_name}/${props.album.coverImgUrl}`}
            />
            <div className="title">
                <>{console.log(props.album)}</>
                <Typography sx={{ align: 'center' }}>{dayjs(props.album.createdAt).format('YYYY년 MM월 DD일')}</Typography>
                <Typography>{props.album.title}</Typography>
            </div>
        </Div>
    );
};

export default Book;
