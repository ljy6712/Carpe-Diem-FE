import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import styledComponents from 'styled-components';
import { styled } from '@mui/material/styles';
import { Switch } from '@mui/material';
import { TimerRounded } from '@mui/icons-material';
import InteractiveCard from '../../Card/InteractiveCard';
import Modal from '../../Camera/Modal';
import { USIM_LOADING_REQUEST } from '../../../redux/types';
import WebCamera from '../../Camera/WebCamera';
import MainLayout from '../../../components/MainLayout/MainLayout';

const StyleContent = styledComponents.div`
    font-family: IBMPlexSansKR-Regular;
    height: 100%;
    position: relative;
    min-width: 100vw;
    display: flex;
    justify-content: center;
    text-align: left;
`;

const AlignContents = styledComponents.div`
    display: flex;
    flex-direction: column;

    padding-top: 10px;
    padding-left: 50px;
    padding-right: 50px;
    padding-bottom: 50px;
    border-radius: 25px;
`;

const WebCamPage = styledComponents.section`
    display: block;
    flex-direction: row;
    text-align: center;
    margin-top: 20px;
`;

const MobileCamPage = styledComponents.section`
    display: block;
    flex-direction: row;
    text-align: center;
    margin-top: 20px;
`;

const userId = 'test';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 80,
    height: 36,
    padding: 10,
    '& .MuiSwitch-switchBase': {
        margin: 0,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(40px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h3l-1 1v2h12v-2l-1-1h3c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H4V5h16v11z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
        width: 36,
        height: 36,
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));

export default function CamContent() {
    const dispatch = useDispatch();
    const { usim } = useSelector((state: any) => state.usim);
    const [videoList, setVideoList] = useState<any[]>([]);
    const [alertClosed, setAlertClosed] = useState<any>('inline-block');
    const [switchChecked, setSwitchChecked] = useState<any>(true);

    useEffect(() => {
        dispatch({
            type: USIM_LOADING_REQUEST,
        });
    }, [dispatch]);

    const videoRenderFlag = () => {
        async function fetchData(): Promise<any> {
            const result = await axios({
                url: `/camera`,
                method: 'get',
                withCredentials: true,
            });
            return result;
        }
        fetchData()
            .then((result) => {
                setVideoList(new Array(result.data));

                console.log(result.data);
                console.log('최근 24시간 내 저장된 영상 데이터 로드 성공');
            })
            .catch((err) => {
                console.log(err);
                console.log('최근 24시간 내 저장된 영상 데이터 로드 실패');
            });
    };
    useEffect(() => {
        videoRenderFlag();
    }, []);

    return (
        <MainLayout>
            <StyleContent>
                {usim !== undefined && usim.length === 0 && <Modal />}
                <AlignContents>
                    <WebCamPage>
                        <WebCamera onVideoListRender={videoRenderFlag} />
                    </WebCamPage>
                </AlignContents>
                <div
                    style={{
                        width: '500px',
                        height: '780px',
                        paddingTop: '100px',
                        backgroundImage: `url('${process.env.PUBLIC_URL}/imgs/browser-frame.png')`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        borderRadius: '6px',
                        marginTop: '145px',
                        marginLeft: '30px',
                        textAlign: 'center',
                        boxShadow: '0 1rem 2rem rgba(0, 0, 0, 1)',
                    }}
                >
                    {/* <img
                        src={`${process.env.PUBLIC_URL}/imgs/browser.png`}
                        style={{ position: 'relative', height: '880px', width: '500px', borderRadius: '6px', zIndex: '0' }}
                    /> */}
                    <h4 style={{ color: 'black' }}>
                        <TimerRounded sx={{ marginRight: '10px' }} />
                        최근 저장된 영상
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        {videoList.length > 0 && videoList[0]?.map((videos: any, index: any) => <InteractiveCard key={index} properties={videos} />)}
                    </div>
                </div>
            </StyleContent>
        </MainLayout>
    );
}
