// Import các thành phần giao diện từ Material-UI
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PhoneIcon from "@material-ui/icons/Phone";

// Import các hooks và thư viện cần thiết từ React
import React, { useEffect, useRef, useState } from "react";

// Import thư viện sao chép văn bản vào clipboard
import { CopyToClipboard } from "react-copy-to-clipboard";

// Import thư viện WebRTC cho kết nối peer-to-peer .Mạng ngang hàng kết nối với nhau thông qua Internet
//và chia sẻ dữ liệu mà không cần đến máy chủ trung tâm
import Peer from "simple-peer";

// Import thư viện để kết nối với WebSocket server
import io from "socket.io-client";

// Import file CSS cho thành phần này
import "./DoctorCall.scss";

// Import thành phần header tùy chỉnh
import HomeHeader from "../HomePage/HomeHeader";
import { FormattedMessage } from "react-intl";

// Kết nối tới máy chủ WebSocket với URL từ biến môi trường
const socket = io.connect(process.env.REACT_APP_BACKEND_URL);
function DoctorCall() {
  // Khai báo các biến trạng thái cho thành phần
  const [me, setMe] = useState(""); // ID của người dùng hiện tại
  const [stream, setStream] = useState(); // Stream video và audio của người dùng
  const [receivingCall, setReceivingCall] = useState(false); // Trạng thái có đang nhận cuộc gọi không
  const [caller, setCaller] = useState(""); // ID của người gọi
  const [callerSignal, setCallerSignal] = useState(); // Tín hiệu WebRTC của người gọi
  const [callAccepted, setCallAccepted] = useState(false); // Trạng thái có chấp nhận cuộc gọi không
  const [idToCall, setIdToCall] = useState(""); // ID của người mà mình muốn gọi
  const [callEnded, setCallEnded] = useState(false); // Trạng thái cuộc gọi có kết thúc không
  const [name, setName] = useState(""); // Tên của người dùng
  const myVideo = useRef(); // Tham chiếu đến thẻ video của mình
  const userVideo = useRef(); // Tham chiếu đến thẻ video của người khác
  const connectionRef = useRef(); // Tham chiếu đến đối tượng kết nối WebRTC (Web Real-Time Communications) là một tập hợp các hàm lập trình
  //dùng cho việc liên lạc thời gian thực bằng video, âm thanh

  // Thiết lập useEffect để khởi tạo stream video và lắng nghe sự kiện từ socket
  useEffect(() => {
    // Yêu cầu quyền truy cập vào camera và microphone của người dùng
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream); // Lưu stream vào trạng thái
        myVideo.current.srcObject = stream; // Gán stream vào thẻ video của mình
      });

    // Lắng nghe sự kiện "me" để nhận ID của người dùng từ máy chủ
    socket.on("me", (id) => {
      setMe(id);
    });

    // Lắng nghe sự kiện "callUser" khi có cuộc gọi đến
    socket.on("callUser", (data) => {
      setReceivingCall(true); // Đặt trạng thái đang nhận cuộc gọi
      setCaller(data.from); // Lưu ID của người gọi
      setName(data.name); // Lưu tên của người gọi
      setCallerSignal(data.signal); // Lưu tín hiệu WebRTC của người gọi
    });
  }, []);

  // Hàm gọi người dùng khác
  const callUser = (id) => {
    // Tạo kết nối WebRTC mới với vai trò là người khởi tạo
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    // Khi nhận được tín hiệu từ WebRTC
    peer.on("signal", (data) => {
      // Gửi tín hiệu đến máy chủ để gọi người dùng khác
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });

    // Khi nhận được stream video từ người dùng khác
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream; // Gán stream vào thẻ video của người dùng khác
    });

    // Lắng nghe sự kiện "callAccepted" khi cuộc gọi được chấp nhận
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true); // Đặt trạng thái cuộc gọi được chấp nhận
      peer.signal(signal); // Gửi tín hiệu để hoàn tất kết nối WebRTC
    });

    connectionRef.current = peer; // Lưu đối tượng kết nối WebRTC vào tham chiếu
  };

  // Hàm trả lời cuộc gọi
  const answerCall = () => {
    setCallAccepted(true); // Đặt trạng thái cuộc gọi được chấp nhận
    // Tạo kết nối WebRTC mới với vai trò là người nhận cuộc gọi
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    // Khi nhận được tín hiệu từ WebRTC
    peer.on("signal", (data) => {
      // Gửi tín hiệu đến máy chủ để trả lời cuộc gọi
      socket.emit("answerCall", { signal: data, to: caller });
    });

    // Khi nhận được stream video từ người gọi
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream; // Gán stream vào thẻ video của người gọi
    });

    peer.signal(callerSignal); // Gửi tín hiệu để hoàn tất kết nối WebRTC
    connectionRef.current = peer; // Lưu đối tượng kết nối WebRTC vào tham chiếu
  };

  // Hàm kết thúc cuộc gọi
  const leaveCall = () => {
    setCallEnded(true); // Đặt trạng thái cuộc gọi kết thúc
    if (connectionRef.current) {
      connectionRef.current.destroy(); // Phá hủy kết nối WebRTC
    }
    window.location.reload(); // Reload page to reset states and UI
  };
  // // Hàm xử lý sự kiện khi người dùng nhấp vào nút "Copy ID"
  // const handleCopyID = () => {
  //   // Sao chép nội dung vào clipboard
  //   navigator.clipboard.writeText(me);
  //   // Thông báo cho người dùng biết rằng nội dung đã được sao chép thành công
  //   alert("ID copied to clipboard", me);
  // };
  // Trả về giao diện người dùng của thành phần
  return (
    <>
      <HomeHeader /> {/* Hiển thị header của trang chủ */}
      <div className="container-call-video container-fluid">
        <div className="tilte">
          <FormattedMessage id={"call-video.telemedicine"} />
        </div>
        <div className="video-container row">
          <div className="video col-1 me-3">
            <span className="title-video pb-2">
              <FormattedMessage id={"call-video.your-screen"} />
            </span>
            {/* Hiển thị video của mình */}
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
            <span className="title-video">
              <FormattedMessage id={"call-video.patient-monitor"} />
            </span>
            {/* Hiển thị video của người dùng khác nếu cuộc gọi được chấp nhận và chưa kết thúc */}
            {callAccepted && !callEnded ? (
              <video
                playsInline
                ref={userVideo}
                autoPlay
                style={{ width: "900px", height: "580px" }}
              />
            ) : null}
          </div>
          <div className="myId col-2">
            {/* Trường nhập tên của người dùng */}
            <TextField
              id="filled-basic"
              label="Name"
              variant="filled"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ marginBottom: "20px" }}
            />
            {/* Trường nhập ID của người muốn gọi */}
            <TextField
              id="filled-basic"
              label="ID to call"
              variant="filled"
              value={idToCall}
              onChange={(e) => setIdToCall(e.target.value)}
            />
            <div className="call-button">
              {/* Nút kết thúc cuộc gọi hoặc gọi người dùng khác */}
              {callAccepted && !callEnded ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={leaveCall}>
                  <FormattedMessage id={"call-video.end-call"} />
                </Button>
              ) : (
                <IconButton
                  color="primary"
                  aria-label="call"
                  onClick={() => callUser(idToCall)}>
                  <PhoneIcon fontSize="large" />
                </IconButton>
              )}
              {idToCall}
            </div>
          </div>
        </div>

        <div>
          {/* Hiển thị thông báo và nút trả lời khi có cuộc gọi đến */}
          {receivingCall && !callAccepted ? (
            <div className="caller">
              <h1>{name} <FormattedMessage id={"call-video.is-calling"} /></h1>
              <Button variant="contained" color="primary" onClick={answerCall}>
                <FormattedMessage id={"call-video.answer"} />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

//Xuất thành phần DoctorCall để có thể sử dụng ở nơi khác trong ứng dụng
export default DoctorCall;
