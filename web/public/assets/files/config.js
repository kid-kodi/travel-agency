import os from "os";

export default {
  mediasoup: {
    workerNum: Object.keys(os.cpus()).length,
    workerSettings: {
      logLevel: "warn",
      logTags: [
        "info",
        "ice",
        "dtls",
        "rtp",
        "srtp",
        "rtcp",
        "rtx",
        "bwe",
        "score",
        "simulcast",
        "svc",
        "sctp",
      ],
      rtcMinPort: process.env.MEDIASOUP_MIN_PORT || 40000,
      rtcMaxPort: process.env.MEDIASOUP_MAX_PORT || 40100,
    },
    routerOptions: {
      mediaCodecs: [
        {
          kind: "audio",
          mimeType: "audio/opus",
          clockRate: 48000,
          channels: 2,
        },
        {
          kind: "video",
          mimeType: "video/VP8",
          clockRate: 90000,
          parameters: {
            "x-google-start-bitrate": 1000,
          },
        },
        {
          kind: "video",
          mimeType: "video/VP9",
          clockRate: 90000,
          parameters: {
            "profile-id": 2,
            "x-google-start-bitrate": 1000,
          },
        },
        {
          kind: "video",
          mimeType: "video/h264",
          clockRate: 90000,
          parameters: {
            "packetization-mode": 1,
            "profile-level-id": "4d0032",
            "level-asymmetry-allowed": 1,
            "x-google-start-bitrate": 1000,
          },
        },
        {
          kind: "video",
          mimeType: "video/h264",
          clockRate: 90000,
          parameters: {
            "packetization-mode": 1,
            "profile-level-id": "42e01f",
            "level-asymmetry-allowed": 1,
            "x-google-start-bitrate": 1000,
          },
        },
      ],
    },
    webRtcTransportOptions: {
      listenIps: [
        {
          ip: process.env.MEDIASOUP_LISTEN_IP || "0.0.0.0", //docker IP
          announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP || "196.70.254.249", // Set it to local or public IP
          // announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP || "192.168.1.17", // Set it to local or public IP
        },
      ],
      initialAvailableOutgoingBitrate: 1000000,
      minimumAvailableOutgoingBitrate: 100000,
      maxSctpMessageSize: 262144,
      // Additional options that are not part of WebRtcTransportOptions.
      maxIncomingBitrate: 1500000,
    },
    plainRtpTransport: {
      listenIp: {
        ip: process.env.MEDIASOUP_LISTEN_IP || "0.0.0.0",
        announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP || "196.70.254.249",
        // announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP || "192.168.1.17",
      }, // TODO: Change announcedIp to your external IP or domain name
      rtcpMux: true,
      comedia: false,
    },
  },
};
