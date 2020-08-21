<template>
    <div id="gallery">
        <button @click="back()">GO Back</button>
        <h3>{{ watch_history }} </h3>
    </div>
</template>
<script>
import { db } from '../plugins/firebase';
export default {
    name: 'WatchHistory',
    data() {
        return {

        }
    },
    firestore() {
        return {
            watch_history: db.collection("watch_history")
        }
    },
    methods: {
        back(){
            this.$router.replace({path: '/'})
        }
    }
}
</script>