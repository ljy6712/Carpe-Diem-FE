import React, { useState, useEffect, useRef } from 'react';
import config from '../../config';
import * as io from 'socket.io-client';

import constraints from '../../common/constraints';

const socket = io.connect(`http://${config.server.host}:5000`);

function RemoteCamera() {
    const wrapRef = useRef<any>(null);
    const secondRef = useRef<any>(null);
    const videoRef = useRef<any>(null);
    let myStream: any;
    let myPeerConnection: any;
    const roomName: any = 'test';

    useEffect(() => {
        handleWelcomeSubmit();
    }, []);

    async function initCall() {
        await getMedia();
        makeConnection();
    }

    async function handleWelcomeSubmit() {
        await initCall();
        console.log('152');
        socket.emit('join_room', roomName);
    }

    async function getCameras() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const cameras = devices.filter((devices) => devices.kind === 'videoinput');
            const currentCamera = myStream.getVideoTracks()[0];
            // console.log(devices);
            // console.log(cameras);
            // console.log(myStream.getVideoTracks()); // 현재 선택된 비디오를 알 수 있음(id는 알 수 없고 label값으로 유추가능)
            cameras.forEach((camera) => {
                const option = document.createElement('option');
                option.value = camera.deviceId; // camera id 가져옴
                option.innerText = camera.label; // camera 이름 가져옴
                if (currentCamera.label == camera.label) {
                    // 가져온 camera label 과 현재 사용중인 카메라가 동일할 떄 선택된 카메라라고 알려줌
                    option.selected = true;
                }
                // camerasSelect.appendChild(option);
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function getMedia(deviceId?: any) {
        const initialConstraints = {
            // 초기 deviceId 를 넘겨주지 않을 경우
            audio: true,
            video: { facingMode: 'user' },
        };
        const cameraConstraints = {
            audio: true,
            video: { deviceId: { exact: deviceId } }, // 굳이 exact 옵션을 안써도 되긴 하는데, deviceId를 받았으므로 exact 옵션을 함께 써준다.
        };
        try {
            myStream = await navigator.mediaDevices.getUserMedia(
                deviceId ? cameraConstraints : initialConstraints, // deviceId 를 받은 경우 실행하는 func, 안받은 경우 실행하는 func를 다르게 둠
            );
            console.log('!!!');
            videoRef.current.srcObject = myStream;
            if (!deviceId) {
                await getCameras(); // select에 카메라 리스트 띄움 -> 맨처음에 카메라 정보가 없을 때 최초 한번만 실헹
            }
        } catch (e) {
            console.log(e);
        }
    }
    socket.on('offer', async (offer) => {
        // console.log(offer);
        console.log('received the offer');
        myPeerConnection.setRemoteDescription(offer);
        const answer = await myPeerConnection.createAnswer();
        // console.log(answer); // PeerB의 answer 정보 전송
        myPeerConnection.setLocalDescription(answer);
        socket.emit('answer', answer, roomName);
        console.log('sent the answer');
    });

    // RTC Code
    function makeConnection() {
        // peerConnection을 각 브라우저에 만들어준다.
        myPeerConnection = new RTCPeerConnection({
            iceServers: [
                { urls: ['stun:ntk-turn-1.xirsys.com'] },
                {
                    username: 'LWvrShK7ZsHj9S1yGqvstsNVMtqt6doYku7Qe3RsMGHKSARd3Wga5gKbNWpnWI7UAAAAAGLEDUdzdWd5ZW9uZw==',
                    credential: '3799e2bc-fc4a-11ec-933b-0242ac120004',
                    urls: [
                        'turn:ntk-turn-1.xirsys.com:80?transport=udp',
                        'turn:ntk-turn-1.xirsys.com:3478?transport=udp',
                        'turn:ntk-turn-1.xirsys.com:80?transport=tcp',
                        'turn:ntk-turn-1.xirsys.com:3478?transport=tcp',
                        'turns:ntk-turn-1.xirsys.com:443?transport=tcp',
                        'turns:ntk-turn-1.xirsys.com:5349?transport=tcp',
                    ],
                },
            ],
        });

        // console.log(myStream.getTracks()); // 내 브라우저에 연결된 audio, video track 정보
        myPeerConnection.addEventListener('icecandidate', handleIce);
        myPeerConnection.addEventListener('addstream', handleAddStream);
        myStream // 양쪽 브라우저의 카메라, 마이크 데이터 stream 을 받아와서 그걸 연결 안에 집어넣어줌
            .getTracks()
            .forEach((track: any) => myPeerConnection.addTrack(track, myStream));
    }

    function handleIce(data: any) {
        socket.emit('ice', data.candidate, roomName);
        console.log('sent candidate');
        // console.log(data);
    }

    // CHECK 새로운 사용자 웹 요소로 추가
    function handleAddStream(data: any) {
        // const peersStream: any = document.getElementById('peersStream');
        // console.log("got an stream from my peer");
        console.log("Peer's Stream", data.stream);
        console.log('My Stream', myStream);
        secondRef.current.srcObject = data.stream;
    }

    // CHECK 미디어 수신 (peer A 의 방)
    // Socket Code
    // PeerA : createOffer(), setLocalDescription()
    socket.on('welcome', async () => {
        // PeerA 브라우저에서만 발생
        // 누군가가 방에 들어왔을 때 실행
        const offer = await myPeerConnection.createOffer();
        myPeerConnection.setLocalDescription(offer);
        // console.log(offer);
        // console.log("someone joined!");
        console.log('sent the offer');
        socket.emit('offer', offer, roomName); // 접속한 socket.io 방으로 PeerA의 session정보를 보냄
    });

    // CHECK 미디어 송신 (peer B 의 방)
    // PeerB : PeerA -> server 로 부터 offer 정보를 받음
    socket.on('offer', async (offer) => {
        // console.log(offer);
        console.log('received the offer');
        myPeerConnection.setRemoteDescription(offer);
        const answer = await myPeerConnection.createAnswer();
        // console.log(answer); // PeerB의 answer 정보 전송
        myPeerConnection.setLocalDescription(answer);
        socket.emit('answer', answer, roomName);
        console.log('sent the answer');
    });

    // PeerA : answer로 부터 PeerB의 정보가 넘어오면 setRemoteDescription을 해줌
    socket.on('answer', (answer) => {
        console.log('received the answer');
        myPeerConnection.setRemoteDescription(answer);
    });

    // iceCandidate 받은 걸 저장함
    socket.on('ice', (ice) => {
        console.log('received candidate');
        myPeerConnection.addIceCandidate(ice);
    });

    return (
        <>
            <div>
                {/* {recordStarted ? <button style={onairButton}>ON AIR</button> : <button style={offairButton}>ON AIR</button>} */}
                <div
                    ref={wrapRef}
                    id="wrap"
                    style={{
                        borderStyle: 'none',
                        width: constraints.video.width,
                        height: constraints.video.height,
                    }}
                >
                    <div>
                        <video ref={videoRef} autoPlay muted width={constraints.video.width} height={constraints.video.height} />
                        <video ref={secondRef} autoPlay muted width={constraints.video.width} height={constraints.video.height} />
                        {/* {camStarted ? (
                        ) : (
                            <Rotate>
                                <TbLoader size="50" style={{ padding: 0 }} />
                            </Rotate>
                        )} */}
                    </div>
                </div>
                <div>
                    {/* <OnButton onClick={() => setCamStarted(true)}>ON</OnButton>
                    <OffButton onClick={() => setCamStarted(false)}>OFF</OffButton> */}
                </div>
            </div>
        </>
    );
}

export default RemoteCamera;
