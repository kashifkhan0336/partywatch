<template>
    <v-app>
        <vue-confirm-dialog></vue-confirm-dialog>
        <button v-if="!host" @click="hostTime">Get Host Time</button>
        <span>{{ $socket.connected ? 'Connected' : 'Disconnected' }}</span>
        <p>Status : {{host}}</p>
        <input type="file" id="vdFile" name="" @change="loadVideo">
        <video @play="playEvent" @pause="pauseEvent" ref="videoPlayer" id="my-video" class="video-js" controls preload="auto" width="640" height="264" poster="" data-setup="{}">
        </video>
    </v-app>
</template>
<script>
import videojs from 'video.js/dist/alt/video.core.js';
export default {
    name: "App",
    components: {

    },
    data() {
        return {
            player: null,
            host: false

        }
    },
    sockets: {
        reply(msg) {
            console.log(msg)
        },
        play_response(time) {
            this.$refs.videoPlayer.currentTime = parseFloat(time.currentTime)
            console.log(`Play response from server ${time.currentTime}`)
            this.$refs.videoPlayer.play()
        },
        pause_response(time) {
            this.$refs.videoPlayer.currentTime = parseFloat(time.currentTime)
            console.log(`Pause response from server ${time.currentTime}`)
            this.$refs.videoPlayer.pause()
        },
        request_time(){
            if(this.host){
                alert("Client Asked for time")
                this.$socket.client.emit("host_response_time",this.$refs.videoPlayer.currentTime)
            }
        },
        response_time(time){
            if(!this.host){
                alert(time.host_time/60)
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
            console.log("Played!");
            this.$socket.client.emit('play_request', this.$refs.videoPlayer.currentTime)
            console.log(this.$refs.videoPlayer.currentTime)
        },
        pauseEvent() {
            console.log("Paused!");
            this.$socket.client.emit('pause_request', this.$refs.videoPlayer.currentTime)
            console.log(this.$refs.videoPlayer.currentTime)
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
        hostTime(){
          this.$socket.client.emit('client_request_time')
        }

    },
    mounted() {
        this.player = videojs(this.$refs.videoPlayer, function onPlayerReady() {
            console.log('onPlayerReady', this);
        })
        this.Host();

    }
}
</script>
<style>
</style>