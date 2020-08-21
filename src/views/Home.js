/*


Fixed GIF won't upload
Started messing with vue-firestore


 */


import videojs from "video.js/dist/alt/video.core.js";
import gifshot from "gifshot";
import captureVideoFrame from '../plugins/capture-video-frame.js'
import uploadImage from '../plugins/upload.js'
import { db } from '../plugins/firebase';
import downloadURI from '../plugins/download'
export default {
    name: "Home",
    components: {

    },
    props: {

    },
    data() {
        return {
            player: null,
            host: false,
            drawer: null,
            isLoading: false,
            isFullPage: true,
            file: null,
            snapshoter: null,
            cloudName: "partywatch",
            unsignedUploadPreset: "iumctgbb",
            count: 0,
            video_url: null,
            gifSpeed: 1

        };
    },
    methods: {
        testRoute(){
            this.$router.push({path: 'watched'})
        },
        snap() {
            var frame = captureVideoFrame("my-video_html5_api", "png");
            console.log(frame);
            uploadImage(frame.dataUri)
            this.$refs.testImage.src = frame.dataUri

        },
        start() {
            console.log("Start");
            if (!this.interval) {
                this.interval = setInterval(() => this.count++, 1000);
            }
        },
        stop() {
            console.log("Stop");
            clearInterval(this.interval);
            this.interval = false;
            this.gif(this.count);
            this.count = 0;
        },

        gif(EndTime) {
            //alert("hello");
            gifshot.createGIF({
                    video: [this.video_url],
                    numWorkers: 5,
                    gifWidth: 600,
                    // Desired height of the image
                    gifHeight: 400,
                    text: "#DBS",
                    frameDuration: this.gifSpeed,
                    offset: (this.$refs.videoPlayer.currentTime - EndTime) - 1.5,
                    numFrames: (EndTime + 1) * 10,
                    progressCallback: function(captureProgress) {
                        console.log(captureProgress)
                        if (captureProgress === 1) {
                            alert("Captured Completed")
                        }
                    },
                    completeCallback: function() {
                        console.log("Processing Finished")
                    }
                },
                function(obj) {
                    if (!obj.error) {
                        var image = obj.image,
                            animatedImage = document.createElement("img");
                        animatedImage.src = image;
                        document.body.appendChild(animatedImage);
                        var t = confirm(`Click Ok to save it to Cloud and
                         Click Cancel to save it locally only save gif if they contain goku's Kamehameha,
                         Lorifla getting her ass kicked,
                         Vegeta in Bad Mood, 
                         Jiren's Badass moments, 
                         Android 17 kicking everyone's ass, 
                         Toppo being phony destoryer!`)
                        //console.log("t -> ",t)
                        if (t) {
                            uploadImage(image)
                        } else {
                            downloadURI(image, `${new Date().getTime().toString()}.gif`)
                        }
                    }
                }
            )
        },
        setSpeed(s) {
            this.gifSpeed = s
        },
        openLoading() {
            this.isLoading = true;
            setTimeout(() => {
                this.isLoading = false;
            }, 4000);
        },
        loadVideo(event) {
            var videoFile = event.target.files[0];
            var url = URL.createObjectURL(videoFile);
            console.log(url);
            this.player.src({
                type: "video/mp4",
                src: url,
            });
        },
        playEvent() {
            if (this.host && this.$refs.videoPlayer.readyState === 4) {
                console.log("Played!");
                this.$socket.client.emit(
                    "play_request",
                    this.$refs.videoPlayer.currentTime
                );
                console.log(this.$refs.videoPlayer.currentTime);
            }
        },
        pauseEvent() {
            if (this.host && this.$refs.videoPlayer.readyState === 4) {
                console.log("Paused!");
                this.$socket.client.emit(
                    "pause_request",
                    this.$refs.videoPlayer.currentTime
                );
                console.log(this.$refs.videoPlayer.currentTime);
            }
        },
        seekedEvent() {
            if (this.host) {
                console.log("Seeked!");
                this.$socket.client.emit(
                    "seeked_request",
                    this.$refs.videoPlayer.currentTime
                );
            }
        },
        Host() {
            this.$confirm({
                auth: true,
                message: `Are you hosting ?`,
                button: {
                    no: "No",
                    yes: "Yes",
                },
                callback: (confirm, password) => {
                    if (confirm && password == "master") {
                        this.host = true;
                        this.$buefy.notification.open({
                            message: "You're hosting!",
                            type: "is-success",
                            hasIcon: true,
                            position: "is-bottom-right",
                        });
                    } else {
                        this.$buefy.notification.open({
                            message: "You're not hosting!",
                            type: "is-danger",
                            hasIcon: true,
                            position: "is-bottom-right",
                        });
                    }
                },
            });
        },
        hostTime() {
            this.$socket.client.emit("client_request_time");
        },
    },
    created() {
        this.openLoading();
    },
    firestore() {
        return {
            watch_history: db.collection("watch_history")
        }
    },
    // firestore(){
    //     return{
    //         watch_history:{
    //             ref: firestore.collection('watch_history'),
    //             objects: true,
    //             resolve: (data) =>
    //         }
    //     }
    // },
    watch: {
        file: function(event) {
            var url = URL.createObjectURL(event);
            this.video_url = url;
            this.player.src({
                type: "video/mp4",
                src: url,
            });
            this.$firestore.watch_history.add({
                Time: new Date().toString(),
                Video_Name: event.name,
                Video_Size: event.size / 1e+6 + " mb",
                Watched_At: window.location.href

            })
        },
        status: function() {
            alert("Changed");
        },
    },
    sockets: {
        play_response(time) {
            if (this.$refs.videoPlayer.readyState === 4 && this.host == false) {
                this.$refs.videoPlayer.currentTime = parseFloat(
                    time.currentTime
                );
                console.log(`Play response from server ${time.currentTime}`);
                this.$refs.videoPlayer.play();
            }
        },
        pause_response(time) {
            if (this.$refs.videoPlayer.readyState === 4 && this.host == false) {
                this.$refs.videoPlayer.currentTime = parseFloat(
                    time.currentTime
                );
                console.log(`Pause response from server ${time.currentTime}`);
                this.$refs.videoPlayer.pause();
            }
        },
        request_time() {
            if (this.host) {
                this.$socket.client.emit(
                    "host_response_time",
                    this.$refs.videoPlayer.currentTime
                );
            }
        },
        response_time(time) {
            if (!this.host) {
                this.$refs.videoPlayer.currentTime = parseFloat(time.host_time);
            }
        },
        seeked_response(time) {
            if (!this.host) {
                this.$refs.videoPlayer.currentTime = parseFloat(
                    time.currentTime
                );
                console.log(time);
            }
        },
    },
    mounted() {
        this.player = videojs(this.$refs.videoPlayer, function onPlayerReady() {
            console.log("onPlayerReady", this);
        });
        this.Host();
    },
};