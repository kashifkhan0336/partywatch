<template>
    <v-app>
        <v-app-bar app clipped-left>
            <v-toolbar-title>PartyWatch</v-toolbar-title>
        </v-app-bar>
        <v-main>
            <vue-confirm-dialog></vue-confirm-dialog>
            <div id="sync-button">
                <v-btn v-if="!host" @click="hostTime" id="">Sync with host</v-btn>
            </div>
            <h3>{{ $socket.connected ? 'Connected' : 'Disconnected' }}</h3>
            <v-spacer></v-spacer>
            <p>Host : {{host}}</p>
            <input type="file" id="vdFile" name="" @change="loadVideo">
            <!-- <v-file-input dark @change="loadVideo" id="vdFile"></v-file-input> -->
            <div class="video-js-responsive-container vjs-hd">
                <video @play="playEvent" @pause="pauseEvent" ref="videoPlayer" id="my-video" class="video-js" controls preload="auto" width="640" height="264" poster="" data-setup="{}">
                </video>
            </div>
        </v-main>
    </v-app>
</template>
<script>
import videojs from 'video.js/dist/alt/video.core.js';
export default {
    name: "App",
    components: {

    },
    props: {
        source: String,
    },
    data() {
        return {
            player: null,
            host: false,
            drawer: null,

        }
    },
    created() {
        this.$vuetify.theme.dark = true
    },
    sockets: {
        reply(msg) {
            console.log(msg)
        },
        play_response(time) {
            if (this.$refs.videoPlayer.readyState === 4) {
                this.$refs.videoPlayer.currentTime = parseFloat(time.currentTime)
                console.log(`Play response from server ${time.currentTime}`)
                this.$refs.videoPlayer.play()
            }

        },
        pause_response(time) {
            if (this.$refs.videoPlayer.readyState === 4) {
                this.$refs.videoPlayer.currentTime = parseFloat(time.currentTime)
                console.log(`Pause response from server ${time.currentTime}`)
                this.$refs.videoPlayer.pause()
            }
        },
        request_time() {
            if (this.host) {
                //alert("Client Asked for time")
                this.$socket.client.emit("host_response_time", this.$refs.videoPlayer.currentTime)
            }
        },
        response_time(time) {
            if (!this.host) {
                this.$refs.videoPlayer.currentTime = parseFloat(time.host_time)
                //this.$refs.videoPlayer.pause();
            }
        }
    },
    methods: {
        loadVideo(event) {
            var videoFile = event.target.files[0]
            var url = URL.createObjectURL(videoFile);
            console.log(url)
            this.player.src({
                type: "video/mp4",
                src: url,
            });
        },
        playEvent() {
            if (this.host) {
                console.log("Played!");
                this.$socket.client.emit('play_request', this.$refs.videoPlayer.currentTime)
                console.log(this.$refs.videoPlayer.currentTime)
            }

        },
        pauseEvent() {
            if (this.host) {
                console.log("Paused!");
                this.$socket.client.emit('pause_request', this.$refs.videoPlayer.currentTime)
                console.log(this.$refs.videoPlayer.currentTime)
            }

        },
        timeUpdate(e) {
            console.log(e)
        },
        test() {
            alert("Send Message");
            this.$socket.client.emit('chat_message', "lol");
        },
        Host() {

            this.$confirm({
                auth: true,
                message: `Are you hosting ?`,
                button: {
                    no: 'No',
                    yes: 'Yes'
                },
                callback: (confirm, password) => {
                    if (confirm && password == "master") {
                        this.host = true
                    }
                }
            })
        },
        hostTime() {
            this.$socket.client.emit('client_request_time')
        }

    },
    mounted() {
        this.player = videojs(this.$refs.videoPlayer, function onPlayerReady() {
            console.log('onPlayerReady', this);
        })
        this.Host();
        //window.test = this.player

    }
}
</script>
<style>
.video-js-responsive-container.vjs-hd {
    padding-top: 56.25%;
}

.video-js-responsive-container.vjs-sd {
    padding-top: 75%;
}

.video-js-responsive-container {
    width: 100%;
    position: relative;
}

.video-js-responsive-container .video-js {
    height: 100% !important;
    width: 100% !important;
    position: absolute;
    top: 0;
    left: 0;
}

#sync-button {
    padding: 10px;
}
</style>