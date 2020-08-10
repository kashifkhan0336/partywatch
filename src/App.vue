<template>
    <div id="app">
        <b-loading :is-full-page="isFullPage" animation="zoom-out" :active.sync="isLoading" :can-cancel="false">
        </b-loading>
        <b-navbar fixed-top>
            <template slot="brand">
                <b-navbar-item tag="router-link" :to="{ path: '/' }">
                    <b-icon icon="view-dashboard" size="is-large" type="is-primary">
                    </b-icon>
                </b-navbar-item>
            </template>
            <template slot="start">
            </template>
            <template slot="end">
                <b-navbar-item tag="div">
                    <div class="buttons">
                        <a class="button is-primary">
                            <strong>Watch History</strong>
                        </a>
                    </div>
                </b-navbar-item>
                <b-navbar-item tag="div">
                    <div class="buttons">
                        <b-field class="file">
                            <b-upload v-model="file" @change="loadVideo">
                                <a class="button is-primary">
                                    <b-icon icon="upload"></b-icon>
                                    <strong>Load Video</strong>
                                </a>
                            </b-upload>
                            <span class="file-name" v-if="file">
                                {{ file.name }}
                            </span>
                        </b-field>
                    </div>
                </b-navbar-item>
                <b-navbar-item tag="div">
                    <div class="buttons">
                        <b-button v-if="!host" @click="hostTime" type="is-primary" icon-right="cached" />
                    </div>
                </b-navbar-item>
            </template>
        </b-navbar>
        <vue-confirm-dialog v-show="isLoading === false"></vue-confirm-dialog>
        <b-notification auto-close duration="3000" :active.sync="$socket.connected" type="is-success" has-icon aria-close-label="Close notification" position="is-bottom-right">
            You're Connected
        </b-notification>
        <div class="video-js-responsive-container vjs-hd">
            <video @seeked="seekedEvent" @play="playEvent" @pause="pauseEvent" ref="videoPlayer" id="my-video" class="video-js" controls preload="auto" width="640" height="264" poster="" data-setup="{}">
            </video>
        </div>
    </div>
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
            isLoading: false,
            isFullPage: true,
            file: null,

        }
    },
    created() {
        this.$vuetify.theme.dark = false;
        this.openLoading();
    },
    watch: {
        file: function(event) {
            //var videoFile = event.target.files[0]
            var url = URL.createObjectURL(event);
            console.log(url)
            this.player.src({
                type: "video/mp4",
                src: url,
            });
        },
        status: function() {
            alert("Changed")
        }
    },
    sockets: {
        reply(msg) {
            console.log(msg)
        },
        play_response(time) {
            if (this.$refs.videoPlayer.readyState === 4 && this.host == false) {
                this.$refs.videoPlayer.currentTime = parseFloat(time.currentTime)
                console.log(`Play response from server ${time.currentTime}`)
                this.$refs.videoPlayer.play()
            }

        },
        pause_response(time) {
            if (this.$refs.videoPlayer.readyState === 4 && this.host == false) {
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
        },
        seeked_response(time) {
            if (!this.host) {
                this.$refs.videoPlayer.currentTime = parseFloat(time.currentTime)
                console.log(time)
            }
        }
    },
    computed() {

    },
    methods: {
        openLoading() {
            this.isLoading = true
            setTimeout(() => {
                this.isLoading = false
            }, 4000)

        },
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
            if (this.host && this.$refs.videoPlayer.readyState === 4) {
                console.log("Played!");
                this.$socket.client.emit('play_request', this.$refs.videoPlayer.currentTime)
                console.log(this.$refs.videoPlayer.currentTime)
            }

        },
        pauseEvent() {
            if (this.host && this.$refs.videoPlayer.readyState === 4) {
                console.log("Paused!");
                this.$socket.client.emit('pause_request', this.$refs.videoPlayer.currentTime)
                console.log(this.$refs.videoPlayer.currentTime)
            }

        },
        seekedEvent() {
            if (this.host) {
                console.log("Seeked!");
                this.$socket.client.emit('seeked_request', this.$refs.videoPlayer.currentTime)
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
                        this.host = true;
                        this.$buefy.notification.open({
                            message: "You're hosting!",
                            type: 'is-success',
                            hasIcon: true,
                            position: 'is-bottom-right',
                        })
                    } else {
                        this.$buefy.notification.open({
                            message: "You're not hosting!",
                            type: 'is-danger',
                            hasIcon: true,
                            position: 'is-bottom-right',
                        })
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
