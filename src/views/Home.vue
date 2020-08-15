<template>
    <div id="app">
        <router-view></router-view>
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
                <b-navbar-item tag="div">
                    <div class="buttons">
                        <b-button @click="snap" icon-right="camera" />
                    </div>
                </b-navbar-item>
                <b-navbar-item tag="div">
                    <b-dropdown aria-role="list">
                        <button class="button is-primary" slot="trigger">
                            <span>GIF Speed</span>
                            <b-icon icon="menu-down"></b-icon>
                        </button>
                        <b-dropdown-item aria-role="listitem" @click="setSpeed(1)">Normal</b-dropdown-item>
                        <b-dropdown-item aria-role="listitem" @click="setSpeed(2)">Slow</b-dropdown-item>
                    </b-dropdown>
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
        {{count}}
        <button id="hold" @mousedown="start" @mouseup="stop" @touchstart="start" @touchend="stop" @touchcancel="stop">Hold Me</button>
        <img ref="testImage" />
    </div>
</template>
<script src="./Home.js" />
<style src="./Home.css" />