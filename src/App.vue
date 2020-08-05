<template>
  <v-app>
    <video-player :options="videoOptions"/>
  </v-app>
</template>

<script>
import VideoPlayer from './components/VideoPlayer'
export default {
  name: "VideoExample",
  components: {
    VideoPlayer
  },
  data() {
    return {
      videoOptions: {
        autoplay: true,
        controls: true,
        sources: [
          {
            src:
              "http://192.168.2.103/kp1.mp4",
              type: "video/mp4"
          }
        ]
      }
    };
  }
};
</script>
