import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Peer from "simple-peer";
import io from "socket.io-client";
import Button from "@material-ui/core/Button";
import HomeHeader from "../HomePage/HomeHeader";
import "./CallVideo.scss";
import HomeFooter from "../HomePage/HomeFooter";

const socket = io.connect("http://localhost:8081");

function CallVideo() {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });

    if (token) {
      socket.emit("verifyToken", token);
      socket.on("tokenVerified", (data) => {
        if (data.success) {
          setMe(data.patientId); // Đặt ID bệnh nhân thành mã token
          console.log("Token verified", data);
        } else {
          alert("Token không hợp lệ hoặc đã hết hạn");
        }
      });
    }

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, [token]);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    window.location.reload(); // Reload page to reset states and UI
  };

  return (
    <>
      <HomeHeader />
      <div className="container-call-video container-fluid">
        <div className="title">Khám bệnh từ xa</div>
        <div className="video-container row">
          <div className="video col-1 me-3">
            <span className="title-video pb-2">Màn hình của bạn</span>
            {stream && (
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                style={{ width: "300px" }}
              />
            )}
          </div>
          <div className="video col">
            <span className="title-video">Màn hình của bác sĩ</span>
            {callAccepted && !callEnded ? (
              <video
                playsInline
                ref={userVideo}
                autoPlay
                style={{ width: "900px", height: "580px" }}
              />
            ) : (
              <div className="waiting-message">
                <div class="text-center">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
                <h4>Vui lòng đợi cuộc gọi từ bác sĩ.....</h4>
              </div>
            )}
          </div>
          <div className="myId col-2">
          {receivingCall && !callAccepted ? (
            <div className="caller">
              <h1>{name} is calling...</h1>
              <Button variant="contained" color="primary" onClick={answerCall}>
                Answer
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={leaveCall}
                style={{ marginLeft: "10px" }}>
                End Call
              </Button>
            </div>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={leaveCall}
              style={{ marginTop: "10px" }}>
              End Call
            </Button>
          )}
        </div>
        </div>
        
      </div>
    </>
  );
}

export default CallVideo;
