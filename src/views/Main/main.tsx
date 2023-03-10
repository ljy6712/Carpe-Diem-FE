import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { PersonalVideoRounded, PhoneAndroidRounded, SignLanguage } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import styled from 'styled-components';
import './main.css';
import config from '../../config';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const StyleMain = styled.section`
    position: relative;
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Title = styled.h2`
    position: relative;
    z-index: 3;
    font-size: 14vw;
    color: #fff;
    text-shadow: 0 20px 30px rgba(0, 0, 0, 0.2);
`;

const MainVideo = styled.video`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const Mask = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    user-select: none;
    mix-blend-mode: screen;
`;

const BtnSection = styled.div`
    z-index: 3;
    display: flex;
    justify-content: center;
    position: absolute;
    width: 100%;
    gap: 50%;
    top: 67%;
`;

const LoginButton = styled.img`
    width: 300px;
`;

function Main() {
    const { isAuthenticated } = useSelector((state: any) => state.auth);
    const navigate = useNavigate();

    function CameraBtn(props: any) {
        const [isOpen, setIsOpen] = useState(false);
        const [isCamPage, setIsCamPage] = useState('');

        return (
            <div style={{ display: 'flex', flexDirection: 'row', gap: 80 }}>
                <Tooltip
                    title={
                        <h6 style={{ paddingTop: '10px' }}>
                            {' '}
                            <SignLanguage sx={{ marginRight: '5px', marginBottom: '5px' }} /> 웹 캠으로 이용할래요!
                        </h6>
                    }
                    arrow
                    placement="left"
                >
                    <button
                        className={`btn web ${isOpen && isCamPage === 'web' ? 'active' : ''}`}
                        onClick={() => {
                            navigate('/camera/web');
                        }}
                    >
                        <div className="web" style={{ background: `${isOpen ? '#fff' : ''}` }}>
                            <PersonalVideoRounded sx={{ color: 'white', fontSize: 40 }} />
                        </div>
                    </button>
                </Tooltip>
                <Tooltip
                    title={
                        <h6 style={{ paddingTop: '10px' }}>
                            {' '}
                            <SignLanguage sx={{ marginRight: '5px', marginBottom: '5px' }} /> 모바일 캠으로 이용할래요!
                        </h6>
                    }
                    arrow
                    placement="right"
                >
                    <button
                        className={`btn mobile ${isOpen && isCamPage === 'mobile' ? 'active' : ''}`}
                        onClick={() => {
                            navigate('/camera/mobile');
                        }}
                    >
                        <div className="mobile" style={{ background: `${isOpen ? '#fff' : ''}` }}>
                            <PhoneAndroidRounded sx={{ color: 'white', fontSize: 40 }} />
                        </div>
                    </button>
                </Tooltip>
            </div>
        );
    }

    return (
        <>
            <Header dark={true} />
            <StyleMain>
                <MainVideo src={`https://${config.aws.cdn_name}/assets/main-video.mp4`} autoPlay loop muted />
                <Mask src={`${process.env.PUBLIC_URL}/imgs/mask.jpg`} alt="" />
                <Title>CarpeDiem</Title>
            </StyleMain>

            <BtnSection>
                {!isAuthenticated ? (
                    <NavLink to={`${config.server.protocol}://${config.server.host}:${config.server.port}/auth/google`}>
                        <LoginButton src={`${process.env.PUBLIC_URL}/imgs/btn-google-signin-light-normal-web@2x.png`} />
                    </NavLink>
                ) : (
                    <CameraBtn />
                )}
            </BtnSection>
            <Footer dark={true} />
        </>
    );
}

export default Main;
